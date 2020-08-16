import hashlib
import threading as Threads
from Logic import ConnectionHandler
from Logic import Messages

class SearchManager(Threads.Thread):

    # Mutal Varibels for all Srach Manager's = Static Vars
    locker = Threads.Lock()
    # The connections found
    CONNECTIONS = {}
    # The connection data
    connections_data = {}
    # Seatch on/off flag
    SEARCH = True

    def __init__(self, connectionHandler):
        super().__init__()
        self.connectionHandler = connectionHandler

    # The function stop the search
    def stopSearch(self):
        self.SEARCH = False
        self.CONNECTIONS = {}

    # The function return the connections found until now
    def getConnections(self):
        return self.CONNECTIONS

    # The function return a given connection form a given value
    # value: (str) the msg in string format
    def getConnection(self, value):
        for ip in self.CONNECTIONS.keys():
            if self.CONNECTIONS[ip] == value:
                return ip, self.connections_data[ip]
        return None

    # The function add connection the list of connections
    # msg: (Object) The Msg recived form the client
    # ip: (str) the ip recived from
    def addConnection(self, msg, ip):
        try:
            self.CONNECTIONS[ip]
            # do nothing it is already exits a mousey from this ip
        except KeyError:
            self.CONNECTIONS[ip] = msg.toString()
            self.connections_data[ip] = msg

    # The function check if a connection is avalable
    # connection: (str) the name of the connection
    def avaliableConnection(self, connection):
        return connection in self.CONNECTIONS.values()

    # The function send a broad cast to all phones in the area who want to connect
    # sending a public key
    def broadCast(self):
        ip = ('10.0.0.255', 1250)
        publicKey = 'send BroadCast to phones'
        publicKey = hashlib.sha1(bytes(publicKey, 'utf-8')).hexdigest()
        msg = Messages.SearchMessage(publicKey)
        self.connectionHandler.sendMsg(msg, ip)

    # This is the running function of the thread
    def run(self):
        timeout = False
        with self.locker:
            while self.SEARCH:
                try:
                    if timeout is False:
                        self.broadCast()
                    timeout = True
                    msg, ip = self.connectionHandler.accept()
                    if self.SEARCH:
                        self.addConnection(msg, ip)
                except ConnectionHandler.TimeOut:
                     timeout = False
                     print('TODO TIMEOUT RECIVED')  # TODO
                except ConnectionHandler.WrongMsgRecived:
                    print('Wrong Msg Recived')  # TODO
                except ConnectionHandler.Broadcast:
                    continue
