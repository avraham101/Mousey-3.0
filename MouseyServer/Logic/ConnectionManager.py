import hashlib
import threading as Threads
from Logic import ConnectionHandler, Messages
from Logic.MouseHandler import MouseHandler
from Logic.ConnectionHandler import WrongMsgRecived, TimeOut
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

    # The function is the funing function of the thread
    def run(self):
        self.connect()
        while True:
            try:
                msg, ip = self.connectionHandler.accept(msgSize=64000)  # 2^16
                if msg.opcode == Messages.GENERATION_OPCODE:
                    df = msg.create_data_frame()
                    self.presistendGenrationHandler.save_generation(df)
                elif msg.opcode == Messages.MOUSE_CLICK_OPCODE:
                    self.mouseHandler.mouseClick(msg)
                elif msg.opcode == Messages.MOUSE_MOVE_OPCODE:
                    self.mouseHandler.mouseMove(msg)
            except ConnectionHandler.WrongMsgRecived:
                print('Wrong Msg recived')
            except:
                continue
