import dgram from 'react-native-udp';
import EncoDecoder from './EncoderDecoder';
import {getSystemName, getDeviceName, getUniqueId, getBatteryLevel, } from 'react-native-device-info'
import {createFoundMsg, isSearchMsg, isConnectMsg, createGenerationMsg, createSplitMsgs, isReciveSpliteMsg, createFileMsg} from './Messages'

var port_mousey = undefined;
var address_mousey = undefined;
var MAX_UDP_SIZE = 65000;
var lisener = null;

export default class ConnectionHandler {

  constructor(port) {
    this.encodeco = new EncoDecoder();
    this.socket = dgram.createSocket('udp4'); 
    this.socket.bind(1250); 
    this.key_toServer = undefined;
    this.addLisenersMousey();
  } 

  /**
   * The function send a broad cast to find server Mousey
   * @param promise the next function to execute if the broadcast succeded. 
   */
  broadcast = (promise) => {
    let encodeco = this.encodeco;
    let sendMouseFound = this.sendMouseFound;
    //sender info stracture "address": , "family": , "port": , "size":
    this.socket.on('message', function(msg, senderInfo) {
      msg = encodeco.decode(msg);
      let address = senderInfo.address;
      let port = senderInfo.port;
      if (isSearchMsg(msg)) {
        sendMouseFound(address, port);
      }
      else if(isConnectMsg(msg)) {
        this.key_toServer = msg.key;
        promise(msg.key)
      }
      });
    this.socket.on('error', (e)=>{
      console.log(e);
    })
  }
  
  /**
   * The function send a msg to the server
   * @param msg The msg to be send to the server. 
   */
  send = async function(msg) {
    if(port_mousey == undefined || address_mousey == undefined) {
      console.log('Dont have port or addresss');
      return
    }
    if(msg != undefined && msg.isReady()) {
      buffer = this.encodeco.encode(msg);
      this.socket.send(buffer,0, buffer.length, port_mousey, address_mousey);
    }
  }

  /**
   * The function send a mousey found msg to the server
   * @param address the address to send 2 
   * @param port the port to send 2 
   */
  sendMouseFound = (address, port) => {
    let encodeco = this.encodeco;
    let socket = this.socket;
    let send = async function(msg) {
      if(msg != undefined && msg.isReady()) {
        buffer = encodeco.encode(msg);
        socket.send(buffer,0, buffer.length, port, address);
        //here we define the address and the port we connectiong to the Mousey server
        port_mousey = port;
        address_mousey = address; 
      }
    }
    
    let sysName = getSystemName();
    let id = getUniqueId();
    let msg = createFoundMsg(sysName, id, undefined, undefined);
    // if(port != port_mousey && address != address_mousey) {
    getDeviceName().then(name=>{
      msg.setDeviceName(name);
      send(msg);  
      });
    getBatteryLevel().then(state =>{
      msg.setBattery(state)
      send(msg);
      });
  }
  
  /**
   * The funcion is added a lisener function for reciving msg from the server.
   * Note: we are using the lisner as an extra msgs beside the basic connection msgs so we can controll the flow for the 
   *       upcoming msgs. 
   * Note: there is only 1 lisener (var) function after decode the msg, so we can change the lisener as we like
   *       throw the run.
   */
  addLisenersMousey = () => {
    let encodeco = this.encodeco;
    this.socket.on('message', function(msg, senderInfo) {
      if(lisener!=null) {
        msg = encodeco.decode(msg);
        lisener(msg,senderInfo);
      }
    });
  }

  /**
   * The function send Split Msg from a given msg.
   * @param msg the message to be splited and send to the server 
   */
  sendSplitMsgs(msg) {
    let msgs = createSplitMsgs(msg);
    let nextMsg = (msgs, index) => {
      if(msgs.length > index) {
        console.log('send split msg '+index);
        this.send(msgs[index]);
        lisener = (msg, senderInfo) => {
          console.log('\t inside lisener splitMsg')
          if(isReciveSpliteMsg(msg)) {
            console.log('\t >> recived Recived Split Msg '+index);
            nextMsg(msgs, index+1); 
          }
        };
      }
    }
    nextMsg(msgs,0);
  }

  /**
   * The function send a msg to server, if the msg is need to be splited it will split and send;
   * @param msg the msg to send to the sever 
   */
  sendOrSplit(msg) {
    if(msg.toString().length < MAX_UDP_SIZE) {
      this.send(msg);
    }
    else {
      this.sendSplitMsgs(msg);
    }
  }

  /**
   * The function send a generation msg to the server.
   * If the data is much more then we can send throw udp the msg is splited.
   * @param data the generation data 
   */
  sendGenerationAnalayze = (data) => {
    // let encodeco = this.encodeco;
    let id = getUniqueId();
    let msg = createGenerationMsg(id,data);
    //TODO: refactor this after verifying it work to
    //      this.sendOrSplit(msg);
    if(msg.toString().length < MAX_UDP_SIZE) {
      this.send(msg);
    }
    else {
      //TODO: refactor this after verifying it work to
      //      this.sendSplitMsgs(msg);
      let msgs = createSplitMsgs(msg);
      let nextMsg = (msgs, index) => {
        if(msgs.length > index) {
          console.log('send split msg '+index);
          this.send(msgs[index]);
          lisener = (msg, senderInfo) => {
            console.log('\t inside lisener splitMsg')
            if(isReciveSpliteMsg(msg)) {
              console.log('\t >> recived Recived Split Msg '+index);
              nextMsg(msgs, index+1); 
            }
          };
        }
      }
      nextMsg(msgs,0);
    }
  } 

  sendFileMsg(name, date, fileSize, content) {
    let msg = createFileMsg(name, date, fileSize, content);
    this.sendOrSplit(msg);
  }
}