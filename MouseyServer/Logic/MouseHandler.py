import win32api, win32con
import numpy as np
import tensorflow as tf
from tensorflow import Graph, Session
from keras.models import Model, load_model
from keras.layers import Input, Dense, concatenate, PReLU
from keras import backend as K
from tensorflow.keras.models import load_model

# win32api.SetCursorPos((x, y))
# win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, x, y, 0, 0)
# win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, x, y, 0, 0)

graph = Graph()


class MouseHandler:

    def __init__(self, modelHandler):
        # self.modelHandler = ModelHandler(5, '.\Logic\model16.h5')
        self.modelHandler = modelHandler
        self.prevTouch = None
        self.movedLabel = 'Still'

    def mouseClick(self, msg):
        tag = None
        # print('click', len(msg.getButton()), 'state', msg.getState())
        if msg.getButton() == 'left' and msg.getState() == True:
            tag = win32con.MOUSEEVENTF_LEFTDOWN
        elif msg.getButton() == 'left' and msg.getState() == False:
            tag = win32con.MOUSEEVENTF_LEFTUP
        elif msg.getButton() == 'right' and msg.getState() == True:
            tag = win32con.MOUSEEVENTF_RIGHTDOWN
        elif msg.getButton() == 'right' and msg.getState() == False:
            tag = win32con.MOUSEEVENTF_RIGHTUP
        x, y = win32api.GetCursorPos()
        win32api.mouse_event(tag, x, y, 0, 0)

    def rollerMove(self, msg):
        x, y = win32api.GetCursorPos()
        speed = msg.getSpeed()
        speed = int(speed)
        win32api.mouse_event(win32con.MOUSEEVENTF_WHEEL, x, y, -speed * 10, 0)
        win32api.SetCursorPos((x, y + speed))
        # print('moved roller')

    def mouseMove(self, msg):
        self.prevTouch = None
        # ax, ay, az = msg.getAcc()
        # gx, gy, gz = msg.getGyro()
        # angle, diff = msg.getAngle()
        # self.modelHandler.insert(ax, ay, az, gx, gy, gz, angle, diff)
        # res = self.modelHandler.predict()
        window = msg.getWindow()
        res = self.modelHandler.predictWindow(window)
        self.movedLabel = res
        print(res)
        if res is not None:
            vx, vy = self.getSpeed(res)
            print('vx', vx, 'vy', vy)
            x, y = win32api.GetCursorPos()
            win32api.SetCursorPos((x + vx, y + vy))

    def getSpeed(self, res):
        sp = 5
        if res == 'downright':
            return sp, sp
        elif res == 'right':
            return sp, 0
        elif res == 'down':
            return 0, sp
        elif res == 'ned':
            return 0, 0
        elif res == 'upleft':
            return -sp, -sp
        elif res == 'downleft':
            return -sp, sp
        elif res == 'upright':
            return sp, -sp
        elif res == 'left':
            return -sp, 0
        # elif res == 'up':
        return 0, -sp

    def touchMove(self, msg):
        if msg.isItLastMove():
            self.prevTouch = None
            return
        if self.prevTouch is not None:
            px, py = self.prevTouch
            self.prevTouch = msg.getTouch()
            print('px', px, 'py', py)
            vx = msg.getX() - px
            vy = msg.getY() - py
            self.setMovedLabelTouch(vx, vy)
            print('vx', vx, 'vy', vy)
            x, y = win32api.GetCursorPos()
            print('x', x, 'y', y)
            win32api.SetCursorPos((x + int(vx), y + int(vy)))
        else:
            self.prevTouch = msg.getTouch()

    def setMovedLabelTouch(self, vx, vy):
        treshold = 0.5
        if abs(vx) < treshold and vy < -treshold:
            self.movedLabel = 'Up'
        elif abs(vx) < treshold and vy > treshold:
            self.movedLabel = 'Down'
        elif vx > treshold and abs(vy) < treshold:
            self.movedLabel = 'Right'
        elif vx < -treshold and abs(vy) < treshold:
            self.movedLabel = 'Left'
        elif vx > treshold and vy < -treshold:
            self.movedLabel = 'Up Right'
        elif vx < -treshold and vy < -treshold:
            self.movedLabel = 'Up Left'
        elif vx > treshold and vy > treshold:
            self.movedLabel = 'Down Right'
        elif vx < -treshold and vy > treshold:
            self.movedLabel = 'Down Left'
        # if abs(vx) < treshold and abs(vy) < treshold:
        else:
            self.movedLabel = 'Still'

    # The function return the last dir the mouse moved
    def getDirection(self):
        return self.movedLabel


