import {Message, createMouseClickMsg, createMouseMoveMsg, createTouchMsg, createRollerMsg} from './Messages';
import ConnectionHandler from './ConnectionHandler';
import { createAccelometer, createGyroscope, createAngle, createAngleWithPrev,
         Accelometer, sameSensorData, Gyroscope, Angle} from './GenerationData';

export default class MouseyHandler {

  connectionHandler:ConnectionHandler;
  accQueue:any[];
  gyroQueue:any[];
  angleQueue:any[];
  prevAngle:Angle;
  windowHandler:WindowHandler;
  constructor(connectionHandler:ConnectionHandler) {
    this.connectionHandler = connectionHandler;
    this.accQueue = [];
    this.gyroQueue = [];
    this.angleQueue = [];
    this.prevAngle = null;
    this.windowHandler = new WindowHandler(5);
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
    if(this.accQueue.length > 0 && this.gyroQueue.length > 0 && this.angleQueue.length > 0) {
      let acc:Accelometer = this.accQueue.shift();
      let gyro:Gyroscope = this.gyroQueue.shift();
      let angle:Angle = this.angleQueue.shift();
      // this.windowHandler.insert([acc.x,acc.y,acc.z],[gyro.x, gyro.y, gyro.z],[angle.angle, angle.diff])
      this.windowHandler.insert([acc.x,acc.y,acc.z],[gyro.x, gyro.y, gyro.z],[angle.angle])
      let data  = this.windowHandler.getWindow();
      if(data != undefined) {
        let msg:Message = createMouseMoveMsg(data);
        this.connectionHandler.send(msg);
      }
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

  /**
   * The function add magnometer data to the queue
   * @param param0 - the magnometer data
   */
  addMagnometer({x,y,z}:{x:number, y:number, z:number}) {
    let angle:Angle = null;
    if(this.prevAngle == null) {
      angle = createAngle(x,y,z);
    }
    else {
      angle = createAngleWithPrev(x,y,z, this.prevAngle.angle, this.prevAngle.base);
    }
    this.angleQueue.push(angle);
    this.prevAngle = angle;
  }

  /**
   * The function send Mouse move msg to the server
   * @param x the cordinate x
   * @param y the cordinate y
   */
  sendTouchMove(x:number,y:number, last:boolean):void {
    let msg:Message = createTouchMsg(x,y,last);
    this.connectionHandler.send(msg);
  }

  /**
   * The function send Roller msg to the server
   * @param rollerSpeed 
   */
  sendRoller(rollerSpeed: number) {
    let msg:Message = createRollerMsg(rollerSpeed);
    this.connectionHandler.send(msg);
  }   

}

/** 
 * This class responseble for bulding windows
 */
class WindowHandler {

  windowSize:number; //the window size 
  head:number;       //the head of the current geoup
  size:number;       //the number of elements
  elements:any[];    //the group of elements
  
  constructor(size:number) {
    this.windowSize = size;
    this.head = 0;
    this.size = 0;
    this.elements = new Array(this.windowSize);
  }

  insert(acc:any, gyro:any, angle:any) {
    this.elements[this.head] = [[acc], [gyro], [angle]];
    if(this.size < this.windowSize) {
      this.size ++;
    }
    this.head ++;
    if(this.head == this.windowSize) {
      this.head = 0;
    }
  }

  getWindow():any[] {
    if(this.size == this.windowSize) {
      let window:any = [];
      let index:number = 0;
      let head:number = this.head - 1;
      if(head < 0) 
        head = this.windowSize - 1;
      for (let i = 0; i < this.windowSize; i++) {
        if(i > head) {
          index = this.windowSize + head - i;
        }
        else {
          index = head - i;
        }
        window.push(this.elements[index][0]);
        window.push(this.elements[index][1]);
        window.push(this.elements[index][2]);
      }
      return window;
    }
    return undefined;
  }

}