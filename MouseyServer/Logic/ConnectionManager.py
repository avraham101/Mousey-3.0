import json
import hashlib
import threading as Threads
from Logic import ConnectionHandler, Messages, EncoderDecoder
from Logic.MouseHandler import MouseHandler
from Presistent.PresistentHandler import PresistentGenerationHandler
from Logic.FileHandler import FileHandler

class ConnectionManager(Threads.Thread):

    def __init__(self, connectionHandler, ip, port, name, battery, logoutFunc, modelHandler):
        super().__init__()
        self.ip = ip
        self.port = port
        self.deviceName = name
        self.battery = battery
        self.connectionHandler = connectionHandler
        self.encoDeco = EncoderDecoder.EncoderDecoder()
        self.presistendGenrationHandler = PresistentGenerationHandler()
        self.mouseHandler = MouseHandler(modelHandler)
        self.splitHandler = None
        self.fileHandler = FileHandler()
        self.logged = True
        self.logoutFunc = logoutFunc

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

    # The function return the battety status
    def getBattery(self):
        if self.battery:
            return self.battery
        return 0

    # The function return the last files recived from the client
    def getFiles(self):
        return self.fileHandler.getFilesNames()

    # The function return the last dir the mouse moved
    def getDirection(self):
        return self.mouseHandler.getDirection()

    # The function execute a split msg
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

    # The function execute a msg recived by the client
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
            print('got split msg -> ', msg.getIndex())
            self.executeSplitMsg(msg)
        elif msg.opcode == Messages.ROLLER_MOVE_OPCODE:
            self.mouseHandler.rollerMove(msg)
        elif msg.opcode == Messages.FILE_OPCODE:
            self.fileHandler.saveFile(msg)
        elif msg.opcode == Messages.LOGOUT_OPCODE:
            self.sendAckLogout()
        elif msg.opcode == Messages.ACKLOGOUT_OPCODE:
            self.sendFin()
        else:
            return

    # The function send a logout msg to the mousey client
    def sendLogoutMsg(self):
        msg = Messages.LogoutMsg()
        print('send logout msg')
        self.connectionHandler.sendMsg(msg, (self.ip, self.port))

    # The function recived logout msg and send ack logout
    def sendAckLogout(self):
        self.logged = False
        msg = Messages.AckLogoutMsg()
        print('send ack logout msg')
        self.connectionHandler.sendMsg(msg, (self.ip, self.port))
        fin = False
        while fin is False:
            try:
                msg, ip = self.connectionHandler.accept(msgSize=128000)  # 2^17
                if msg.opcode == Messages.FIN_OPCODE:
                    print('recived fin msg')
                    fin = True
                else:
                    print('send ack logout msg')
                    self.connectionHandler.sendMsg(msg, (self.ip, self.port))
            except Exception as e:
                continue
        self.logoutFunc()

    # The function recived AckLogout and send a Fin msg
    def sendFin(self):
        msg = Messages.FinMsg()
        print('send fin msg')
        self.connectionHandler.sendMsg(msg, (self.ip, self.port))
        self.logged = False
        self.logoutFunc()

    # The function is the funing function of the thread
    def run(self):
        self.connect()
        while self.logged:
            try:
                msg, ip = self.connectionHandler.accept(msgSize=128000)  # 2^17
                self.executeMsg(msg)
            except ConnectionHandler.WrongMsgRecived:
                print('Wrong Msg recived')
            except:
                continue

# This class responseble for collenctig parts of split msgs and combine them to the original msg
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
