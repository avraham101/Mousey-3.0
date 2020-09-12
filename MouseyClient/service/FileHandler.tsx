import {Message} from './Messages';
import {Folder, Item, createFolder, createFile} from './Folders';
import ConnectionHandler from './ConnectionHandler';
import {readDir, CachesDirectoryPath, DocumentDirectoryPath, DownloadDirectoryPath, readFile} from 'react-native-fs';
export default class FileHandler {

  connectionHandler:ConnectionHandler;
  path:string;
  prevPaths:string[];
  items:Item[];
  prevItems:Item[][];
  ready:boolean;

  constructor(connectionHandler) {
    this.connectionHandler = connectionHandler;
    this.path =  DownloadDirectoryPath; // '.';
    this.prevPaths = [];
    this.items = [];
    this.prevItems = [];
    this.getItems();
  }

  async getItems() {
    await readDir(this.path).then(arr=>{
      let files:Item[] = [];
      arr.forEach(node =>{
        if(node.isDirectory()) {
          files.push(createFolder(node,this.path));
        }
        else if(node.isFile()) {
          files.push(createFile(node,this.path));
        }
      });
      this.items = files;
    }).catch(reason=>{
      console.log('CANT GET ITEMS REASON');
      console.log(reason);
    });
  }

  /**
   * The function return the current name
   */
  getCurrentName() {
    if(this.path == DownloadDirectoryPath) 
      return 'Downloads';
    return this.path;
  }

  /**
   * The function return the current items
   */
  getCurrentItems() {
    return this.items;
  }

  /**
   * The function move to the given folder from here path
   * If the folder is exits move to it
   * @param path the path to the file
   */
  moveToFolder(path:string) {
    this.prevPaths.push(this.path);
    this.path = path;
    this.prevItems.push(this.items);
    this.getItems();
  }


  /**
   * The function move to the prev Folder
   * If there isnt prev folder the function, we will stay at the same folder
   */
  moveToPrevFolder() {
    if(this.prevPaths.length>0) {
      this.path = this.prevPaths.pop();
      this.items = this.prevItems.pop();
    }
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
    readFile(path,'base64').then(res=>{
      console.log('send file to computer ' + name+' file size '+ fileSize);
      this.connectionHandler.sendFileMsg(name, date, fileSize, ''+res);
    }).catch( err => {
      console.log('In send file with '+err);
    })
  }
}
