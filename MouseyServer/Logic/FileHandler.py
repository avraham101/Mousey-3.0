from base64 import b64decode

class FileHandler:

    def saveFile(self, msg):
        name = msg.getName()
        data = msg.getFileData()
        print(msg.getType())
        if msg.getType() == 'pdf':
            self.savePDF(name, data)

    def savePDF(self, name, data, path='Files'):
        convertedData = b64decode(data, validate=True)
        f = open(path+"\\"+name, 'wb')
        f.write(convertedData)
        f.close()
        print('saved pdf')
