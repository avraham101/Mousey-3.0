import os
from base64 import b64decode

class FileHandler:

    def __init__(self):
        self.path = None
        self.savedFiles = {}
        self.initPath()

    def initPath(self):
        desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
        # path = desktop + '\\MouseyFiles'
        path = desktop
        if not os.path.exists(path):
            os.makedirs(path)
        self.path = path

    def getPath(self):
        if self.path is not None:
            return self.path
        return ''

    def saveFile(self, msg):
        name = msg.getName()
        data = msg.getFileData()
        convertedData = b64decode(data, validate=True)
        refactor_p = self.refactorFileName(name)
        refactor_p = self.nextrRefactorName(refactor_p)
        print('saved file to the map [', refactor_p, ']: ', name)
        self.savedFiles[refactor_p] = (name, convertedData)

    def clearName(self, p):
        arr = p.split('.')
        tp = arr.pop()
        name = p[0: -(len(tp)+1)]
        return name, tp

    # The function refactor a file name
    def refactorFileName(self, name, maxi=13):
        if len(name) > maxi:
            prefix = name[0:maxi - 7]
            sefix = name[-7:]
            return prefix + ' ... ' + sefix
        return name

    def nextAvalibaleName(self, p):
        if not os.path.exists(p):
            print('path avilable', p)
            return p
        name, tp = self.clearName(p)
        print('name ', name, 'tp ', tp)
        counter = 0
        sefix = ' ('+str(counter)+')'
        new_name = name + sefix + '.' + tp
        while os.path.exists(new_name):
            counter += 1
            sefix = ' ('+str(counter)+')'
            new_name = name + sefix + '.' + tp
        print('new_name ', new_name)
        return new_name

    def nextrRefactorName(self,  p):
        if not self.savedFiles.keys().__contains__(p):
            print('path avilable', p)
            return p
        name, tp = self.clearName(p)
        print('name ', name, 'tp ', tp)
        counter = 0
        sefix = ' ('+str(counter)+')'
        new_name = name + sefix + '.' + tp
        while  self.savedFiles.keys().__contains__(new_name):
            counter += 1
            sefix = ' ('+str(counter)+')'
            new_name = name + sefix + '.' + tp
        print('new_name ', new_name)
        return new_name

    # The function return the list of file names
    def getFilesNames(self):
        return self.savedFiles.keys()

    # The function return the real name of the file
    def getFileName(self, refactor_name):
        name, data = self.savedFiles[refactor_name]
        return name

    # The function save a file to a given path
    def saveFileWithPath(self, refactor_name, new_path):
        name, data = self.savedFiles[refactor_name]
        print('path selected', new_path)
        name = self.nextAvalibaleName(new_path)
        f = open(name, 'wb')
        f.write(data)
        f.close()
        self.savedFiles[refactor_name] = (name, None)

    # The function open the file
    def openFile(self, refactor_name):
        name, data = self.savedFiles[refactor_name]
        print('Open File ', name)
        os.startfile(name)


handler = FileHandler()
handler.nextAvalibaleName('..\Files\wpdf.pdf')


