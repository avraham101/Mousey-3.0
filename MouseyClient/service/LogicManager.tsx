import {Message} from './Messages';
import ConnectionHandler from './ConnectionHandler';
import GenerationHandler from './GenerationHandler';
import MousetHandler from './MouseyHandler';
import FileHandler from './FileHandler';
import ViewerHandler from './ViewerHandler';

export default class LogicManager {

  connectionHandler:ConnectionHandler;
  generationHandler:GenerationHandler;
  mouseyHandler:MousetHandler;
  fileHandler:FileHandler;
  viewerHandler:ViewerHandler;
  logoutPromise: ()=>void;


  constructor(logoutPromise:()=>void) {
    this.connectionHandler = new ConnectionHandler(1250, logoutPromise);
    this.generationHandler = new GenerationHandler(this.connectionHandler);
    this.mouseyHandler = new MousetHandler(this.connectionHandler);
    this.fileHandler = new FileHandler(this.connectionHandler);
    this.viewerHandler = new ViewerHandler(this.connectionHandler);
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
   * the function save the mouse move magnometer data
   * @param param0 - the magnometer data
   */
  saveMouseMoveMagnometer({x,y,z}:{x:number,y:number,z:number}) : void {
    this.mouseyHandler.addMagnometer({x,y,z})
  }
  
  /**
   * The function send Mouse Move msg to the server
   */
  sendMouseMove() {
    this.mouseyHandler.sendMouseMove();
  }

  /**
   * The function send Touch Move msg to the server
   */
  sendTouchMove(x:number, y:number, last:boolean) {
    this.mouseyHandler.sendTouchMove(x,y,last);
  }

  /**
   * The function send Roller Movment msg to the server 
   */
  sendRoller(rollerSpeed: number) {
    this.mouseyHandler.sendRoller(rollerSpeed);
  }

  /**
   * The function return the Current Folder Name
   */
  getCurrentFolderName() {
    return this.fileHandler.getCurrentName();
  }

  /**
   * The function return the Current Folder Items (Content) 
   */
  getCurrentItems() {
    return this.fileHandler.getCurrentItems();
  }

  /**
   * The function move to the prev folder
   */
  moveToPrevFolder() {
    this.fileHandler.moveToPrevFolder();
  }

  /**
   * The function move to folder with the path
   * @param path the folders path
   */
  moveToFolder(path) {
    this.fileHandler.moveToFolder(path);
  }

   /**
   * The function send the file to the server
   * @param name the name of the file
   * @param path the path to the file
   * @param date the date the file created\last changed
   * @param fileSize the size of the file in Bytes
   * @param type the type of the file
   */
  sendFile(name:string, path:string, date:string, fileSize:string, type:string) {
    this.fileHandler.sendFile(name,path, date, fileSize, type);
  }

  /**
   * The function send a logout msg to the server
   */
  logoutMousey() {
    this.connectionHandler.sendLogout();
  }

  /**
   * This function set the download Path for the file system
   * @param {*} promise a function for refresh when have the files
   */
  setDownloadPath(promise) {
    this.fileHandler.setDownloadPath(promise);
  } 

  /**
   * This function set the Documents path for the file system
   * @param {*} promise a function for refresh when have the files
   */
  setDocumentPath(promise) {
    this.fileHandler.setDocumentPath(promise);
  }

  /**
   * This function set the External path for the file system
   * @param {*} promise a function for refresh when have the files
   */
  setExternalPath(promise) {
    this.fileHandler.setExternalStoragePath(promise);
  }

  /**
   * This function set the Images path for the file system
   * @param {*} promise a functgion for refresh when have the files
   */
  setImagePath(promise) {
    this.fileHandler.setImagePath(promise);
  }

  /**
   * The function start the viewer handler
   * @param promise 
   */
  startViewer(promise) {
    this.viewerHandler.startViewer(promise);
  }  

  /**
   * The function end the viwer handler
   */
  endViewer() {
    this.viewerHandler.endViewer();
  }

  /**
   * The function send a zoom in msg to the server
   */
  viewZoomIn() {
    this.viewerHandler.zoomIn();
  }

  /**
   * The function send a zoom out msg to the server
   */
  viewZoomOut() {
    this.viewerHandler.zoomOut();
  }
}
