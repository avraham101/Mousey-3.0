import socket
import hashlib
import numpy as np
from Logic import Messages
import math
from Logic.EncoderDecoder import EncoderDecoder

MAX_UDP_SIZE = 65536  # 2^16

class ConnectionHandler:

    def __init__(self, port):
        self.encoDeco = EncoderDecoder()
        self.timeout = 5  # in s
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.settimeout(self.timeout)
        self.sock.bind(('', port))
        hostname = socket.gethostname()
        print(socket.gethostbyname_ex(hostname))
        self.ips = socket.gethostbyname_ex(hostname)[2]
        self.ipBroadcasts = [None] * len(self.ips)
        for i, ip in enumerate(self.ips):
            nums = ip.split('.')
            del nums[-1]
            ip = '.'.join(nums)
            ip += '.255'
            self.ipBroadcasts[i] = ip
        self.splitHandler = None

    # The function returns the ip address of the computer
    def getMyIps(self):
        return self.ips

    # The function return the broadcast ip
    def getMyBroadcastIps(self):
        return self.ipBroadcasts

    # The function send a msg to a given ip
    # ip: The ip to send to
    # msg: (Object) the Msg object to send
    def sendMsg(self, msg, ip):
        encodeMessage = self.encoDeco.encode(msg)
        print('send msg to client', ip, 'msg', encodeMessage)
        if len(encodeMessage) < MAX_UDP_SIZE:
            self.sock.sendto(encodeMessage, ip)
        else:
            self.sendSplitMsg(encodeMessage, ip)

    # The function send a split msg to the client
    def sendSplitMsg(self, encodedMsg, ip):
        self.splitHandler = SplitHandler(encodedMsg)
        self.nextSplitMsg(ip)

    # The function send the next split msg to the client
    def nextSplitMsg(self, ip):
        if self.splitHandler is not None:
            print('send split msg to client')
            msg = self.splitHandler.nextMsg()
            if msg is not None:
                encodeMessage = self.encoDeco.encode(msg)
                self.sock.sendto(encodeMessage, ip)
            else:
                self.splitHandler = None

    # The function accept a connection
    def accept(self, msgSize=1024):
        try:
            buffer, clientIp = self.sock.recvfrom(msgSize)
            msg = self.encoDeco.decode(buffer)
            if msg is None:
                raise WrongMsgRecived()
            return msg, clientIp
        except socket.timeout:
            raise TimeOut()

    # The function close the connection handler
    def close(self):
        self.sock.close()

class TimeOut(Exception):
    """Time out in reciving msg"""
    pass

class Broadcast(Exception):
    """broadcast reviced, can't translate"""
    pass

class WrongMsgRecived(Exception):
    """Wrong Msg recived, can't translate"""
    pass

class SplitHandler:

    def __init__(self, encodedMsg):
        self.encodedMsg = encodedMsg
        self.msgs = []
        self.index = 0
        self.createSplitMsgs()

    def createSplitMsgs(self):
        split = math.ceil(len(self.encodedMsg)/MAX_UDP_SIZE)
        while len(self.encodedMsg) % split != 0:
            self.encodedMsg += b'0'
        size = len(self.encodedMsg)
        part = int(size / split)
        for i in range(split):
            data = self.encodedMsg[i * part: (i + 1) * part - 1]
            splitMsg = Messages.SplitMsg(i, split, data)
            self.msgs.append(splitMsg)

    def hasNextMsg(self):
        return self.index < len(self.msgs)

    def nextMsg(self):
        output = None
        if self.hasNextMsg():
            output = self.msgs[self.index]
            self.index += 1
        return output
