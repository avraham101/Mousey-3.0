import React from 'react';
import {StyleSheet, View, Text, Button, ImageBackground, Image} from 'react-native';
import Screen from './Screen';
import ConnectionScreen from './ConnectionScreen';
import CustomButton from './Components/CustomButton';

export default class WelcomeScreen extends Screen{

  constructor(handler) {
    super(handler);
    this.connectClicked = this.connectClicked.bind(this);
  };

  connectClicked = () => {
    this.handler.navigate(new ConnectionScreen(this.handler));
    //this is how we update a value and see in the screen
    //this.handler.refresh();
  }

  render = () => {
      return ( 
        <ImageBackground source={require('./img/Welcome_Screen.png')} style={styles.container}>
          <View style = {{flex:3}}/>
          <View style = {{flex:2, alignSelf:'center', flexDirection:'row-reverse'}}>
            <CustomButton handler={this.handler} marginTop={'10%'} marginLeft={'5%'} onTouchEnd={this.connectClicked}>
              <Image source={require('./img/Button_Connect.png')} resizeMode='contain'/>
            </CustomButton>
            <CustomButton handler={this.handler} marginTop={'10%'}>
              <Image source={require('./img/Button_LogBook.png')} resizeMode='contain'/>
            </CustomButton>
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