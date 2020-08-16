import React from 'react';
import {View, Text, Button, StyleSheet, ImageBackground, Image, TouchableOpacity} from 'react-native';
import Screen from './Screen';
import MouseScreen from './MouseScreen';
import { setUpdateIntervalForType, SensorTypes , accelerometer, gyroscope} from "react-native-sensors";
import LogicManager from '../service/LogicManager';

export default class InitScreen extends Screen{

  constructor(handler, logicManager) {
    super(handler);
    this.logicManager = logicManager;
    this.yesNoOn = true;
    this.initState = this.logicManager.getInitState();
    this.subscribe = true;
    this.accelerometer = undefined;
    this.gyroscope = undefined;
    this.subscribeSensors = this.subscribeSensors.bind(this);
    this.moveToNextState = this.moveToNextState.bind(this);
  };

  /**
   * The function render the first selection choise
   */
  render_yse_no =() => {
    let noClick = () => {
      this.handler.navigate(new MouseScreen(this.handler,this.logicManager));
    }
    let yesClick = () => {
      this.yesNoOn = false;
      this.handler.refresh();
    }
    return (
      <ImageBackground source={require('./img/Init_Screen.png')} style={styles.container}>
        <View style={{flex:1}}/>
        <View style={{flex:3, paddingLeft:'25%', paddingRight:'25%', marginTop:'30%'}}>
          <Text style={{paddingTop:'5%', paddingBottom:'5%', textAlign:'center'}}> Want to improve your mousey? </Text>
          <Button title='Yes' onPress={yesClick}/>
          <Text style={{paddingTop:'5%', paddingBottom:'5%', textAlign:'center'}}> Is only take a secend</Text>
          <Button title='No' onPress={noClick}/>
        </View>
        <View style={{flex:1}}/>
      </ImageBackground>); 
  }

  /**
   * The function get the instruction text
   */
  getInstuction = () => {
    console.log(this.initState)
    let result =  
    this.initState == 'Error'? 'Error':
    this.initState == 'Stop'? 'adjasting stopped':
    this.initState == 'Ready'? 'For adjasting your phone, press start.' :
    this.initState == 'Up'? 'Put your finger on the button and\n Slide your phone Up.\n In the end of the movment raise your finger.' :
    this.initState == 'Down'? 'Put your finger on the button and\n Slide your phone Down.\n In the end of the movment raise your finger':
    this.initState == 'Left' ? 'Put your finger on the button and\n Slide your phone Left.\n In the end of the movment raise your finger':
    this.initState == 'Right'? 'Put your finger on the button and\n Slide your phone Right.\n In the end of the movment raise your finger':
    this.initState == 'UpRight'? 'Put your finger on the button and\n Slide your phone Up Right.\n In the end of the movment raise your finger':
    this.initState == 'UpLeft'? 'Put your finger on the button and\n Slide your phone Up Left.\n In the end of the movment raise your finger':
    this.initState == 'DownRight'? 'Put your finger on the button and\n Slide your phone Down Right.\n In the end of the movment raise your finger':
    this.initState == 'DownLeft'? 'Put your finger on the button and\n Slide your phone Down Left.\n In the end of the movment raise your finger':
    this.initState == 'Ned' ? 'Put your finger on the button and\n Please do not move your phone.\n In the end of the movment raise your finger':
    this.initState == 'Processing' ? 'processing Data':
    this.initState == 'Done' ? 'Analyzing Data. Thank You for helping us':
    "Empty Instructions";
    return (<Text> {result} </Text>);
  }

  /**
   * The function get the instruction image
   */
  getGifInstruction = () => {
    let size = 200;
    if(this.initState == 'Ready' || this.initState == 'Stop' || this.initState=='Ned') 
      return (<Image source={require('./img/surface.png')} />)
    if(this.initState=='Processing' || this.initState =='Done') 
      return (<Image source={require('./img/process.gif')}  style={{width: size, height: size}} />)
    size = 150;
    let pivot = 0;
    let source=require('./img/arrow.gif');
    this.initState == 'Up'? pivot = '270deg':
    this.initState == 'Down'? pivot = '90deg':
    this.initState == 'Left' ? pivot = '180deg':
    this.initState == 'Right'? pivot = '0deg':
    this.initState == 'DownRight'? pivot = '45deg':
    this.initState == 'UpRight'? pivot = '315deg':
    this.initState == 'DownLeft'? pivot = '135deg':
    this.initState == 'UpLeft'? pivot = '225deg':
      pivot = '0deg';
    return (<Image source={require('./img/arrow.gif')}
              style={{width: size, height: size, transform: [{ rotate: pivot}]}}/>)
  }

