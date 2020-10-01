import dgram from 'react-native-udp';
import EncoDecoder from './EncoderDecoder';
import {getSystemName, getDeviceName, getUniqueId, getBatteryLevel, } from 'react-native-device-info'
import {createFoundMsg, isSearchMsg, isConnectMsg, createGenerationMsg, createSplitMsgs, isReciveSpliteMsg, 
        createFileMsg, createLogoutMsg, isLogoutMsg, createAckLogoutMsg, isFinMsg, isAckLogoutMsg, createFinMsg,
        createMouseyBatterMsg} from './Messages'

var port_mousey = undefined;
var address_mousey = undefined;
var MAX_UDP_SIZE = 65000;
var lisener = null;

export default class ConnectionHandler {

  constructor(port, logoutPromise) {
    this.encodeco = new EncoDecoder();
    this.socket = dgram.createSocket('udp4'); 
    this.socket.bind(1250); 
    this.key_toServer = undefined;
    this.addLisenersMousey();
    this.logoutPromise = logoutPromise; // The promise function for exit the current screen
  } 


  /**
   * The function is for restarting all the elemnts needed for the connection
   */
  resetConection = () => {
    lisener = null;
    port_mousey = undefined;
    address_mousey = undefined;
    this.socket.close();
  }

  /**
   * The function send a broad cast to find server Mousey
   * @param promise the next function to execute if the broadcast succeded. 
   */
  broadcast = (promise) => {
    let encodeco = this.encodeco;
    let sendMouseFound = this.sendMouseFound;
    let sendAckLogout = this.sendAckLogout;
    let sendFin = this.sendFin;
    let startBatteryMsgLoop =  this.startBatteryMsgLoop;
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
          startBatteryMsgLoop();
          promise(msg.key)
        }
        else if(isLogoutMsg(msg)) {
          sendAckLogout();
        }
        else if(isAckLogoutMsg(msg)) {
          sendFin();
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
   * We call this function at the bulider of the class
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
    this.sendOrSplit(msg);
  } 

  /**
   * The function send a file msg to the server
   * @param {*} name the name of the file
   * @param {*} date the date the file created
   * @param {*} fileSize the file size
   * @param {*} content the content of the file
   */
  sendFileMsg(name, date, fileSize, content) {
    let msg = createFileMsg(name, date, fileSize, content);
    this.sendOrSplit(msg);
  }

  /**
   * The function send a logout msg to the server from this mouse
   */
  sendLogout = () => {
    let msg = createLogoutMsg();
    this.send(msg);
    console.log('>> send logout msg '+ msg);
  }

  /**
   * The function send a ack logout msg, if the fin msg isnt recived send agian ack logout msg.
   */
  sendAckLogout = () => {
    let recivedFin = false;
    let interval = 100;
    let maxTries = 5;
    let sendAck = () => {
      if(maxTries == 0) {
        this.resetConection();
        this.logoutPromise();
      }
      else {
        console.log('send ack logout msg');
        maxTries -= 1;
        //define the lisner only to recive fin msg not other msg.
        lisener = (msg, senderInfo) => {
          if(isFinMsg(msg)) {
            recivedFin = true;
            this.resetConection();
            this.logoutPromise();
          }
        };
        if(recivedFin == false) {
          let msg = createAckLogoutMsg();
          this.send(msg);
          setTimeout(sendAck, interval);
        }
      }
    }
    sendAck();
  }

  /**
   * The function send a Fin Msg to the server, after reciving ackLogout
   */
  sendFin = () => {
    let msg = createFinMsg();
    this.send(msg);
    this.resetConection();
    this.logoutPromise();
    
  }

  
  /**
   * The function send a Battery Msg to the server
   */
  sendBatteryMsg = () => {
    let send = (msg)=>{
      this.send(msg);
    };
    let msg = createMouseyBatterMsg(undefined);
    getBatteryLevel().then(state =>{
      msg.setBattery(state);
      console.log(state);
      send(msg);
    });
  }
  
  /**
  * The function create a loop of requests to check when the battery level is down and send it to the server
  * Every 5 sec send a battery msg to the server.
  */    
  startBatteryMsgLoop = () => {
    let interval = 5000;
    this.sendBatteryMsg();
    if(address_mousey!=undefined && port_mousey!=undefined) {
      setTimeout(this.startBatteryMsgLoop,interval);
    }
  }

}