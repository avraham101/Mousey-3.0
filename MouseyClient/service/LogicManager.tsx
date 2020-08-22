import {Message} from './Messages';
import ConnectionHandler from './ConnectionHandler';
import GenerationHandler from './GenerationHandler';
import MousetHandler from './MouseyHandler';
export default class LogicManager {

  connectionHandler:ConnectionHandler;
  generationHandler:GenerationHandler;
  mouseyHandler:MousetHandler;

  constructor() {
    this.connectionHandler = new ConnectionHandler(1250);
    this.generationHandler = new GenerationHandler(this.connectionHandler);
    this.mouseyHandler = new MousetHandler(this.connectionHandler);
  }

  /**
   * the function send a broad case msg
   * @param foundServer - function that gets name and return void, act like callback.
   */
  broadcast(foundServer:(name:string)=>void) {
    this.connectionHandler.broadcast(foundServer);
  }

  /**
   * The function get the init state from generation Handler
   */
  getInitState() {
    return this.generationHandler.getState();
  }

  /**
   * The fucntion moves to the next init step.
   */
  nextInitStep() {
    this.generationHandler.nextState();
    return this.getInitState();
  }

  /**
   * The function stop the init state
   */
  stopInitSteps() {
    this.generationHandler.setStopState();
    return this.getInitState();
  }

  /**
   * The function resume to the Init Steps
   */
  resumeInitSteps() {
    this.generationHandler.setPrevState();
    return this.getInitState();
  }

  /** 
   * the function save the accelometer data at init stage.
   * @param param0 - the data
   */
  saveAccelometerData({x,y,z}:{x:number,y:number,z:number}):void {
    this.generationHandler.addAccelometer({x,y,z});
  }

  /**
   * the function save the gyroscope data at init stage.
   * @param param0 - the data
   */
  saveGyroscopeData({x,y,z}:{x:number,y:number,z:number}):void {
    this.generationHandler.addGyroscope({x,y,z});
  }

  /**
   * The function save the magnometer data at init stage
   * @param param0 - the data
   */
  saveMagnometer({x,y,z}:{x:number,y:number,z:number}):void {
    this.generationHandler.addAngle({x,y,z});
  }

  /**
   * the function clear the sensor data we saved during the State we are in generation handler
   */
  clearSensorsData():void {
    this.generationHandler.clearSensors();
  }

  /**
   * it is help function for sending the analyzed data to the server
   */
  sendData():void {
    this.generationHandler.sendSensorsData();
  }

  /**
   * it is help function for restarting the analayze data again
   */
  restartSteps(): void {
    this.generationHandler.reastart();
  }

  /**
   * The function send to the server Left click down
   */
  sendClickLeftDown(): void {
    this.mouseyHandler.sendClickLeft(true);
  }

  /**
   * The function send to the server Left click up
   */
  sendClickLeftUp(): void {
    this.mouseyHandler.sendClickLeft(false);
  }

  /**
   * The function send to the server Right click down
   */
  sendClickRightDown(): void {
    this.mouseyHandler.sendClickRight(true);
  }

  /**
   * The function send to the server Right click up
   */
  sendClickRightUp(): void {
    this.mouseyHandler.sendClickRight(false);
  }

  /**
   * the function save mouse move acc
   * @param param0 - the acceleration data
   */
  saveMouseMoveAcc({x,y,z}:{x:number,y:number,z:number}) : void {
    this.mouseyHandler.addAcceleration({x,y,z});
  }

  /**
   * the function save mouse move gyro
   * @param param0 - the gyroscope data
   */
  saveMouseMoveGyro({x,y,z}:{x:number,y:number,z:number}) : void {
    this.mouseyHandler.addGyroscope({x,y,z});
  }
  
  /**
   * The function send Mouse Move msg to the server
   */
  sendMouseMove() {
    this.mouseyHandler.sendMouseMove();
  }
}
