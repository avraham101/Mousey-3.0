import {Message, createSearchMsg, createConnectMsg, createReciveSplitMsg, LOGOUT_MSG, createLogoutMsg, ACK_LOGOUT_MSG, 
  createAckLogoutMsg, FIN_MSG, createFinMsg, SEARCH_MSG, FOUND_MSG, CONNECT_MSG, GENERATION_MSG, MOUSE_CLICK_MGS, MOUSE_MOVE_MSG, 
  SPLIT_MSG, RECIVE_SPLIT_MSG, VIEWER_MSG, createViewerMsg, END_VIEWER_MSG, createEndViewerMsg, ACK_END_VIEWER_MSG, createAckEndViewerMsg,
  createSplitMsg, SplitMsg} from './Messages'

export default class EncoDecoder {

  splitCombiner:SplitCombiner;

  constructor() {
    this.splitCombiner = null;
  }

  stringToBytes = (text:string):number[] => {
    let array:number[] = [];
    for (let i = 0; i < text.length; i++) {
        let byte = text.charCodeAt(i);
        //if (byte < 0x80) TODO: delete this assumption all code text is valid string(a-z,0-9,A-z) 
          array.push(byte);
        //TODO: cheack if we need else
    }
    return array;
  }

  byteToString = (byte:number):string => {
    let num:number = parseInt(''+byte);
    return String.fromCharCode(num);
  }

  bytesToString = (array:number[], offset:number):string => {
    let output:string = '';
    for(let i:number=offset; i<array.length; i++) {
      output += this.byteToString(array[i]);
    }
    return output;
  }

  decode = (cipher) => {
    let opcode = parseInt(cipher[0]);
    switch(opcode) {
      case SEARCH_MSG: {
        let key = this.bytesToString(cipher, 1);
        let msg = createSearchMsg(key); 
        return msg;
      }
      case CONNECT_MSG: {
        let key = this.bytesToString(cipher, 1);
        let msg = createConnectMsg(key);
        return msg;
      }
      case SPLIT_MSG: {
        return this.decodeSplitMsg(cipher);
      }
      case RECIVE_SPLIT_MSG: {
        return createReciveSplitMsg();
      }
      case LOGOUT_MSG: {
        return createLogoutMsg();
      }
      case ACK_LOGOUT_MSG: {
        return createAckLogoutMsg();
      }
      case FIN_MSG: {
        return createFinMsg();
      }
      case VIEWER_MSG: {
        return this.decodeViewerMsg(cipher);
      }
      case ACK_END_VIEWER_MSG: {
        return createAckEndViewerMsg();
      }
      default:
        console.log('wrong opcode recived '+ opcode + ' = ' + cipher[0] +' or ' + cipher.charCodeAt(0) + ' -> '+cipher[1] + ' -> '+cipher[2]);
        break; 
    }
  }

  decodeString = (cipher) => {
    let opcode = cipher.charCodeAt(0);
    switch (opcode) {
      case VIEWER_MSG:
        console.log('decode string viewer msg');
        return this.decodeViewerMsg(cipher);

      default:
        console.log('wrong string opcode recived '+ opcode);
        break; 
    }
  }

  decodeSplitMsg = (cipher) => {
    console.log('Decode a split msg');
    let offset = 1;
    let bytes = this.cleanBytes(cipher.slice(offset,offset+10));
    let index = parseInt(this.bytesToString(bytes, 0));
    offset += 10;
    bytes = this.cleanBytes(cipher.slice(offset,offset+10));
    let total = parseInt(this.bytesToString(bytes, 0));
    offset += 10;
    bytes = this.cleanBytes(cipher.slice(offset,offset+10));
    let sizeMsg = parseInt(this.bytesToString(bytes, 0));
    offset += 10;
    let data = "";
    for (let i = offset; i < sizeMsg; i++) {
      data += String.fromCharCode(cipher[i]);
    }
    let msg = createSplitMsg(data, index, total, sizeMsg);
    if(this.splitCombiner == null || index == 0) {
      this.splitCombiner = new SplitCombiner(total);
    }
    this.splitCombiner.insert(msg);
    if(this.splitCombiner.isReady()) {
      console.log('combine splits msgs and decode the original msg');
      return this.decodeStringViewerMsg(this.splitCombiner.combine());
    }
    return msg;
  }

  decodeViewerMsg = (cipher) => {
    let offset = 1;
    let bytes_size = this.cleanBytes(cipher.slice(offset,offset+10));
    let size = parseInt(this.bytesToString(bytes_size,0));
    offset += 10;
    let data = '';
    for (let i = offset; i <= size; i++) {
      data += String.fromCharCode(cipher[i]);
    }
    return createViewerMsg(data);
  }

  decodeStringViewerMsg = (cipher) => {
    let offset = 1;
    let size = cipher.slice(offset,offset+10);
    size = size.replace('\0','');
    size = parseInt(size);
    console.log('size '+size)
    offset += 10;
    let data = cipher.slice(offset, offset+size);
    // console.log(data);
    return createViewerMsg(data);
  }

  cleanBytes = (bytes) => {
    let output = [];
    for(let i=0; i<bytes.length; i++) {
      if(bytes[i] != 0)
        output.push(bytes[i]);
    }
    return output;
  }
  
  encode = (msg) => {
    let plaintext:string = msg.toString();
    //TODO: add here security level
    return this.stringToBytes(plaintext);
  }
}

// The class responseble for combining all the split meseges recived
// so we can return the original msg recived
class SplitCombiner {

  size:number;
  elements:number;
  msgs:SplitMsg[];
  constructor(size:number) {
    this.size = size;
    this.elements = 0;
    this.msgs = [];
  }

  insert = (msg:SplitMsg) => {
    if(this.elements < this.size) {
      this.msgs.push(msg);
      this.elements ++;
    }
  }

  isReady = () => {
    return this.size == this.elements;
  }

  combine = () => {
    let output = null;
    if(this.isReady()) {
      this.msgs.forEach( msg => {
        if(output == null) {
          output = msg.data;
        }
        else {
          output += msg.data;
        }
      });
    }
    return output;
  }
}