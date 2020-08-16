import {Message, createSearchMsg, createConnectMsg} from './Messages';

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
      case 19: {
        let key = this.bytesToString(cipher, 1);
        let msg = createSearchMsg(key); 
        return msg;
      }
      case 21: {
        let key = this.bytesToString(cipher, 1);
        let msg = createConnectMsg(key);
        return msg;
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