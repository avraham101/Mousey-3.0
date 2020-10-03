export type Message = Boradcast | Server2Client | Client2Server;

type Boradcast = SearchMsg;
type Server2Client = ConnectMsg | ReciveSplitMsg | LogoutMsg | AckLogoutMsg | FinMsg | AckEndViewerMsg | SplitMsg;
type Client2Server = FoundMsg | GenerationMsg | MouseClickMsg | MouseMoveMsg | SplitMsg | TouchMsg | RollerMsg | FileMsg | LogoutMsg 
                        | AckLogoutMsg | FinMsg | MouseyBatteryMsg | StartViewerMsg | EndViewerMsg | ReciveSplitMsg | ZoomMsg;

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
export var LOGOUT_MSG = 27;
export var FILE_MSG = 28;
export var SPLIT_MSG = 29;
export var RECIVE_SPLIT_MSG = 30;
export var ACK_LOGOUT_MSG = 31;
export var FIN_MSG = 32;
export var MOUSEY_BATTERY_MSG = 33;
export var START_VIEWER_MSG = 34;
export var VIEWER_MSG = 35;
export var END_VIEWER_MSG = 36;
export var ACK_END_VIEWER_MSG = 37;
export var ZOOM_MSG = 38;

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
    isReady:() => boolean,
    toString:() => string,
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

interface LogoutMsg {
    tag:'LogoutMsg',
    opcode:number,
    isReady:()=>boolean,
    toString:()=>string,
}

interface AckLogoutMsg {
    tag:'AckLogoutMsg',
    opcode:number,
    isReady:()=>boolean,
    toString:()=>string,
}

interface FinMsg {
    tag:'FinMsg',
    opcode:number,
    isReady:()=>boolean,
    toString:()=>string,
}

interface MouseyBatteryMsg {
    tag:'MouseyBatteryMsg',
    opcode:number,
    battery:number,
    setBattery: (battery:number) => void,
    isReady:()=>boolean,
    toString:()=>string,
}

interface StartViewerMsg {
    tag:'StartViewerMsg',
    opcode:number, 
    isReady:()=>boolean,
    toString:()=>string,
}

export interface ViewerMsg {
    tag:'ViewerMsg',
    opcode:number,
    type:string,
    data:string, 
    getView: ()=>any,
}

interface EndViewerMsg {
    tag: 'EndViewerMsg',
    opcode: number,
    isReady: ()=> boolean,
    toString: ()=> string,
}

interface AckEndViewerMsg {
    tag: 'AckEndViewerMsg',
    opcode: number,
}

