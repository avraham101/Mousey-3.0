export type Sensor = Accelometer | Gyroscope;

export interface Accelometer {
  tag: 'Accelometer'
  x: number, 
  y:number,
  z:number
}

export interface Gyroscope {
  tag: 'Gyroscope',
  x: number,
  y: number, 
  z: number,
}

export const createAccelometer = (x:number, y:number, z:number):Accelometer => {
  return {tag:'Accelometer',x:x,y:y,z:z};
}

export const createGyroscope = (x:number, y:number, z:number):Gyroscope => {
  return {tag:'Gyroscope',x:x,y:y,z:z};
}

export const sameSensorData = (a:Sensor, b:Sensor, level:number): Boolean => {
  let treshhold = Math.pow(10, -level);
  if(Math.pow(a.x - b.x, 2) < treshhold)
    return true;
  if(Math.pow(a.y - b.y, 2) < treshhold)
    return true; 
  if(Math.pow(a.z - b.z, 2) < treshhold)
    return true; 
  return false;
}

