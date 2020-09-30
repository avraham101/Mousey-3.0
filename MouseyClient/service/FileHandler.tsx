import {Message} from './Messages';
import {Folder, Item, createFolder, createFile} from './Folders';
import ConnectionHandler from './ConnectionHandler';
import {readDir, readFile, CachesDirectoryPath, DocumentDirectoryPath, DownloadDirectoryPath, 
        ExternalDirectoryPath, ExternalStorageDirectoryPath} from 'react-native-fs';
import { PermissionsAndroid, CameraRoll } from 'react-native'

export default class FileHandler {

  connectionHandler:ConnectionHandler;
  path:string;
  prevPaths:string[];
  items:Item[];
  prevItems:Item[][];
  ready:boolean;

  constructor(connectionHandler) {
    this.connectionHandler = connectionHandler;
    this.prevPaths = [];
    this.items = [];
    this.prevItems = [];
    // this.setDownloadPath();
    this.setImagePath();
  }

  /**
   * The function return if we have permissions to the images folder
   */
  async checkPermession() {
    let permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    let hasPermission = await PermissionsAndroid.check(permission);
    if(!hasPermission) {
      let status = await PermissionsAndroid.request(permission);
      if(status !== 'granted') {
        return false;
      }
    }
    return true;
  }

  /**
   * The function se the image path to the files then updaet them
   */
  async setImagePath() {
    if(this.checkPermession()) {
      this.path = 'Images';
      this.getImages();
    }
    else {
      console.log('Dont have premession to Image Folder');
    }
  }

 /**
  * The function get the Images from the camera roll folder
  */
 async getImages() {
    await CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
    .then(r => {
      let photoes = r.edges;
      console.log(photoes);
    })
    .catch((err) => {
       console.log('Error getting the Images');
    });
  }

  /**
   * The function set the download path to the files then update them
   */
  setDownloadPath() {
    this.path = DownloadDirectoryPath;
    this.getItems();
  }

  /**
   * The function set the document path to the files then update them
   */
  setDocumentPath() {
    this.path = DocumentDirectoryPath ;
    this.getItems();
  }

  /**
   * The function set the external path to the files then update them
   */
  setExternalPath() {
    this.path = ExternalDirectoryPath;
    this.getItems();
  }

  /**
   * The function set the external storage path to the files then update them
   */
  setExternalStoragePath() {
    this.path = ExternalStorageDirectoryPath;
    this.getItems();
  }

  /**
   * The function get the item list from the current path
   */
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
