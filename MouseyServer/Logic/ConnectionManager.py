import json
import hashlib
import threading as Threads
from Logic import ConnectionHandler, Messages, EncoderDecoder
from Logic.MouseHandler import MouseHandler
from Presistent.PresistentHandler import PresistentGenerationHandler


class ConnectionManager(Threads.Thread):

    def __init__(self, connectionHandler, ip, port, name, battery, modelHandler):
        super().__init__()
        self.ip = ip
        self.port = port
        self.deviceName = name
        self.battery = battery
        self.connectionHandler = connectionHandler
        self.presistendGenrationHandler = PresistentGenerationHandler()
        self.mouseHandler = MouseHandler(modelHandler)
        self.splitHandler = None
        self.encoDeco = EncoderDecoder.EncoderDecoder()

    # The function connect to a phone by using private key
    def connect(self):
        privateKey = 'noni avraham ofir'
        privateKey = hashlib.sha1(bytes(privateKey, 'utf-8')).hexdigest()
        msg = Messages.ConnectMessage(privateKey)
        print('send Connect Mousey')
        self.connectionHandler.sendMsg(msg, (self.ip, self.port))

    # The function return the device name
    def getDeviceName(self):
        return self.deviceName

    # The function retunr the battety status
    def getBattery(self):
        return self.battery

    def executeSplitMsg(self, msg):
        if msg.getIndex() == 0:
            self.splitHandler = SplitHandler(msg.getTotal())
            if self.splitHandler.insert(msg):
                self.connectionHandler.sendMsg(Messages.ReciveSplitMsg(), (self.ip, self.port))
        elif self.splitHandler is not None:
            if self.splitHandler.insert(msg):
                if self.splitHandler.isReady():
                    s = self.splitHandler.combineMsg()
                    self.splitHandler = None
                    newMsg = self.encoDeco.decodeString(s)
                    print('new msg', newMsg)
                    if newMsg is not None:
                        self.executeMsg(newMsg)
                else:
                    self.connectionHandler.sendMsg(Messages.ReciveSplitMsg(), (self.ip, self.port))

    def executeMsg(self, msg):
        if msg.opcode == Messages.GENERATION_OPCODE:
            df = msg.create_data_frame()
            self.presistendGenrationHandler.save_generation(df)
        elif msg.opcode == Messages.MOUSE_CLICK_OPCODE:
            self.mouseHandler.mouseClick(msg)
        elif msg.opcode == Messages.MOUSE_MOVE_OPCODE:
            self.mouseHandler.mouseMove(msg)
        elif msg.opcode == Messages.TOUCH_MOVE_OPCODE:
            self.mouseHandler.touchMove(msg)
        elif msg.opcode == Messages.SPLIT_OPCODE:
            print('got splite msg -> ', msg.getIndex())
            self.executeSplitMsg(msg)
        elif msg.opcode == Messages.ROLLER_MOVE_OPCODE:
            self.mouseHandler.rollerMove(msg)
        else:
            return

    # The function is the funing function of the thread
    def run(self):
        self.connect()
        while True:
            try:
                msg, ip = self.connectionHandler.accept(msgSize=128000)  # 2^17
                self.executeMsg(msg)
            except ConnectionHandler.WrongMsgRecived:
                print('Wrong Msg recived')
            except:
                continue

class SplitHandler:

    def __init__(self, size):
        self.size = size
        self.msgs = [None] * size

    def insert(self, msg):
        if msg.getIndex() < self.size and self.msgs[msg.getIndex()] is None:
            self.msgs[msg.getIndex()] = msg
            return True
        return False

    def isReady(self):
        for msg in self.msgs:
            if msg is None:
                return False
        return True

    def combineMsg(self):
        cipher = ''
        for msg in self.msgs:
            if msg is None:
                return None
            cipher += msg.getData()
        return cipher
