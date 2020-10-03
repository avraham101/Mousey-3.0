import {createStartViewerMsg, ViewerMsg, createZoomMsg} from './Messages';
import ConnectionHandler from './ConnectionHandler';

export default class ViewerHandler {

  connectionHandler:ConnectionHandler;
  currentView: any;
  view:(img:any)=>void;
  
  constructor(connectionHandler:ConnectionHandler) {
    this.connectionHandler = connectionHandler;
    this.currentView = undefined;
  }
  
  /**
   * The functiuon send a start viewer msg to the server
   * @param {*} view is a promise after reciving the image we shold view it
   */
  startViewer(view) {
    console.log('start viewer');
    let msg = createStartViewerMsg();
    this.connectionHandler.send(msg);
    this.view = view
    this.connectionHandler.startViewerLisener(this.setCurrentImg)
    
  }

  /**
   * The function set the current image to show on the screen
   * @param msg 
   */
  setCurrentImg = (msg:ViewerMsg) => {
    this.currentView = msg.getView();
    this.view(this.currentView);
  }

  /**
   * The function send end msg to the server
   */
  endViewer = () => {
    this.connectionHandler.sendEndViewerMsg();
  }

  /**
   * The function send a zoom in msg to the sever
   */
  zoomIn = () => {
    let msg = createZoomMsg(true);
    this.connectionHandler.send(msg);
  }

  /**
   * The function send a zoom out msg to the server
   */
  zoomOut = () => {
    let msg = createZoomMsg(false);
    this.connectionHandler.send(msg);
  }

}