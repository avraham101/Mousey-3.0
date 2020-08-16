import win32api, win32con
import numpy as np
import tensorflow as tf
from tensorflow import Graph, Session
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

    def mouseMove(self, msg):
        ax, ay, az = msg.getAcc()
        gx, gy, gz = msg.getGyro()
        self.modelHandler.insert(ax, ay, az, gx, gy, gz)
        res = self.modelHandler.predict()
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

class ModelHandler:

    def __init__(self, points, path):
        self.arrSize = points
        self.arr = [None] * points
        self.head = 0
        self.items = 0
        self.pmap = {'ned': 0, 'right': 1, 'downright': 2, 'upright': 3, 'left': 4, 'upleft': 5, 'down': 6, 'downleft': 7, 'up': 8}
        self.map = {self.pmap[x]:x for x in self.pmap}
        with graph.as_default():
            self.session = Session(graph=graph)
            with self.session.as_default():
                self.model = load_model(path)

    def insert(self, ax, ay, az, gx, gy, gz):
        self.arr[self.head] = [[[ax, ay, az]], [[gx, gy, gz]]]
        if self.items < self.arrSize:
            self.items += 1
        self.head += 1
        if self.head == self.arrSize:
            self.head = 0

    def predict(self):
        if self.items == self.arrSize:
            data = []
            index = 0
            head = self.head - 1
            if head < 0:
                head = self.arrSize - 1
            for i in range(0, self.arrSize):
                if i > head:
                    index = self.arrSize + head - i
                else:
                    index = head - i
                data.extend(self.arr[index])
            data = np.float32(data)
            print('data', data.shape)
            data = data.tolist()
            try:
                K.set_session(self.session)
                with graph.as_default():
                    p = self.model.predict(data)
                    print(p)
                    p = np.argmax(p, axis=1)
                    return self.map[p[0]]
            except ValueError as e:
                print(e)
        return None

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