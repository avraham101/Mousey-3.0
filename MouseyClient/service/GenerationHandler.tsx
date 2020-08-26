import {Message} from './Messages';
import ConnectionHandler from './ConnectionHandler';
import { State, Dir, 
         dirHasEnough, clearDir, clearGyroscope, clearAccelometer,
         isReady, isStop, isError, isDir, isUp, isDown, isRight, isLeft, isUpRight, isDownLeft, isUpLeft, isDownRight,
         isNed,
         createEmptyDown, createEmptyUp, createEmptyRight, createEmptyLeft, createEmptyUpRight, createEmptyDownLeft, 
         createEmptyUpLeft, createDone, createError, createReady, isDone, createStop, createEmptyDownRight,
         createEmptyNed} from './GenerationState';
import { createAccelometer, createGyroscope, createEngle, createEngleWithPrev,
         Accelometer, sameSensorData, Gyroscope, Angle} from './GenerationData';

export default class GenerationHandler {

  connectionHandler:ConnectionHandler;
  state:State;
  data:Dir[];
  samePointCounter:number;
  treshold:number;
  prevAngle:Angle;

  constructor(connectionHandler:ConnectionHandler) {
    this.connectionHandler = connectionHandler;
    this.state = createReady();
    this.data = [];
    this.samePointCounter = 0;
    this.treshold = 2;
    this.prevAngle = null;
  }

  /**
   * the function return the state.tag 
   */
  getState():string {
    return this.state.tag;
  }

  /**
   * The function add Accelometer data to the state
   * @param param0 - the data acceleration
   */
  addAccelometer({x,y,z}:{x:number,y:number,z:number}):void {
    if(isDir(this.state)) {
      let current:Accelometer = createAccelometer(x,y,z);
      this.state.accelometers.push(current);
      let len = this.state.accelometers.length;
      console.log(len);
    }
  }

  /**
   * the function add Gyroscope data to the state
   * @param param0 - the data gyroscope
   */
  addGyroscope({x,y,z}:{x:number,y:number,z:number}):void {
    if(isDir(this.state)) {
      let current:Gyroscope = createGyroscope(x,y,z);
      this.state.gyroscopes.push(current);
    }
  }

  /**
   * The function add an Angle to the state. The angle calculate from the magnometer
   * @param param0 - the data magnometer
   */
  addAngle({x,y,z}:{x:number,y:number,z:number}):void {
    if(isDir(this.state)) {
      let current:Angle = null;
      if(this.prevAngle == null) {
        current = createEngle(x,y,z);
      }
      else {
        current = createEngleWithPrev(x,y,z, this.prevAngle.angle)
      }
      this.prevAngle = current;
      this.state.angels.push(current);
      
    }
  }

  /**
   * the function go to the next State
   */
  nextState() {
    if(isReady(this.state)) {
      this.state = createEmptyUp();
    } 
    else if(isStop(this.state)) {
      this.state = this.state.prevStep;
    }
    else if(isDir(this.state) && dirHasEnough(this.state)) {
      this.data.push(this.state);
      isUp(this.state)? this.state = createEmptyDown():
      isDown(this.state)? this.state = createEmptyRight(): 
      isRight(this.state)? this.state = createEmptyLeft():
      isLeft(this.state)? this.state = createEmptyUpRight():
      isUpRight(this.state)? this.state = createEmptyDownLeft():
      isDownLeft(this.state)? this.state = createEmptyUpLeft():
      isUpLeft(this.state)? this.state = createEmptyDownRight():
      isDownRight(this.state)? this.state = createEmptyNed():
      isNed(this.state)? this.state = createDone():
      this.state = createError("State Not Found");
    }
  }

  /**
   * The function set Stop State
   */
  setStopState() {
    if(isDir(this.state)) {
      this.state = createStop(this.state);
    }
  }

  /**
   * The function resume to the prev state before stoping
   */
  setPrevState() {
    if(isStop(this.state)) {
      this.state = this.state.prevStep;
      clearDir(this.state);
    }
  }

  /**
   * the function clear the sensors data
   */
  clearSensors() {
    if(isDir(this.state))
      clearDir(this.state);
  }

  /**
   * This function send the data to the server, not in the write flow
   */
  sendSensorsData(){
    if(isDone(this.state)) {
        this.connectionHandler.sendGenerationAnalayze(this.data)
    }
  }

  /**
   * TODO: delete this.
   * This function restart
   */
  reastart() {
    this.state = createReady();
    this.data = [];
  }
}