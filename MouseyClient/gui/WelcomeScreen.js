import React from 'react';
import BackHandler from 'react-native';
import {StyleSheet, View, Text, Button, ImageBackground} from 'react-native';
import changeScreen from '../App';
import Screen from './Screen';
import ConnectionScreen from './ConnectionScreen';

export default class WelcomeScreen extends Screen{

  constructor(handler) {
    super(handler);
    this._number = 0;
  };

  connectClicked = () => {
    this.handler.navigate(new ConnectionScreen(this.handler));
    //this is how we update a value and see in the screen
    //this.handler.refresh();
  }

  render = () => {
      return ( 
        <ImageBackground source={require('./img/Welcome_Screen.png')} style={styles.container}>
          <View style = {{flex:3}}></View>
          <View style = {{flex:2, paddingRight:60, paddingLeft:60}}>
            <Button style = {{marginBottom:10}}
                title="Connect" onPress={this.connectClicked}/>
            <View> 
              <Text>    
                </Text>
            </View>
            <Button style = {{flex:1}} title="Log Book" />
          </View>
          <View style = {{flex:1,paddingRight:80}}>
            <Text>
              Mobile Mouse App version 3.0
            </Text>
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