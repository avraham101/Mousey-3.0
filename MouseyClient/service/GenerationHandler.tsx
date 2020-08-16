import {Message} from './Messages';
import ConnectionHandler from './ConnectionHandler';
import { State, Dir, 
         dirHasEnough, clearDir, clearGyroscope, clearAccelometer,
         isReady, isStop, isError, isDir, isUp, isDown, isRight, isLeft, isUpRight, isDownLeft, isUpLeft, isDownRight,
         isNed,
         createEmptyDown, createEmptyUp, createEmptyRight, createEmptyLeft, createEmptyUpRight, createEmptyDownLeft, 
         createEmptyUpLeft, createDone, createError, createReady, isDone, createStop, createEmptyDownRight,
         createEmptyNed} from './GenerationState';
import { createAccelometer, createGyroscope, 
         Accelometer, sameSensorData, Gyroscope} from './GenerationData';

export default class GenerationHandler {

  connectionHandler:ConnectionHandler;
  state:State;
  data:Dir[];
  samePointCounter:number;
  treshold:number;

  constructor(connectionHandler:ConnectionHandler) {
    this.connectionHandler = connectionHandler;
    this.state = createReady();
    this.data = [];
    this.samePointCounter = 0;
    this.treshold = 2;
  }

  /**
   * the function return the state.tag 
   */
  getState():string {
    return this.state.tag;
  }

  /**
   * TODO: NEED TO DELETE THIS
   * the function add accelometer data to the state
   * @param param0 - the data
   */
  old_addAccelometer({x,y,z}:{x:number,y:number,z:number}, promise:(state:string)=>void):void {
    if(isDir(this.state)) {
        let current:Accelometer = createAccelometer(x,y,z);
        let len = this.state.accelometers.length;
        if(len == 0) {
          this.state.accelometers.push(current);
        }
        else {
          console.log(len)
          let last:Accelometer = this.state.accelometers[len - 1];
          if(!isNed(this.state) && (this.samePointCounter < this.treshold || !sameSensorData(last,current, 3.5))) {
            if(sameSensorData(last,current, 3.5))
              this.samePointCounter++;
            else
              this.samePointCounter=0;
            this.state.accelometers.push(current);
          }
          else if(isNed(this.state) && !dirHasEnough(this.state)) {
            this.state.accelometers.push(current);
          }
          else {
            if(dirHasEnough(this.state)) {
              this.nextState();
              promise(this.getState())
            }
            this.samePointCounter=0;
            clearDir(this.state);
          }
        }
    }
  }

  /**
   * The function add Accelometer data to the state
   * @param param0 - the data
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
   * @param param0 - the data
   */
  addGyroscope({x,y,z}:{x:number,y:number,z:number}):void {
    if(isDir(this.state)) {
      let current:Gyroscope = createGyroscope(x,y,z);
      this.state.gyroscopes.push(current);
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
    //TODO: sometimes work sending it imidetly some times not
    // this.sendSensorsData()
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