interface ZoomMsg {
    tag:'ZoomMsg',
    opcode:number,
    state: boolean,
    isReady: ()=>boolean,
    toString: ()=>string,
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
export const isLogoutMsg = (x:any): x is LogoutMsg => x.tag === 'LogoutMsg';
export const isAckLogoutMsg = (x:any): x is AckLogoutMsg => x.tag === 'AckLogoutMsg';
export const isFinMsg = (x:any): x is FinMsg => x.tag === 'FinMsg';
export const isMouseyBatteryMsg = (x:any): x is MouseyBatteryMsg => x.tag ==='MouseyBatteryMsg';
export const isStartViewerMsg = (x:any): x is StartViewerMsg => x.tag === 'StartViewerMsg';
export const isViewerMsg = (x:any): x is ViewerMsg => x.tag === 'ViewerMsg';
export const isEndViewerMsg = (x:any): x is EndViewerMsg => x.tag === 'EndViewerMsg';
export const isAckEndViewerMsg = (x:any): x is AckEndViewerMsg => x.tag === 'AckEndViewerMsg';
export const isZoomMsg = (x:any): x is ZoomMsg => x.tag === 'ZoomMsg';

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

export const createSplitMsg = (data: any, index: number, total:number, size:number):SplitMsg => {
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
    let msg:ReciveSplitMsg = {tag:'ReciveSplitMsg', opcode:RECIVE_SPLIT_MSG, isReady:null, toString:null};
    msg.isReady = () => true;
    msg.toString = ():string => {
        let plainText:string = String.fromCharCode(msg.opcode);
        plainText += String.fromCharCode(0);
        return plainText;
    }
    return msg;

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

export const createLogoutMsg = ():LogoutMsg => {
    let msg:LogoutMsg = {tag:'LogoutMsg', opcode:LOGOUT_MSG, isReady:null, toString:null};
    msg.isReady = ()=>true;
    msg.toString = ():string =>{
        let plainText:string = String.fromCharCode(msg.opcode);
        plainText += String.fromCharCode(0);
        return plainText;
    };
    return msg;
}

export const createAckLogoutMsg = ():AckLogoutMsg => {
    let msg:AckLogoutMsg = {tag:'AckLogoutMsg', opcode:ACK_LOGOUT_MSG, isReady:null, toString:null};
    msg.isReady = ()=>true;
    msg.toString = ():string =>{
        let plainText:string = String.fromCharCode(msg.opcode);
        plainText += String.fromCharCode(0);
        return plainText;
    };
    return msg;
}

export const createFinMsg = ():FinMsg => {
    let msg:FinMsg = {tag:'FinMsg', opcode:FIN_MSG, isReady:null, toString:null};
    msg.isReady = ()=>true;
    msg.toString = ():string =>{
        let plainText:string = String.fromCharCode(msg.opcode);
        plainText += String.fromCharCode(0);
        return plainText;
    };
    return msg;
}

export const createMouseyBatterMsg = (battery:number):MouseyBatteryMsg => {
    let msg:MouseyBatteryMsg = {tag:"MouseyBatteryMsg", opcode:MOUSEY_BATTERY_MSG, battery:battery, 
        setBattery: undefined, isReady:undefined, toString:undefined};
    let setBattery = (battery:number) => {
        battery = battery * 100;
        battery = Math.round(battery);
        battery = parseInt(''+battery);
        msg.battery = battery;
    } 
    let isReady = ():boolean => {
        return msg.battery!=undefined; 
    }
    let toString = ():string => {
        let plainText = String.fromCharCode(msg.opcode) 
        plainText += padString(''+msg.battery, 3);
        return plainText;
    }
    msg.setBattery = setBattery;
    msg.isReady = isReady;
    msg.toString = toString;
    return msg;
}

export const createStartViewerMsg = ():StartViewerMsg => {
    let msg:StartViewerMsg = {tag:'StartViewerMsg', opcode:START_VIEWER_MSG, isReady:undefined, toString:undefined};
    msg.isReady = ()=>true;
    msg.toString = ():string =>{
        let plainText:string = String.fromCharCode(msg.opcode);
        plainText += String.fromCharCode(0);
        return plainText;
    };
    return msg;
}

export const createViewerMsg = (type:string, data:string):ViewerMsg => {
    let msg:ViewerMsg = {tag:'ViewerMsg', opcode:VIEWER_MSG, type:type, data:data, getView:undefined};
    msg.getView = () => {
        console.log(msg.type)
        var view = 'data:image/'+msg.type+';base64,'+msg.data; 
        return view;
    };
    return msg;
}

export const createEndViewerMsg = ():EndViewerMsg => {
    let msg:EndViewerMsg = {tag:'EndViewerMsg', opcode:END_VIEWER_MSG, isReady:null, toString:null};
    msg.isReady = ()=>true;
    msg.toString = ():string =>{
        let plainText:string = String.fromCharCode(msg.opcode);
        plainText += String.fromCharCode(0);
        return plainText;
    };
    return msg;
}

export const createAckEndViewerMsg = ():AckEndViewerMsg => {
    return {tag:'AckEndViewerMsg', opcode:ACK_END_VIEWER_MSG};
}

export const createZoomMsg = (state:boolean):ZoomMsg => {
    let msg:ZoomMsg = {tag:'ZoomMsg', opcode:ZOOM_MSG, state:state, isReady:null, toString:null};
    msg.isReady = ()=>true;
    msg.toString = ()=> {
        let plainText:string = String.fromCharCode(msg.opcode);
        plainText += padString(''+msg.state, 10);
        return plainText;
    }
    return msg;
}