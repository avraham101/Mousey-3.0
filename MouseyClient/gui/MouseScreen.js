import React from 'react';
import {View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity, Image} from 'react-native';
import { setUpdateIntervalForType, SensorTypes , accelerometer, gyroscope, } from "react-native-sensors";
import Screen from './Screen';

export default class MouseScreen extends Screen{

  constructor(handler, logicManager) {
    super(handler);
    this.logicManager = logicManager;
    this.menuOn = false; 
    this.clickMenu = this.clickMenu.bind(this);
    this.clickLeft = this.clickLeft.bind(this);
    this.realseLeft = this.realseLeft.bind(this);
    this.clickRight = this.clickRight.bind(this);
    this.realseRight = this.realseRight.bind(this);
    this.subscribeSensors = this.subscribeSensors.bind(this);
    this.subscribeSensors();
  };

  clickMenu() {
    this.menuOn = !this.menuOn;
    this.handler.refresh();
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
    let intervals = 30;
    setUpdateIntervalForType(SensorTypes.accelerometer, intervals);
    setUpdateIntervalForType(SensorTypes.gyroscope, intervals);
    this.accelerometer = accelerometer.subscribe(({ x, y, z, timestamp }) => {
      let data = {x, y, z};
      this.logicManager.saveMouseMoveAcc(data); 
      this.logicManager.sendMouseMove();
    });
    this.gyroscope = gyroscope.subscribe(({ x, y, z, timestamp }) => {
        let data = {x, y, z};
        this.logicManager.saveMouseMoveGyro(data);
    });
  }

  unsubscribeSensors() {
    this.accelerometer.unsubscribe();
    this.gyroscope.unsubscribe();
  }


  renderMenu() {
    if(this.menuOn)
      return <View style={{zIndex:1, position:'absolute', left:'65%', right:'2%',top:'5%', bottom:'8%', 
                          borderTopLeftRadius:30, backgroundColor: 'rgba(1, 29, 69, 0.68)',}}>
              <View style={{flex:1}}/>
              <TouchableOpacity style={{flex:2, margin:'6%'}}>
                <Image source={require('./img/Button_Mousey.png')} resizeMode='contain'/>
              </TouchableOpacity>
              <TouchableOpacity style={{flex:2, margin:'6%'}}>
                <Image source={require('./img/Button_Pad.png')} resizeMode='contain'/>
              </TouchableOpacity>
              <TouchableOpacity style={{flex:2, margin:'6%'}}>
                <Image source={require('./img/Button_Files.png')} resizeMode='contain'/>
              </TouchableOpacity>
              <TouchableOpacity style={{flex:2, margin:'6%'}}>
                <Image source={require('./img/Button_Logout.png')} resizeMode='contain'/>
              </TouchableOpacity>
               
             </View> 
  }

  renderMenuButton() {
    if(this.menuOn)
      return (
        <TouchableOpacity onPress={this.clickMenu} style={{flex:1, zIndex:1, margin:'2%', backgroundColor:'#4A94FC', 
                          borderColor:'black', borderWidth:1, borderRadius:50,}}>
          <Text style={{textAlign:'center', marginTop:'25%', color:'white' }}> X </Text>
        </TouchableOpacity>
      );
    return (
      <TouchableOpacity onPress={this.clickMenu} style={{flex:1, margin:'2%', backgroundColor:'#4F7495', borderColor:'black', 
                        borderWidth:1, borderRadius:50,}}>
        <Text style={{textAlign:'center', marginTop:'25%', color:'white' }}> Menu </Text>
      </TouchableOpacity>
    ); 
  }

  render = () => {
    return( 
      <ImageBackground source={require('./img/Mousey_Screen.png')} style={styles.container}>
          {this.renderMenu()}
          <View style={{flex:1,flexDirection:'row-reverse'}}> 
            {this.renderMenuButton()}
            <View style={{flex:5}}/>
          </View>
          <View style={{flex:3, flexDirection:'row-reverse', backgroundColor:''}}>
            <TouchableOpacity onPressIn={this.clickLeft} onPressOut={this.realseLeft} style={{marginRight:'3%', flex:3, 
                              backgroundColor:'#809EC6',  borderColor:'#BBD6EE', borderLeftWidth:1, borderRightWidth:5, 
                              borderTopRightRadius:100}}>
                                        <Text> L </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft:'1%', marginRight:'1%', flex:1, backgroundColor:'#809EC6',  borderColor:'#BBD6EE', 
                              borderWidth:1, borderRadius:100}}>
            </TouchableOpacity>
            <TouchableOpacity  onPressIn={this.clickRight} onPressOut={this.realseRight} style={{marginLeft:'3%', flex:3,  
                              backgroundColor:'#809EC6',  borderColor:'#BBD6EE', borderLeftWidth:5, borderRightWidth:1, 
                              borderTopLeftRadius:100}}>
            </TouchableOpacity>
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
