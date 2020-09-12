export type Message = Boradcast | Server2Client | Client2Server;

type Boradcast = SearchMsg;
type Server2Client = ConnectMsg | ReciveSplitMsg;
type Client2Server = FoundMsg | GenerationMsg | MouseClickMsg | MouseMoveMsg | SplitMsg | TouchMsg | RollerMsg | FileMsg;

//------------------------------------------ libary functions -----------------------------------------------
function padString(str:string, num:number) {
  while(str.length < num) {
    str+= String.fromCharCode(0);
  }
  return str;
}

//opcodes:
export var SEARCH_MSG = 19;
export var FOUND_MSG = 20;
export var CONNECT_MSG = 21;
export var GENERATION_MSG = 22;
export var MOUSE_CLICK_MGS = 23;
export var MOUSE_MOVE_MSG = 24;
export var TOUCH_MSG = 25;
export var ROLLER_MSG = 26;
export var FILE_MSG = 28;
export var SPLIT_MSG = 29;
export var RECIVE_SPLIT_MSG = 30;

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

interface MouseMoveMsg {
    tag:'MouseMoveMsg',
    opcode:number,
    data: any,
    isReady : () => boolean,
    toString: ()=> string,
}

interface SplitMsg {
    tag:'SplitMsg',
    opcode:number,
    index: number,
    total:number,
    size: number,
    data: any,
    isReady: () => boolean,
    toString: () => string,
}

interface ReciveSplitMsg {
    tag:'ReciveSplitMsg',
    opcode:number
}

interface TouchMsg {
    tag:'TouchMsg',
    opcode:number,
    x:number,
    y:number,
    last:boolean,
    isReady:() => boolean,
    toString:() => string,
}

interface RollerMsg {
    tag:'RollerMsg',
    opcode:number,
    speed:number,
    isReady: () => boolean,
    toString: () => string,
}

interface FileMsg {
    tag:'FileMsg',
    opcode:number,
    name:string,
    date:string,
    fileSize:string,
    content:string, //utf-8
    isReady:()=>boolean,
    toString:()=>string,
}

//----------------------------------------------- predicats -----------------------------------------------
export const isSearchMsg = (x:any):x is SearchMsg => x.tag === "SearchMsg";
export const isFoundMsg = (x:any):x is FoundMsg => x.tag === "FoundMsg";
export const isConnectMsg = (x:any):x is ConnectMsg => x.tag === "ConnectMsg";
export const isGenerationMsg = (x:any):x is GenerationMsg => x.tag === "GenerationMsg";
export const isMouseClickMsg = (x:any):x is MouseClickMsg => x.tag === 'MouseClickMsg';
export const isMouseMoveMsgMsg = (x:any):x is MouseMoveMsg => x.tag === 'MouseMoveMsg';
export const isSplitMsg = (x:any): x is SplitMsg => x.tag === 'SplitMsg';
export const isReciveSpliteMsg = (x:any): x is ReciveSplitMsg => x.tag === 'ReciveSplitMsg';
export const isTouchMsg = (x:any): x is TouchMsg => x.tag === 'TouchMsg';
export const isRollerMsg = (x:any): x is RollerMsg => x.tag === 'RollerMsg';
export const isFileMsg = (x:any): x is FileMsg => x.tag === 'FileMsg';

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

export const createMouseMoveMsg = (data:any): MouseMoveMsg => {
    let msg:MouseMoveMsg = {tag:'MouseMoveMsg', opcode:MOUSE_MOVE_MSG, data:data, isReady:null, toString:null};
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

const createSplitMsg = (data: any, index: number, total:number, size:number):SplitMsg => {
    let msg:SplitMsg = {tag:'SplitMsg', opcode:SPLIT_MSG, index:index, total:total, size:size, data:data, isReady:null, toString:null};
    msg.isReady = ():boolean => true;
    msg.toString =  ():string => {
        let plainText:string = String.fromCharCode(msg.opcode);
        plainText += padString(''+msg.index, 10);
        plainText += padString(''+msg.total, 10);
        plainText += padString(''+msg.size, 10);
        plainText += data;
        return plainText;
    }
    return msg;
};

export const createSplitMsgs = (msg: Message):SplitMsg[] => {
    let output:SplitMsg[] = [];
    let plainText:string = msg.toString();
    let split:number = Math.ceil(plainText.length/65505);
    console.log('splited msg to N: '+split);
    while(plainText.length%split!=0) {
        plainText+=' ';
    }
    let size:number = plainText.length;
    let part:number = size/split;
    let data:string = '';
    for(let i:number =0; i<split; i+=1) {
        data = plainText.slice(i*part,(i+1)*part);
        output.push(createSplitMsg(data,i,split,data.length));
    }
    return output;
} 

export const createReciveSplitMsg = ():ReciveSplitMsg => {
    return {tag:'ReciveSplitMsg', opcode:RECIVE_SPLIT_MSG};
}

export const createTouchMsg = (x:number, y:number, last:boolean):TouchMsg => {
    let msg:TouchMsg = {tag:'TouchMsg', opcode:TOUCH_MSG, x:x, y:y, last:last, isReady:null, toString:null};
    msg.isReady = () => true;
    msg.toString = ():string => {
        let plainText:string = String.fromCharCode(msg.opcode);
        plainText += padString(''+last,10);
        let data = {x:msg.x, y:msg.y, last:msg.last};
        let json = JSON.stringify(data);
        plainText += padString(''+json.length,10);
        plainText += json;
        return plainText;
    }
    return msg;
}

export const createRollerMsg = (speed:number):RollerMsg => {
    let msg:RollerMsg = {tag:'RollerMsg', opcode:ROLLER_MSG, speed:speed, isReady:null, toString:null};
    msg.isReady = () => true;
    msg.toString = ():string => {
        let plainText:string = String.fromCharCode(msg.opcode);
        let data = {speed:speed};
        let json = JSON.stringify(data);
        plainText += padString(''+json.length,10);
        plainText += json;
        return plainText;
    };
    return msg;
}

export const createFileMsg = (name:string, date:string, fileSize:string, content:string):FileMsg => {
    let msg:FileMsg = {tag:'FileMsg', opcode:FILE_MSG, name:name, date:date, fileSize:fileSize, content:content, isReady:null, toString:null};
    msg.isReady = ()=>true;
    msg.toString = ():string =>{
        let plainText:string = String.fromCharCode(msg.opcode);
        plainText += padString(name,40);
        plainText += padString(date,10);
        plainText += padString(''+fileSize,15);
        plainText += padString(''+content.length,20);
        plainText += content;
        return plainText;
    }
    return msg;
}