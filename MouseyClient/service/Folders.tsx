import { ReadDirItem } from "react-native-fs";

//----------------------------------------------- interfaces -----------------------------------------------
export type Item = Folder | File | Image;

export interface Folder {
    tag: 'Folder',
    name: string,
    path: string,
    prevPath: string, 
    date: Date,
    size: string,
    items: Item[], 
    isFolderReady : ()=>boolean,
}

export interface File {
    tag:'File',
    name: string,
    path: string,
    type: string,
    date: Date,
    size: string,
    content: any,
    isContentReady : ()=>boolean,
}

export interface Image {
    tag:'Image',
    name: string,
    path: string,
    type: string,
    date: Date,
    size: string,
    content: any,
}

//----------------------------------------------- predicats -----------------------------------------------
export const isFolder = (x:any):x is Folder => x.tag === "Folder";
export const isFile = (x:any):x is File => x.tag === "File";
export const Image = (x:any):x is Image => x.tag === "Image";

//-------------------------------------------- constractors -----------------------------------------------

export const createFolder = (item:ReadDirItem, prevPath:string, items:Item[]=null):Folder => {
    let output:Folder = {tag:'Folder', name:item.name, path:item.path, date:item.mtime, size:item.size, items:items, prevPath:prevPath, isFolderReady:null};
    if(items==null) {
        output.isFolderReady = ()=>false;
    }
    else {
        output.isFolderReady = ()=>true;
    }
    return output;
}

var getType = (name:string):string => {
    let arr = name.split('.');
    return arr[arr.length-1];
}

export const createFile = (item:ReadDirItem, prevPath:string, content:any=null):File => {
    let output:File = {tag:'File', name:item.name, path:item.path, type:getType(item.name), date:item.mtime, size:item.size, content:content, isContentReady:null};
    if(content==null) {
        output.isContentReady = ()=>false;
    } 
    else {
        output.isContentReady = ()=>true;
    }
    return output;
}


