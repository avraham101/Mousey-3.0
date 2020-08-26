import React from 'react';
import {View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity, Image} from 'react-native';
import Screen from './Screen';
import Menu from './Components/Menu';

export default class TouchPadScreen extends Screen{

  constructor(handler, logicManager) {
    super(handler);
    this.logicManager = logicManager;
    this.clickLeft = this.clickLeft.bind(this);
    this.realseLeft = this.realseLeft.bind(this);
    this.clickRight = this.clickRight.bind(this);
    this.realseRight = this.realseRight.bind(this);
  };

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

  render = () => {
    return( 
      <ImageBackground source={require('./img/TouchPad_Screen.png')} style={styles.container}>
          <Menu handler={this.handler}/>
          <View style={{flex:8, backgroundColor:''}}>           
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
