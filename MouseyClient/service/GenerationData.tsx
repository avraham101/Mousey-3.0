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

export interface Angle {
  tag: 'Angle',
  angle: number,
  diff: number,
}

export const createAccelometer = (x:number, y:number, z:number):Accelometer => {
  return {tag:'Accelometer',x:x,y:y,z:z};
}

export const createGyroscope = (x:number, y:number, z:number):Gyroscope => {
  return {tag:'Gyroscope',x:x,y:y,z:z};
}

export const createEngle = (x:number, y:number, z:number):Angle => {
  let angle:number = Math.atan2(y,x);
  angle = angle * (180 / Math.PI);
  angle += 90;
  angle = (angle+360) % 360;
  return {tag:'Angle', angle:angle, diff:null};
}

export const createEngleWithPrev = (x:number, y:number, z:number, prev_angle:number):Angle => {
  let angle:number = Math.atan2(y,x);
  angle = angle * (180 / Math.PI);
  angle += 90;
  angle = (angle+360) % 360;
  let diff:number = angle - prev_angle;
  return {tag:'Angle', angle:angle, diff:diff};
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