class ModelHandler:

    def __init__(self, path):
        self.points = 11
        self.pmap = {'ned': 0, 'up': 1, 'upleft': 2, 'left': 3, 'downleft': 4, 'right': 5,
                     'upright': 6, 'downright': 7, 'down': 8}
        self.pmaprev = {'ned': 0, 'right': 1, 'down': 2, 'left': 3, 'upleft': 4,
                        'up': 5, 'upright': 6, 'downleft': 7, 'downright': 8}
        self.map = {self.pmap[x]: x for x in self.pmap}
        with graph.as_default():
            self.session = Session(graph=graph)
            with self.session.as_default():
                self.model, name = self.create_complex_siamese_model(p=self.points)
                self.model.load_weights(path)
                # self.model = load_model(path)

    def dense_depth_block(self, inp, N=32, extend_N=4, deapth=5):
        if deapth == 0:
            return inp
        x = None
        prev_x = None
        xs = []
        for i in range(0, deapth):
            if x is None:
                x = Dense(N)(inp)
                x = PReLU()(x)
            else:
                prev_x = x
                x = Dense(N + i * extend_N)(prev_x)
                x = PReLU()(x)
            xs.append(x)
        if len(xs) != 1:
            x = concatenate(xs)
        return x

    def create_chanel(self, size=3, deapth=5, N=32, extend_N=16):
        inp = Input(shape=size)
        x = self.dense_depth_block(inp, deapth=deapth, N=N, extend_N=extend_N)
        return inp, x

    def create_complex_siamese_model(self, p=5):
        inputs = []
        cs = []
        for i in range(p):
            inp_acc, c_acc = self.create_chanel(size=(3,), deapth=2, N=16)
            inputs.append(inp_acc)
            cs.append(c_acc)
            inp_gyro, c_gyro = self.create_chanel(size=(3,), deapth=2, N=16)
            inputs.append(inp_gyro)
            cs.append(c_gyro)
            inp_angle, c_angle = self.create_chanel(size=(1,), deapth=2, N=16)
            inputs.append(inp_angle)
            cs.append(c_angle)
        x = concatenate(cs)
        x = Dense(256)(x)
        x = PReLU()(x)
        x = Dense(128)(x)
        x = PReLU()(x)
        x = Dense(9, activation='softmax')(x)
        model = Model(inputs=inputs, outputs=x, name='complex_siamese_' + str(p) + '_model')
        model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
        return model, 'complex_siamese_' + str(p) + '_model'

    def predictWindow(self, window):
        try:
            K.set_session(self.session)
            with graph.as_default():
                p = self.model.predict(window)
                print(p)
                p = np.argmax(p, axis=1)
                return self.map[p[0]]
        except ValueError as e:
            print(e)
        return None

# tester:
# a = ModelHandler(5, 'model16.h5')
# a.insert(1, 1, 1, 1, 1, 1)
# a.insert(2, 2, 2, 2, 2, 2)
# a.insert(3, 3, 3, 3, 3, 3)
# a.insert(4, 4, 4, 4, 4, 4)
# a.insert(5, 5, 5, 5, 5, 5)
# print(a.predict())
# a.insert(6, 6, 6, 6, 6, 6)
# a.insert(7, 7, 7, 7, 7, 7)
# print(a.predict())
# print('done')
# ------------------------------------------
# x, y = win32api.GetCursorPos()
# print('x', x, 'y', y)
# win32api.mouse_event(win32con.MOUSEEVENTF_WHEEL, x, y, -1, 0)
# print('done')
