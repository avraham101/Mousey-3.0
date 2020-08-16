import React from 'react';
import {View, Text, Button} from 'react-native';

export default class Screen {

  constructor(handler) {
    this.handler = handler;
  };

  render =  () => {
      return( 
        <View>
          <Text> Error. Please go back to cheack why the screen didnt render correctly. </Text>
        </View>
      );
  };
};