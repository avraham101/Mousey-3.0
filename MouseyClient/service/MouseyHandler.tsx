import {Message, createMouseClickMsg, createMouseMoveMsg} from './Messages';
import ConnectionHandler from './ConnectionHandler';
import { createAccelometer, createGyroscope, 
         Accelometer, sameSensorData, Gyroscope} from './GenerationData';

export default class MouseyHandler {

  connectionHandler:ConnectionHandler;
  accQueue:any[];
  gyroQueue:any[];
  constructor(connectionHandler:ConnectionHandler) {
    this.connectionHandler = connectionHandler;
    this.accQueue = [];
    this.gyroQueue = [];
  }
  
  /**
   * the function send to the server Left Click on or off.
   * @param state - true means left click pressed, otherwise false.   
   */
  sendClickLeft = (state:boolean) =>  {
    let msg = createMouseClickMsg('left',state);
    this.connectionHandler.send(msg); 
  }

  /**
   * the function send to the server Right Click on or off.
   * @param state - true means left click pressed, otherwise false.   
   */
  sendClickRight = (state:boolean) =>  {
    let msg = createMouseClickMsg('right',state);
    this.connectionHandler.send(msg);
  }
 
  /**
   * The function send Mouse movement msg if and only if the 2 queues isn't empty
   */
  sendMouseMove = ():void => {
    if(this.accQueue.length > 0 && this.gyroQueue.length > 0) {
      let acc:Accelometer = this.accQueue.shift();
      let gyro:Gyroscope = this.gyroQueue.shift();
      let data:any = {acc,gyro};
      let msg:Message = createMouseMoveMsg(data);
      this.connectionHandler.send(msg);
    }
  }

  /**
   * The function add gyroscope data to the queue
   * @param param0 - gyroscope data
   */
  addGyroscope({x,y,z}:{x:number,y:number,z:number}):void {
    let acc:Accelometer = createAccelometer(x,y,z);
    this.accQueue.push(acc); 
  }

  /**
   * The function add acceleration data to the queue
   * @param param0 - the acceleration data
   */
  addAcceleration({x,y,z}:{x:number,y:number,z:number}):void {
    let gyro:Gyroscope = createGyroscope(x,y,z);
    this.gyroQueue.push(gyro);
  }

}