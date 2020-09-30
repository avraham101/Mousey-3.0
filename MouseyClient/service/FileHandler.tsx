import {Message} from './Messages';
import {Folder, Item, createFolder, createFile, createImage} from './Folders';
import ConnectionHandler from './ConnectionHandler';
import {readDir, readFile, CachesDirectoryPath, DocumentDirectoryPath, DownloadDirectoryPath, 
        ExternalDirectoryPath, ExternalStorageDirectoryPath} from 'react-native-fs';
import { PermissionsAndroid } from 'react-native'
import CameraRoll from "@react-native-community/cameraroll";

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
    this.setExternalStoragePath();
    // this.setImagePath();
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
   * @param {*} promise a function for execute when have the files
   */
  async setImagePath(promise?) {
    if(this.checkPermession()) {
      this.path = 'Images';
      this.items = [];
      this.getImages(promise);
    }
    else {
      console.log('Dont have premession to Image Folder');
    }
  }

 /**
  * The function get the Images from the camera roll folder
  * @param {*} promise a function for execute when have the files
  */
 async getImages(promise?) {
   let n = 20; 
    await CameraRoll.getPhotos({
      first: n,
      assetType: 'Photos',
      include: ['filename', 'fileSize',]
    })
    .then(r => {
      let images:Item[] = [];
      let photoes = r.edges;
      photoes.forEach( (p,index) => {
        images.push(createImage(p.node.image,p.node.type,p.node.group_name,p.node.timestamp));
      })
      this.items = images;
      if(promise!=undefined) {
        promise();
      }
    })
    .catch((err) => {
       console.log('Error getting the Images');
    });
  }

  /**
   * The function set the download path to the files then update them
   * @param {*} promise a function for execute when have the files
   */
  setDownloadPath(promise?) {
    this.path = DownloadDirectoryPath;
    this.items = [];
    this.getItems(promise);
  }

  /**
   * The function set the document path to the files then update them
   * @param {*} promise a function for execute when have the files
   */
  setDocumentPath(promise?) {
    this.path = DocumentDirectoryPath ;
    this.items = [];
    this.getItems(promise);
  }

  /**
   * The function set the external path to the files then update them
   * @param {*} promise a function for execute when have the files
   */
  setExternalPath(promise?) {
    this.path = ExternalDirectoryPath;
    this.items = [];
    this.getItems(promise);
  }

  /**
   * The function set the external storage path to the files then update them
   * @param {*} promise a function for execute when have the files
   */
  setExternalStoragePath(promise?) {
    this.path = ExternalStorageDirectoryPath;
    this.items = [];
    this.getItems(promise);
  }

  /**
   * The function get the item list from the current path
   * @param {*} promise a function for execute when have the files
   */
  async getItems(promise?) {
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
      if(promise!=undefined) {
        promise();
      }
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
    if(this.path == ExternalStorageDirectoryPath)
      return 'Operating System Files';
    if(this.path == DocumentDirectoryPath)
      return 'Documents';
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