  moveToNextState(nextState) {
    console.log("in promise");
    this.unsubscribeSensors();
    //waiting number of secenods for the next state to proceed
    let interval = 600; //secend 1 = 1000
    let restartCallback = () => {
        console.log('in callback');
        this.initState = nextState;
        this.logicManager.clearSensorsData();
        //TODO DELETE THIS
        //if(nextState != 'Done' && nextState != 'Error')
        //  this.subscribeSensors(); 
        this.handler.refresh();
      }
    setTimeout(restartCallback, interval);
    this.initState = 'Processing';
    this.handler.refresh();
  }

  subscribeSensors() {
    // let intervals = 10; // for fast moving
    let intervals = 10; // for fast moving
    setUpdateIntervalForType(SensorTypes.accelerometer, intervals);
    setUpdateIntervalForType(SensorTypes.gyroscope, intervals);
    this.accelerometer = accelerometer.subscribe(({ x, y, z, timestamp }) => {
      let data = {x, y, z};
      this.logicManager.saveAccelometerData(data); 
    });
    this.gyroscope = gyroscope.subscribe(({ x, y, z, timestamp }) => {
        let data = {x, y, z};
        this.logicManager.saveGyroscopeData(data);
    });
  }

  unsubscribeSensors() {
    this.accelerometer.unsubscribe();
    this.gyroscope.unsubscribe();
  }

  /**
   * The function get The start Button
   */
  getButtonStart = () => {
    let onClick = () => {
        this.initState = this.logicManager.nextInitStep();
        //this.subscribeSensors();
        this.handler.refresh();
    }
    return <Button title='Start' onPress={onClick}/>
  }

  /**
   * The function get The stop Button
   */
  getButtonStop = () => {
    let onClick = () => {
      this.unsubscribeSensors();
      this.initState = this.logicManager.stopInitSteps();
      this.handler.refresh();
    }
    return <Button title='Stop' color='#CC3416' onPress={onClick}/>
  }

  /**
   * The function get The resume Button
   */
  getButtonResume = () => {
    let onClick = () => {
      this.subscribeSensors();
      this.initState = this.logicManager.resumeInitSteps();
      this.handler.refresh();
    }
    return <Button title='Resume' color='#2CC330' onPress={onClick}/>
  }

  getButtonSendData() {
    let onClickSend = () => {
      this.logicManager.sendData();
      this.handler.refresh();
    }
    let onClickRestart = () => {
      this.logicManager.restartSteps();
      this.initState = this.logicManager.getInitState();
      this.handler.refresh();
    }
    let onClickNext = () => {
      this.handler.navigate(new MouseScreen(this.handler,this.logicManager));
    }
    return  <View style={{flexDirection: 'row', paddingTop:'20%', alignItems: 'stretch', justifyContent: 'center', justifyContent: 'space-between'}}>
              <View>
                <Button title='Restart' onPress={onClickRestart}/>
              </View>
              <View>
                <Button title='Mousey' onPress={onClickNext}/>
              </View>
              <View>
                <Button title='Send Data' onPress={onClickSend}/>
              </View>
              
            </View>;
  }

  getButtonFinger = () => {
    let clickIn = (e) => {
      this.subscribeSensors();
    }
    let clickout = (e) => {
      this.moveToNextState(this.logicManager.nextInitStep());
    }
    return  <TouchableOpacity style={{alignItems:'center'}} onPressIn={clickIn} onPressOut={clickout}>
              <Image source={require('./img/Button_Finger.png')} resizeMode='contain'/>
            </TouchableOpacity>
  }

  /**
   * The function get The insturction Button
   */
  getButtonInstruction = () => {
    return this.initState == 'Stop'? this.getButtonResume():
    this.initState == 'Ready'? this.getButtonStart():
    //this.initState == 'Ned' ? [] :
    this.initState == 'Processing'? [] :
    this.initState == 'Done'? this.getButtonSendData() :
    //this.getButtonStop();
    this.getButtonFinger();
  }

  render = () => {
    if(this.yesNoOn) 
     return this.render_yse_no();
    return(
        <ImageBackground source={require('./img/Init_Screen.png')} style={styles.container}>
          <View style={{flex:1}}/>
          <View style={{flex:3, paddingLeft:'10%', paddingRight:'10%'}}>
            <View style={{flex:9}}>
              <View style={{paddingBottom: '20%', paddingTop:'5%', alignSelf:'center'}}>
                {this.getInstuction()} 
              </View>
              <View style={{paddingBottom: '1%', paddingTop:'1%', alignSelf:'center'}}>
                {this.getGifInstruction()}
              </View>
            </View>
            <View style={{flex:2}}>
              {this.getButtonInstruction()}
            </View>
          </View>
          <View style={{flex:1}}/>          
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