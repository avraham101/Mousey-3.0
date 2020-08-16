import struct
import json
from Logic import Messages


def cleanString(text):
    result = ''
    i = 0
    while i != len(text):
        if chr(0) != text[i]:
            result += text[i]
        i += 1
    return result

class EncoderDecoder:

    def encode(self, msg):
        byteMsg = bytes([msg.opcode])
        byteMsg += msg.encode()
        return byteMsg

    def decode(self, buffer):
        opCode, rest = struct.unpack_from('1cc', buffer, 0)
        opCode = str(opCode, "utf-8")
        if opCode == chr(Messages.FOUND_OPCODE):
            return self.decodeFoundMsg(buffer)
        # Not Supported Yet By Client
        elif opCode == chr(Messages.GENERATION_OPCODE):
            return self.decodeGenerationMsg(buffer)
        elif opCode == chr(Messages.MOUSE_CLICK_OPCODE):
            return self.decodeMouseClickMsg(buffer)
        elif opCode == chr(Messages.MOUSE_MOVE_OPCODE):
            return self.decodeMouseMoveMsg(buffer)
        return None

    def decodeFoundMsg(self, buffer):
        # print('start decode Found Msg')
        offset = 1
        sysName, rest = struct.unpack_from('40sc', buffer, offset)
        sysName = str(sysName, "utf-8")
        sysName = cleanString(sysName)
        offset += 40
        deviceId, rest = struct.unpack_from('40sc', buffer, offset)
        deviceId = str(deviceId, "utf-8")
        deviceId = cleanString(deviceId)
        offset += 40
        deviceName, batrery = struct.unpack_from('40s3s', buffer, offset)
        deviceName = str(deviceName, "utf-8")
        deviceName = cleanString(deviceName)
        batrery = str(batrery, "utf-8")
        batrery = cleanString(batrery)
        # print('sysName: ', sysName, ' id: ', deviceId, ' deviceName: ', deviceName, ' battery: ', batrery)
        return Messages.FoundMessage(sysName, deviceId, deviceName, batrery)

    def decodeGenerationMsg(self, buffer):
        offset = 1
        id, rest = struct.unpack_from('40sc', buffer, offset)
        id = str(id, "utf-8")
        offset += 40
        size, rest = struct.unpack_from('10sc', buffer, offset)
        size = str(size, "utf-8")
        size = size.replace(chr(0), '')
        size = int(size)
        size, data = struct.unpack_from('10s'+str(size)+'s', buffer, offset)
        data = str(data, "utf-8")
        data = json.loads(data)
        return Messages.GenerationMessage(id, data)

    def decodeMouseClickMsg(self, buffer):
        offset = 1
        button, state = struct.unpack_from('10s10s', buffer, offset)
        button = str(button, "utf-8")
        button = button.replace('\0', '')
        state = str(state, "utf-8")
        state = state.replace('\0', '')
        if state == 'true':
            state = True
        else:
            state = False
        return Messages.MouseClick(button, state)

    def decodeMouseMoveMsg(self, buffer):
        offset = 1
        size, rest = struct.unpack_from('10sc', buffer, offset)
        size = str(size, "utf-8")
        size = size.replace(chr(0), '')
        size = int(size)
        size, data = struct.unpack_from('10s' + str(size) + 's', buffer, offset)
        data = str(data, "utf-8")
        data = json.loads(data)
        return Messages.MouseMove(data)

class WrongMsgRecived(Exception):
    """Wrong Msg recived, can't translate"""
    pass
