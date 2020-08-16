import React from 'react';
import {View, Text, Button, StyleSheet, ImageBackground, Image} from 'react-native';
import Screen from './Screen';
import WelcomeScreen from './WelcomeScreen';
import LogicManager from '../service/LogicManager'
import InitScreen from './InitScreen';

export default class ConnectionScreen extends Screen{

  constructor(handler) {
    super(handler);
    this.logicManager = new LogicManager();
    this.search();
  };

  search = () => {
    console.log('Started Search')
    this.logicManager.broadcast(this.foundServer); 
  }

  foundServer = (server_name) => {
    this.handler.navigate(new InitScreen(this.handler, this.logicManager));
  }

  connect = () => {
  }

  backClicked = () => {
    this.handler.navigate(new WelcomeScreen(this.handler));
  };

  render = () => {
      return( 
        <ImageBackground source={require('./img/Conneciton_Screen.png')} style={styles.container}>
          {/*<Button title='Search Server' onPress={this.search}/>
          <Button title='Connect' onPress={this.connect}/>*/}
          <View style={{flex:2}}>
          </View>
          <View style={{flex:3}}>
            <View style={{flex:3, paddingLeft:60, paddingTop: 45}}>
              <Image source={require('./img/searching5.gif')}/>
            </View>
            <View style={{flex:1,  paddingLeft:60, paddingRight: 60}}>
              <Button title='Back' onPress={this.backClicked}/>
            </View>
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