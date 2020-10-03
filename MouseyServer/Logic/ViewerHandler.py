import base64
import os
import io
import win32api
import pyautogui
from PIL import ImageDraw
import threading as Threads
from Logic import Messages

class ViewerHandler(Threads.Thread):

    def __init__(self, w, h, connectionHandler, ip, port):
        super().__init__()
        self.path = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
        self.w = w
        self.h = h
        self.connectionHandler = connectionHandler
        self.running = False
        self.ip = ip
        self.port = port

    def getCenteredScreen(self):
        screen = self.getScreen()
        x, y = self.getMousePosition()
        img = self.ceneterPicture(screen, x, y, self.w, self.h)
        return img

    def getMousePosition(self):
        x, y = win32api.GetCursorPos()
        return x, y

    def getScreen(self):
        screen = None
        try:
            screen = pyautogui.screenshot()
        except Exception as e:
            print(e)
        return screen

    # assumption: w < pw, h < ph
    def ceneterPicture(self, pic, x, y, w, h):
        pw, ph = pic.size
        left = -1
        right = -1
        top = -1
        bottom = -1
        # 1
        if x + w/2 <= pw and x - w/2 >= 0 and y + h/2 <= ph and y - h/2 >= 0:
            left, top, right, bottom = x - w/2, y - h/2, x + w/2, y + h/2
        # 2
        elif x - w/2 < 0 and y - h/2 < 0:
            left, top, right, bottom = 0, 0, w, h
        # 3
        elif x + w/2 > pw and y - h/2 < 0:
            left, top, right, bottom = pw - w, 0, pw, h
        # 4
        elif x - w/2 < 0 and y + h/2 > ph:
            left, top, right, bottom = 0, ph - h, w, ph
        # 5
        elif x + w/2 > pw and y + h/2 > ph:
            left, top, right, bottom = pw - w, ph - h, pw, ph
        # 6
        elif y - h/2 < 0:
            left, top, right, bottom = x - w/2, 0, x + w/2, h
        # 7
        elif x + w/2 > pw:
            left, top, right, bottom = pw - w, y - h/2, pw, y + h/2
        # 8
        elif y + h/2 > ph:
            left, top, right, bottom = x - w/2, ph - h, x + w/2, ph
        # 9
        elif x - w/2 < 0:
            left, top, right, bottom = 0, y - h/2, w, y+h/2
        # draw mouse point first
        draw = ImageDraw.Draw(pic)
        mouse_size = 15
        draw.pieslice([x - mouse_size, y - mouse_size, x + mouse_size, y + mouse_size], start=0, end=360,
                      fill='#B8D3ED', outline='#829FC7', width=2)
        # crop image by sizes
        pic = pic.crop((left, top, right, bottom))
        return pic

    def startViewer(self):
        self.running = True

    def stopViewer(self):
        self.running = False
        msg = Messages.AckEndViewerMsg()
        self.connectionHandler.sendMsg(msg, (self.ip, self.port))

    def zoom(self, state):
        if state:
            self.zoomIn()
        else:
            self.zoomOut()

    def zoomIn(self):
        if self.h > 100 and self.w > 100:
            self.h -= 20
            self.w -= 20

    def zoomOut(self):
        if self.h < 600 and self.w < 600:
            self.h += 20
            self.w += 20

    def run(self):
        self.running = True
        while self.running:
            img = self.getCenteredScreen()
            arrBytes = io.BytesIO()
            img.save(arrBytes, format='JPEG')
            value1 = arrBytes.getvalue()
            size1 = len(value1)
            print('send jpeg')
            msg = Messages.ViewerMsg(value1, size1, 'JPEG')
            try:
                self.connectionHandler.sendMsg(msg, (self.ip, self.port))
            except Exception as e:
                print(e)
                continue

# viewer = ViewerHandler(700,700, None, None, None)
# img = viewer.getCenteredScreen()
# img.show()
# arrBytes = io.BytesIO()
# img.save(arrBytes, format='JPEG')
# value = arrBytes.getvalue()
# value = base64.b64encode(value)
# print(len(value))
# img.save(arrBytes, format='PNG')
# value = arrBytes.getvalue()
# value = base64.b64encode(value)
# print(len(value))


