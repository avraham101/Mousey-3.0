import React from 'react';
import {View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity, Image} from 'react-native';
import Screen from './Screen';
import Menu from './Components/Menu';
import Roller from './Components/Roller';

export default class TouchPadScreen extends Screen{

  constructor(handler, logicManager) {
    super(handler);
    this.logicManager = logicManager;
    this.clickLeft = this.clickLeft.bind(this);
    this.realseLeft = this.realseLeft.bind(this);
    this.clickRight = this.clickRight.bind(this);
    this.realseRight = this.realseRight.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this); 
    this.prevMoveTimeStamp = null;
    this.doubleClick = null;
  };

  clickLeft(e) {
    this.logicManager.sendClickLeftDown();
    this.doubleClick = null;
  }

  realseLeft() {
    this.logicManager.sendClickLeftUp();
    this.doubleClick = null;
  }

  clickRight() {
    this.logicManager.sendClickRightDown();
  }

  realseRight() {
    this.logicManager.sendClickRightUp();
  }

  onDoubleClick() {
    if(this.doubleClick == null) {
      this.doubleClick = true;
    }
    else {
      this.doubleClick = !this.doubleClick;
    }
    if(this.doubleClick) {
      this.logicManager.sendClickLeftDown();
    }
    else {
      this.logicManager.sendClickLeftUp();
    }
  }

  onTouchStart = (e) => {
    let treshold = 165;
    if(this.prevMoveTimeStamp!=null) {
      if(e.nativeEvent.timestamp - this.prevMoveTimeStamp < treshold){
        console.log('double click');
        this.onDoubleClick();
      }
    }
    this.prevMoveTimeStamp = e.nativeEvent.timestamp;
  }

  onTouchMove = (e) => {
    let currentTouch = null;
    let indexOfTouch = e.nativeEvent.touches.length-1;
    // TODO: need to check if this is needed
    // if(e.nativeEvent.touches.length>1 && indexOfTouch == e.nativeEvent.touches.length-1) { 
    //   //Assum at most 2 touches, 1 touch button, 1 touch mouse
    //   indexOfTouch = indexOfTouch - 1;
    // }
    currentTouch = e.nativeEvent.touches[indexOfTouch]; 
    // console.log('x: '+currentTouch.locationX+'\n\t\t\t\t\t y: '+currentTouch.locationY);
    this.logicManager.sendTouchMove(currentTouch.locationX, currentTouch.locationY, false);
  }

  onTouchEnd = (e) => {
    this.logicManager.sendTouchMove(-1, -1, true);
  }

  render = () => {
    return( 
      <ImageBackground source={require('./img/TouchPad_Screen.png')} style={styles.container}>
          <Menu handler={this.handler}/>
          <View style={{flex:1}}/>
          <View style={{flex:2, flexDirection:'row-reverse'}}>
            <TouchableOpacity onPressIn={this.clickLeft} onPressOut={this.realseLeft} style={{marginRight:'3%', flex:3, 
                              backgroundColor:'#5D83B6',  borderColor:'#19336B', borderLeftWidth:1, borderRightWidth:5, 
                              borderTopRightRadius:50}}/>
            <Roller handler={this.handler} logicManager={this.logicManager}/>
            <TouchableOpacity  onPressIn={this.clickRight} onPressOut={this.realseRight} style={{marginLeft:'3%', flex:3,  
                              backgroundColor:'#5D83B6',  borderColor:'#19336B', borderLeftWidth:5, borderRightWidth:1, 
                              borderTopLeftRadius:50}}/>
          </View>
          <View style={{flex:5.5}}>
                <View style={{flex:7, marginRight:'3%', marginLeft:'3%', borderWidth:1, borderBottomLeftRadius:40, borderBottomRightRadius:40}}
                      onTouchStart = {this.onTouchStart}
                      onTouchMove = {this.onTouchMove}
                      onTouchEnd = {this.onTouchEnd}>
                </View>
                <View style={{flex:1}}/>
          </View>
      </ImageBackground>
      );
  };

};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // remove width and height to override fixed static size
    // width: null,
    // height: null,
  }
});
