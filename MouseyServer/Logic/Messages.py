import json
import pandas as pd

SEARCH_OPCODE = 19
FOUND_OPCODE = 20
CONNECT_OPCODE = 21
GENERATION_OPCODE = 22
MOUSE_CLICK_OPCODE = 23
MOUSE_MOVE_OPCODE = 24
SPLIT_OPCODE = 29
RECIVE_SPLIT_OPCODE = 30


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
                   'gyroscope_x', 'gyroscope_y', 'gyroscope_z', 'angle', 'diff']
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
                       angle['angle'], angle['diff']]
                lst.append(arr)
        return pd.DataFrame(lst, columns=columns)

    def fix_accelometer_gyroscope_arr(self, accelometer, gyroscope):
        acc_size = len(accelometer)
        gyro_size = len(gyroscope)
        if acc_size > gyro_size:
            accelometer = accelometer[0:gyro_size]
        elif gyro_size > acc_size:
            gyroscope = gyroscope[0:acc_size]
        return accelometer, gyroscope

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

    def getAcc(self):
        return self.data['acc']['x'], self.data['acc']['y'], self.data['acc']['z']

    def getGyro(self):
        return self.data['gyro']['x'], self.data['gyro']['y'], self.data['gyro']['z']


class SplitMsg(Message):

    def __init__(self, index, total, data):
        super().__init__(SPLIT_OPCODE)
        self.index = index
        self.total = total
        self.data = data

    def getIndex(self):
        return self.index

    def getTotal(self):
        return self.total

    def getData(self):
        return self.data


class ReciveSplitMsg(Message):

    def __init__(self):
        super().__init__(RECIVE_SPLIT_OPCODE)

    def encode(self):
        return bytes([0])
