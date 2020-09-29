import {Message, createSearchMsg, createConnectMsg, createReciveSplitMsg, LOGOUT_MSG, createLogoutMsg, ACK_LOGOUT_MSG, createAckLogoutMsg, FIN_MSG, createFinMsg} from './Messages';
import {SEARCH_MSG, FOUND_MSG, CONNECT_MSG, GENERATION_MSG, MOUSE_CLICK_MGS, MOUSE_MOVE_MSG, SPLIT_MSG, RECIVE_SPLIT_MSG} from './Messages'

export default class EncoDecoder {

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
      default:
        console.log('wrong opcode recived')
        break; 
    }
  }

  encode = (msg) => {
    let plaintext:string = msg.toString();
    //TODO: add here security level
    return this.stringToBytes(plaintext);
  }
}