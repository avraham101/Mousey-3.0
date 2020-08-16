import threading as Threads
from Logic import SearchManager, ConnectionManager, ConnectionHandler, MouseHandler

class LogicManager:

    def __init__(self):
        self.connectionHandler = ConnectionHandler.ConnectionHandler(1250)
        self.searchManager = None
        self.connectionManager = None
        self.modelHandler = MouseHandler.ModelHandler(5, '.\Logic\model16.h5')

    # The function start searching for income conection
    def search(self):
        self.searchManager = SearchManager.SearchManager(self.connectionHandler)
        self.searchManager.start()

    # The function stop searching for new connection
    def stopSearch(self):
        if self.searchManager is not None:
            self.searchManager.stopSearch()

    # The function get the connections found
    def getConnections(self):
        if self.searchManager is not None:
            return self.searchManager.getConnections()
        return {}

    # The function start a connection
    def startConnection(self, connection):
        if self.searchManager is not None and self.searchManager.avaliableConnection(connection):
            (ip, port), msg = self.searchManager.getConnection(connection)
            self.connectionManager = ConnectionManager.ConnectionManager(self.connectionHandler, ip, port,
                                             msg.deviceName, msg.battery, self.modelHandler)
            self.connectionManager.start()
            return True
        return False

    # The function get the device name from the connection manager
    def getDeviceName(self):
        if self.connectionManager is not None:
            return self.connectionManager.getDeviceName()

    # The function get the battery status from the connection manger
    def getBattery(self):
        if self.connectionManager is not None:
            return self.connectionManager.getBattery()

    # The function stop the connection made with the phone
    def stopConnection(self):
        # TODO
        print('stoped connection')
