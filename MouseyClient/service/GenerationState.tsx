import {Accelometer, Gyroscope, Angle} from './GenerationData';

export type State = Ready | Dir | Stop | Done | Error;  
export type Dir = Up | Down | Left | Right | UpLeft | UpRight | DownLeft | DownRight | Ned; 

//--------------------------------------------- Interfaces -------------------------------------------------

interface Ready{
  tag:'Ready'
}

interface Stop {
  tag:'Stop',
  prevStep: Dir,
}

interface Done{
  tag:'Done'
}

interface Error {
  tag:'Error',
  msg: string,
}

interface Ned {
  tag:'Ned',
  speed: string,
  accelometers: Accelometer[],
  gyroscopes: Gyroscope[],
  angels: Angle[],
}

interface Up {
  tag: 'Up',
  speed: string,
  accelometers: Accelometer[],
  gyroscopes: Gyroscope[],
  angels: Angle[],
}

interface Down {
  tag: 'Down'
  speed: string,
  accelometers: Accelometer[],
  gyroscopes: Gyroscope[],
  angels: Angle[],
}

interface Left {
  tag: 'Left'
  speed: string,
  accelometers: Accelometer[],
  gyroscopes: Gyroscope[],
  angels: Angle[],
}

interface Right {
  tag: 'Right'
  speed: string,
  accelometers: Accelometer[],
  gyroscopes: Gyroscope[],
  angels: Angle[],
}

interface UpRight {
  tag: 'UpRight'
  speed: string,
  accelometers: Accelometer[],
  gyroscopes: Gyroscope[],
  angels: Angle[],
}

interface UpLeft {
  tag: 'UpLeft'
  speed: string,
  accelometers: Accelometer[],
  gyroscopes: Gyroscope[],
  angels: Angle[],
}

interface DownRight {
  tag: 'DownRight'
  speed: string,
  accelometers: Accelometer[],
  gyroscopes: Gyroscope[],
  angels: Angle[],
}

interface DownLeft {
  tag: 'DownLeft'
  speed: string,
  accelometers: Accelometer[],
  gyroscopes: Gyroscope[],
  angels: Angle[],
}

//--------------------------------------------- Predicates -------------------------------------------------

export const isReady = (x:any):x is Ready => x.tag === 'Ready';
export const isStop = (x:any):x is Stop => x.tag === 'Stop';
export const isError = (x:any): x is Error => x.tag === 'Error';
export const isDone = (x:any): x is Done => x.tag === 'Done';
export const isDir = (x:any):x is Dir => {
  return isUp(x) || isDown(x) || isLeft(x) || isRight(x) || 
          isUpRight(x) || isUpLeft(x) || isDownRight(x) || isDownLeft(x) || isNed(x);
}
export const isUp = (x:any):x is Up => x.tag ==='Up';
export const isDown = (x:any):x is Down => x.tag ==='Down';
export const isLeft = (x:any):x is Left => x.tag ==='Left';
export const isRight = (x:any):x is Right => x.tag ==='Right';
export const isUpLeft = (x:any):x is UpLeft => x.tag ==='UpLeft';
export const isUpRight = (x:any):x is UpRight => x.tag ==='UpRight';
export const isDownLeft = (x:any):x is DownLeft => x.tag ==='DownLeft';
export const isDownRight = (x:any):x is DownRight => x.tag ==='DownRight';
export const isNed = (x:any):x is Ned => x.tag ==='Ned';

//--------------------------------------------- Constrructors -------------------------------------------------

export const createReady = ():Ready => {
  return {tag:'Ready'};
}

export const createDone = ():Done => {
  return {tag:'Done'};
}

export const createStop = (prev:Dir):Stop => {
  return {tag:'Stop', prevStep:prev};
}

export const createError = (msg:string):Error => {
  return {tag:'Error', msg:msg};
}

export const createEmptyUp = ():Up => {
  return {tag:'Up', speed:null, accelometers:[],gyroscopes:[], angels:[]};
}

export const createEmptyDown = ():Down => {
  return {tag:'Down', speed:null, accelometers:[],gyroscopes:[], angels:[]};
}

export const createEmptyRight = ():Right => {
  return {tag:'Right', speed:null, accelometers:[],gyroscopes:[], angels:[]};
}

export const createEmptyLeft = ():Left => {
  return {tag:'Left', speed:null, accelometers:[],gyroscopes:[], angels:[]};
}

export const createEmptyUpRight = ():UpRight => {
  return {tag:'UpRight', speed:null, accelometers:[],gyroscopes:[], angels:[]};
}

export const createEmptyUpLeft = ():UpLeft => {
  return {tag:'UpLeft', speed:null, accelometers:[],gyroscopes:[], angels:[]};
}

export const createEmptyDownRight = ():DownRight => {
  return {tag:'DownRight', speed:null, accelometers:[],gyroscopes:[], angels:[]};
}

export const createEmptyDownLeft = ():DownLeft => {
  return {tag:'DownLeft', speed:null, accelometers:[],gyroscopes:[], angels:[]};
}

export const createEmptyNed = ():Ned => {
  return {tag:'Ned', speed:null, accelometers:[],gyroscopes:[], angels:[]};
}

//----------------------------------------------- State Functions ------------------------------------
export const dirHasEnough = (dir:Dir):boolean => {
  let min:number = 20;
  //TODO Need to delete this
  //if(isNed(dir))
  //  min=40;
  return dir.accelometers.length >= min &&
     dir.gyroscopes.length >= min;
}

export const clearDir = (dir:Dir):void => {
  dir.accelometers = [];
  dir.gyroscopes= [];
  dir.angels=[];
}

export const clearGyroscope = (dir:Dir):void => {
  dir.gyroscopes= [];
}

export const clearAccelometer = (dir:Dir):void => {
  dir.accelometers = [];
}

export const clearAngler = (dir:Dir):void => {
  dir.angels = [];
}