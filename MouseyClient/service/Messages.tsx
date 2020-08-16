import { Platform } from "react-native";

export type Message = Boradcast | Server2Client | Client2Server;

type Boradcast = SearchMsg;
type Server2Client = ConnectMsg;
type Client2Server = FoundMsg | GenerationMsg | MouseClickMsg | MouseMove;

//------------------------------------------ libary functions -----------------------------------------------
function padString(str:string, num:number) {
  while(str.length < num) {
    str+= String.fromCharCode(0);
  }
  return str;
}

//opcodes:
var SEARCH_MSG = 19;
var FOUND_MSG = 20;
var CONNECT_MSG = 21;
var GENERATION_MSG = 22;
var MOUSE_CLICK_MGS = 23;
var MOUSE_MOVE_MSG = 24;

//----------------------------------------------- interfaces -----------------------------------------------
interface SearchMsg {
    tag: "SearchMsg",
    opcode: number,
    key:string,
    validKey: ()=>boolean,
}

interface FoundMsg {
    tag:"FoundMsg",
    opcode: number,
    sysName:string,
    id:string,
    deviceName:string,
    battery:number,
    setDeviceName: (deviceName:string) => void,
    setBattery: (battery:number) => void,
    isReady: () => boolean,
    toString: () => string,
}


interface GenerationMsg {
    tag:'GenerationMsg',
    opcode: number,
    id: string,
    data: any[],
    isReady: () => boolean,
    toString: ()=>string,
}

interface ConnectMsg {
    tag: "ConnectMsg",
    opcode: number,
    key: string,
    validKey: ()=>boolean,
}

interface MouseClickMsg {
    tag: 'MouseClickMsg',
    opcode:number,
    button:string,
    state:boolean,
    isReady: () => boolean,
    toString: ()=>string,
}

interface MouseMove {
    tag:'MouseMove',
    opcode:number,
    data: any,
    isReady : () => boolean,
    toString: ()=> string,
}


//----------------------------------------------- predicats -----------------------------------------------
export const isSearchMsg = (x:any):x is SearchMsg => x.tag === "SearchMsg";
export const isFoundMsg = (x:any):x is FoundMsg => x.tag === "FoundMsg";
export const isConnectMsg = (x:any):x is ConnectMsg => x.tag === "ConnectMsg";
export const isGenerationMsg = (x:any):x is GenerationMsg => x.tag === "GenerationMsg";
export const isMouseClickMsg = (x:any):x is MouseClickMsg => x.tag === 'MouseClickMsg';
export const isMouseMoveMsg = (x:any):x is MouseMove => x.tag === 'MouseMove';

//-------------------------------------------- constractors -----------------------------------------------
export const createSearchMsg = (key:string):SearchMsg => {
    let validKey = ():boolean => {
        //TODO: change this function
        return key == 'b2adcd7f504f0076ad06d9bc6964862c744d14d9';
    }
    return {tag:"SearchMsg", opcode: SEARCH_MSG, key:key, validKey:validKey}
}

export const createFoundMsg = (sysName:string, id:string, deviceName:string, battery:number):FoundMsg => {
    let msg:FoundMsg = {tag:"FoundMsg", opcode:FOUND_MSG, sysName:sysName, id:id, deviceName: deviceName, battery:battery, 
        setBattery: undefined, setDeviceName: undefined, isReady:undefined, toString:undefined};
    let setBattery = (battery:number) => {
        battery = battery * 100;
        battery = parseInt(''+battery);
        msg.battery = battery;
    } 
    let setDeviceName = (deviceName:string) => {
        msg.deviceName = deviceName;
    } 
    let isReady = ():boolean => {
        return msg.deviceName != undefined && msg.battery!=undefined; 
    }
    let toString = ():string => {
        let plainText = String.fromCharCode(msg.opcode) 
        plainText += padString(msg.sysName, 40);
        plainText += padString(msg.id, 40);
        plainText += padString(msg.deviceName, 40);
        plainText += padString(''+msg.battery, 3);
        return plainText;
    }
    msg.setBattery = setBattery;
    msg.setDeviceName = setDeviceName;
    msg.isReady = isReady;
    msg.toString = toString;
    return msg;
}

export const createConnectMsg = (key:string):ConnectMsg => {
    let validKey = ():boolean => {
        //TODO: change this function
        return key == '';
    }
    return {tag:'ConnectMsg', opcode:CONNECT_MSG, key:key, validKey:validKey}
}

export const createGenerationMsg = (id:string, data:any[]):GenerationMsg => {
    let msg:GenerationMsg = {tag:'GenerationMsg', opcode:GENERATION_MSG, id:id, data:data, isReady:undefined, toString:undefined};
    let isReady = ():boolean => true;
    let toString = ():string => {
        let plainText = String.fromCharCode(msg.opcode);
        let json_data = JSON.stringify(msg.data);
        let size = json_data.length;
        plainText += padString(id, 40);
        plainText += padString(''+size, 10)
        plainText += json_data;
        return plainText;
    }
    msg.isReady = isReady;
    msg.toString = toString;
    return msg;
}

export const createMouseClickMsg = (button:string, state:boolean):MouseClickMsg => {
    let msg:MouseClickMsg = {tag:'MouseClickMsg', opcode:MOUSE_CLICK_MGS, button:button,state:state, isReady:null, toString:null};
    msg.isReady = ():boolean => true;
    msg.toString = ():string=>{
        let plainText = String.fromCharCode(msg.opcode);
        plainText += padString(button,10);
        plainText += padString(''+state,10);
        return plainText;
    }
    return msg;
}

export const createMouseMoveMsg = (data:any): MouseMove => {
    let msg:MouseMove = {tag:'MouseMove', opcode:MOUSE_MOVE_MSG, data:data, isReady:null, toString:null};
    msg.isReady = ():boolean => true;
    msg.toString = ():string => {
        let plainText:string = String.fromCharCode(msg.opcode);
        let json_data = JSON.stringify(data);
        plainText += padString(''+json_data.length,10);
        plainText += json_data;
        return plainText;
    }
    return msg;
}