import dgram from 'react-native-udp';
import EncoDecoder from './EncoderDecoder';
import {getSystemName, getDeviceName, getUniqueId, getBatteryLevel, } from 'react-native-device-info'
import {createFoundMsg, isSearchMsg, isConnectMsg, createGenerationMsg} from './Messages'

var port_mousey = undefined;
var address_mousey = undefined;

export default class ConnectionHandler {

  constructor(port) {
    this.encodeco = new EncoDecoder();
    this.socket = dgram.createSocket('udp4'); 
    this.socket.bind(1250); 
    this.key_toServer = undefined;
  } 

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
  }
  
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
  
  sendGenerationAnalayze = (data) => {
    let id = getUniqueId();
    let msg = createGenerationMsg(id,data);
    this.send(msg);
  } 
}