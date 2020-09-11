//----------------------------------------------- interfaces -----------------------------------------------
export type Item = Folder | File | Image;

export interface Folder {
    tag: 'Folder',
    size: number,
    name: string,
    items: Item[], 
    prev: Folder,
}

export interface File {
    tag:'File',
    name: string,
    type: string,
    size: number,
    content: any,
}

export interface Image {
    tag:'Image',
    name: string,
    type: string,
    size: number,
    content: any,
}

//----------------------------------------------- predicats -----------------------------------------------
export const isFolder = (x:any):x is Folder => x.tag === "Folder";
export const isFile = (x:any):x is File => x.tag === "File";
export const Image = (x:any):x is Image => x.tag === "Image";

//-------------------------------------------- constractors -----------------------------------------------

export const createFolder = (name:string, items:Item[], prev:Folder=null):Folder => {
    let output:Folder = {tag:'Folder', name:name, size:-1, items:items, prev:prev};
    let sumed_size:number = items.reduce((acc:number, item):number=>acc+item.size,0);
    output.size = sumed_size;
    return output;
}

export const createFile = (name:string, type:string, size:number, content:any):File => {
    return {tag:'File', name:name, type:type, size:size, content:content};
}

export const createImage = (name:string, type:string, size:number, content:any):Image => {
    return {tag:'Image', name:name, type:type, size:size, content:content};
}


