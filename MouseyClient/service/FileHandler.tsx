import {Message} from './Messages';
import {Folder, Item, createFolder, createFile, createImage} from './Folders';
import ConnectionHandler from './ConnectionHandler';

export default class FileHandler {

  connectionHandler:ConnectionHandler;
  current:Folder;
  constructor(connectionHandler) {
    this.connectionHandler = connectionHandler;
    this.current = this.createRoot2();
  }

  createRoot() {
    let a = createFile('file','txt',20,'nothing');
    let b = createImage('image','png',2,[[0,0,0],[0,0,0]]);
    return createFolder('folder',[a,b]);
  }

  createRoot2() {
    let items = [];
    for(let i =0; i<20; i++) {
      if(i%2==0) {
        items.push(createFile('file '+i,'txt',20,'nothing'));
      }
      else {
        items.push(createImage('image '+i,'png',2,[[0,0,0],[0,0,0]]));
      }
    }
    return createFolder('folder',items);
  }

  /**
   * The function return the current name
   */
  getCurrentName() {
    return this.current.name;
  }

  /**
   * The function return the current items
   */
  getCurrentItems() {
    return this.current.items;
  }

  /**
   * The function move to the prev Folder
   * If there is no prev folder creating a prev folder only with the current folder with him
   */
  moveToPrevFolder() {
    let prev:Folder = this.current.prev;
    if(prev==null) {
      this.current = createFolder('Root',[this.current]);
      this.current.prev = this.current;
    }
    else {
      this.current = prev;
    }
  }
}
