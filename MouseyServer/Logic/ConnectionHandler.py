import numpy as np
import socket
import hashlib

from Logic import Messages
from Logic.EncoderDecoder import EncoderDecoder


class ConnectionHandler:

    def __init__(self, port):
        self.encoDeco = EncoderDecoder()
        self.timeout = 5  # in s
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.settimeout(self.timeout)
        self.sock.bind(('', port))

    # The function send a msg to a given ip
    # ip: The ip to send to
    # msg: (Object) the Msg object to send
    def sendMsg(self, msg, ip):
        encodeMessage = self.encoDeco.encode(msg)
        print('send msg to client', ip, 'msg', encodeMessage)
        self.sock.sendto(encodeMessage, ip)

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

