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
            <CustomButton handler={this.handler} flex={1} marginTop={'5%'} marginBottom={'25%'} marginRight={'20%'}
                          marginLeft={'5%'} onTouchEnd={this.connectClicked} 
                          borderColor={'black'} borderWidth={2} borderRadius={25} 
                          BASE_COLOR={'#2196F3'} CLICK_COLOR={'#69B9F6'}>
              <Text style={{textAlign:'center', color:'white', top:'35%', fontSize:18, }}> Connect </Text>
            </CustomButton>
            <CustomButton handler={this.handler} flex={1} marginTop={'5%'} marginBottom={'25%'} marginLeft={'20%'}
                          marginRight={'5%'} 
                          borderColor={'black'} borderWidth={2} borderRadius={25} 
                          BASE_COLOR={'#2196F3'} CLICK_COLOR={'#69B9F6'}>
              <Text style={{textAlign:'center', color:'white', top:'35%', fontSize:18}}> Log Book </Text>
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