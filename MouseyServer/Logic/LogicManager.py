import threading as Threads
from Logic import SearchManager, ConnectionManager, ConnectionHandler, MouseHandler

class LogicManager:

    def __init__(self):
        self.connectionHandler = ConnectionHandler.ConnectionHandler(1250)
        self.searchManager = None
        self.connectionManager = None
        self.modelHandler = MouseHandler.ModelHandler('.\Logic\model16.h5')

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
    def startConnection(self, connection, logoutFunc):
        if self.searchManager is not None and self.searchManager.avaliableConnection(connection):
            (ip, port), msg = self.searchManager.getConnection(connection)
            self.connectionManager = ConnectionManager.ConnectionManager(self.connectionHandler, ip, port,
                                             msg.deviceName, msg.battery, logoutFunc, self.modelHandler)
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
        self.connectionManager.sendLogoutMsg()

    # The function return the list of the last files recived to the mousey server
    def getFiles(self):
        return self.connectionManager.getFiles()

    # The function return the last direction the mouse moved to.
    def getDirection(self):
        return self.connectionManager.getDirection()

    # The function open the file selected from the list
    def openFile(self, name):
        self.connectionManager.openFile(name)

    # The function save a file to a given path
    def saveFileWithPath(self, name, path):
        self.connectionManager.saveFileWithPath(name, path)

    # The function return the real name of the file
    def getFileName(self, refactor_name):
        return self.connectionManager.getFileName(refactor_name)
