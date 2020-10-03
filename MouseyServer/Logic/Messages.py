import json
import pandas as pd
import base64

SEARCH_OPCODE = 19
FOUND_OPCODE = 20
CONNECT_OPCODE = 21
GENERATION_OPCODE = 22
MOUSE_CLICK_OPCODE = 23
MOUSE_MOVE_OPCODE = 24
TOUCH_MOVE_OPCODE = 25
ROLLER_MOVE_OPCODE = 26
LOGOUT_OPCODE = 27
FILE_OPCODE = 28
SPLIT_OPCODE = 29
RECIVE_SPLIT_OPCODE = 30
ACKLOGOUT_OPCODE = 31
FIN_OPCODE = 32
MOUSEY_BATTERY_OPCODE = 33
START_VIEWER_OPCODE = 34
VIEWER_OPCODE = 35
END_VIEWER_OPCODE = 36
ACK_END_VIEWER_OPCODE = 37
ZOOM_OPCODE = 38

def fixString(string, size):
    while len(string) < size:
        string += '\0'
    return string

class Message:
    def __init__(self, opcode):
        self.opcode = opcode


class SearchMessage(Message):

    def __init__(self, publicKey):
        super().__init__(SEARCH_OPCODE)
        self.publicKey = publicKey

    def encode(self):
        return self.publicKey.encode()


class FoundMessage(Message):

    def __init__(self, sysName, deviceId, deviceName, battery):
        super().__init__(FOUND_OPCODE)
        self.sysName = sysName
        self.deviceId = deviceId
        self.deviceName = deviceName
        self.battery = int(battery)

    def toString(self):
        # Todo: change the screen list to show more info, for now it is enougth
        # text = '' + self.sysName
        # text += ' Id: ' + self.deviceId
        text = self.deviceName
        text += ' ' + str(self.battery) + '%'
        return text


class ConnectMessage(Message):

    def __init__(self, privateKey):
        super().__init__(CONNECT_OPCODE)
        self.privateKey = privateKey

    def encode(self):
        return self.privateKey.encode()


class GenerationMessage(Message):

    def __init__(self, id, data):
        super().__init__(GENERATION_OPCODE)
        self.id = id
        self.data = data

    def create_data_frame(self):
        lst = []
        columns = ['tag', 'accelometer_x', 'accelometer_y', 'accelometer_z',
                   'gyroscope_x', 'gyroscope_y', 'gyroscope_z', 'angle', 'diff', 'base']
        for state in self.data:
            tag = state['tag'].lower()
            accs = state['accelometers']
            gyroes = state['gyroscopes']
            angles = state['angels']
            accs, gyroes, angles = self.fix_arrays(accs, gyroes, angles)
            for i in range(0, len(accs)):
                acc = accs[i]
                gyro = gyroes[i]
                angle = angles[i]
                arr = [tag, acc['x'], acc['y'], acc['z'], gyro['x'], gyro['y'], gyro['z'],
                       angle['angle'], angle['diff'], angle['base']]
                lst.append(arr)
        return pd.DataFrame(lst, columns=columns)

    def fix_arrays(self, accelometer, gyroscope, angel):
        minom = len(accelometer)  # min = acc_size
        gyro_size = len(gyroscope)
        angel_size = len(angel)
        if gyro_size < minom:
            minom = gyro_size
        if angel_size < minom:
            minom = angel_size
        accelometer = accelometer[0:minom]
        gyroscope = gyroscope[0:minom]
        angel = angel[0:minom]
        return accelometer, gyroscope, angel

class MouseClick(Message):

    def __init__(self, button, state):
        super().__init__(MOUSE_CLICK_OPCODE)
        self.button = button
        self.state = state

    def getButton(self):
        return self.button

    def getState(self):
        return self.state


class MouseMove(Message):

    def __init__(self, data):
        super().__init__(MOUSE_MOVE_OPCODE)
        self.data = data

    def getWindow(self):
        return self.data

class SplitMsg(Message):

    def __init__(self, index, total, data):
        super().__init__(SPLIT_OPCODE)
        self.index = index
        self.total = total
        self.size = len(data)
        self.data = data

    def getIndex(self):
        return self.index

    def getTotal(self):
        return self.total

    def getData(self):
        return self.data

    def encode(self):
        index = fixString(str(self.index), 10)
        total = fixString(str(self.total), 10)
        msgSize = len(self.data)
        msgSize = fixString(str(msgSize), 10)
        return index.encode() + total.encode() + msgSize.encode() + self.data

class ReciveSplitMsg(Message):

    def __init__(self):
        super().__init__(RECIVE_SPLIT_OPCODE)

    def encode(self):
        return bytes([0])

class TouchMoveMsg(Message):

    def __init__(self, last, data):
        super().__init__(TOUCH_MOVE_OPCODE)
        self.last = last
        self.x = data['x']
        self.y = data['y']

    def isItLastMove(self):
        return self.last

    def getX(self):
        return self.x

    def getY(self):
        return self.y

    def getTouch(self):
        return self.x, self.y

class RollerMoveMsg(Message):

    def __init__(self, data):
        super().__init__(ROLLER_MOVE_OPCODE)
        self.speed = data['speed']

    def getSpeed(self):
        return self.speed

class FileMsg(Message):

    def __init__(self, name, date, fileSize, data):
        super().__init__(FILE_OPCODE)
        self.name = name
        self.date = date
        self.fileSize = fileSize
        self.data = data

    def getName(self):
        return self.name

    def getType(self):
       return self.name.split('.')[-1]

    def getDate(self):
        return self.date

    def getFileData(self):
        return self.data

class LogoutMsg(Message):

    def __init__(self):
        super().__init__(LOGOUT_OPCODE)

    def encode(self):
        return bytes([0])

class AckLogoutMsg(Message):

    def __init__(self):
        super().__init__(ACKLOGOUT_OPCODE)

    def encode(self):
        return bytes([0])

class FinMsg(Message):

    def __init__(self):
        super().__init__(FIN_OPCODE)

    def encode(self):
        return bytes([0])

class MouseyBatteryMsg(Message):

    def __init__(self, battery):
        super().__init__(MOUSEY_BATTERY_OPCODE)
        self.battery = battery

    def getBattery(self):
        return self.battery

class StartViewerMsg(Message):

    def __init__(self):
        print('resived start view msg')
        super().__init__(START_VIEWER_OPCODE)

class ViewerMsg(Message):

    def __init__(self, value, size, tp):
        super().__init__(VIEWER_OPCODE)
        self.size = size
        self.value = value
        self.tp = tp

    def encode(self):
        tp = self.tp
        while len(tp) < 10:
            tp += '\0'
        data = base64.b64encode(self.value)
        size = str(len(data))
        while len(size) < 10:
            size += '\0'
        return tp.encode() + size.encode() + data

class EndViewerMsg(Message):

    def __init__(self):
        super().__init__(END_VIEWER_OPCODE)

class AckEndViewerMsg(Message):

    def __init__(self):
        super().__init__(ACK_END_VIEWER_OPCODE)

    def endode(self):
        return bytes([0])

class ZoomMsg(Message):

    def __init__(self, state):
        super().__init__(ZOOM_OPCODE)
        self.state = state

    def getState(self):
        return self.state

