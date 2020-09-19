import os
from base64 import b64decode

class FileHandler:

    def __init__(self):
        self.path = None
        self.savedFiles = []
        self.initPath()

    def initPath(self):
        desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
        path = desktop + '\\MouseyFiles'
        if not os.path.exists(path):
            os.makedirs(path)
        self.path = path

    def saveFile(self, msg):
        name = msg.getName()
        data = msg.getFileData()
        convertedData = b64decode(data, validate=True)
        p = self.nextAvalibaleName(self.path + '\\' + name)
        print('files ', self.savedFiles)
        f = open(p, 'wb')
        f.write(convertedData)
        f.close()
        p = p.replace(self.path+'\\', '')
        self.savedFiles.insert(len(self.savedFiles), p)

    def clearName(self, p):
        arr = p.split('.')
        tp = arr.pop()
        name = p[0: -(len(tp)+1)]
        return name, tp

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

    # The function return the list of file names
    def getFilesNames(self):
        return self.savedFiles

handler = FileHandler()
handler.nextAvalibaleName('..\Files\wpdf.pdf')


