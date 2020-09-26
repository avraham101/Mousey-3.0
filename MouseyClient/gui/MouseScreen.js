import React from 'react';
import {View, Text, Button, StyleSheet, ImageBackground, Image} from 'react-native';
import { setUpdateIntervalForType, SensorTypes , accelerometer, gyroscope, magnetometer} from "react-native-sensors";
import Screen from './Screen';
import TouchPadScreen from './TouchPadScreen';
import FilesScreen from './FilesScreen';
import Menu from './Components/Menu';
import Roller from './Components/Roller';
import CustomButton from './Components/CustomButton';

export default class MouseScreen extends Screen{

  constructor(handler, logicManager) {
    super(handler);
    this.logicManager = logicManager;
    this.clickTouchPad = this.clickTouchPad.bind(this);
    this.clickFileTransmit = this.clickFileTransmit.bind(this);
    this.clickLeft = this.clickLeft.bind(this);
    this.realseLeft = this.realseLeft.bind(this);
    this.clickRight = this.clickRight.bind(this);
    this.realseRight = this.realseRight.bind(this);
    this.subscribeSensors = this.subscribeSensors.bind(this);
    this.subscribeSensors();
  };

  clickTouchPad() {
    this.unsubscribeSensors();
    this.handler.navigate(new TouchPadScreen(this.handler, this.logicManager));
  }

  clickFileTransmit() {
    this.unsubscribeSensors();
    this.handler.navigate(new FilesScreen(this.handler, this.logicManager));
  }

  clickLeft() {
    this.logicManager.sendClickLeftDown();
  }

  realseLeft() {
    this.logicManager.sendClickLeftUp();
  }

  clickRight() {
    this.logicManager.sendClickRightDown();
  }

  realseRight() {
    this.logicManager.sendClickRightUp();
  }

  subscribeSensors() {
    let intervals = 10;
    setUpdateIntervalForType(SensorTypes.accelerometer, intervals);
    setUpdateIntervalForType(SensorTypes.gyroscope, intervals);
    setUpdateIntervalForType(SensorTypes.magnetometer, intervals);
    this.accelerometer = accelerometer.subscribe(({ x, y, z, timestamp }) => {
      let data = {x, y, z};
      this.logicManager.saveMouseMoveAcc(data); 
      this.logicManager.sendMouseMove();
    });
    this.gyroscope = gyroscope.subscribe(({ x, y, z, timestamp }) => {
        let data = {x, y, z};
        this.logicManager.saveMouseMoveGyro(data);
    });
    this.magnetometer = magnetometer.subscribe(({ x, y, z, timestamp }) => {
      let data = {x, y, z};
      this.logicManager.saveMouseMoveMagnometer(data);
    });
  }

  unsubscribeSensors() {
    this.accelerometer.unsubscribe();
    this.gyroscope.unsubscribe();
  }

  render = () => {
    return( 
      <ImageBackground source={require('./img/Mousey_Screen.png')} style={styles.container}>
          <Menu handler={this.handler} clickTouchPad={this.clickTouchPad} clickFileTransmit={this.clickFileTransmit}/>
          <View style={{flex:1}}/>
          <View style={{flex:3, flexDirection:'row-reverse', backgroundColor:''}}>
            <CustomButton handler={this.handler}  onTouchStart={this.clickLeft} onTouchEnd={this.realseLeft} 
                            flex={3} marginRight={'3%'} borderTopRightRadius={100} borderLeftWidth={1} borderRightWidth={5}
                            borderColor={'#BBD6EE'}  BASE_COLOR={'#809EC6'} CLICK_COLOR={'#599FFC'}/>
            <Roller handler={this.handler} logicManager={this.logicManager}/>
            <CustomButton handler={this.handler} onTouchStart={this.clickRight} onTouchEnd={this.realseRight} 
                          flex={3} marginLeft={'3%'} borderTopLeftRadius={100} borderLeftWidth={5} borderRightWidth={1}
                          borderColor={'#BBD6EE'}  BASE_COLOR={'#809EC6'} CLICK_COLOR={'#599FFC'}/>
          </View>
          <View style={{flex:5, backgroundColor:''}}>
           
          </View>
      </ImageBackground>
      );
  };

};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
  }
});
