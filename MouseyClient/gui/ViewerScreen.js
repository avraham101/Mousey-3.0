import React from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, ScrollView} from 'react-native';
import Screen from './Screen';
import MouseScreen from './MouseScreen';
import TouchPadScreen from './TouchPadScreen';
import FilesScreen from './FilesScreen';
import Menu from './Components/Menu';
import CustomButton from './Components/CustomButton';

export default class ViewerScreen extends Screen{

  constructor(handler, logicManager) {
    super(handler);
    this.logicManager = logicManager;
    //click function
    this.clickMousey = this.clickMousey.bind(this);
    this.clickTouchPad = this.clickTouchPad.bind(this);
    this.clickLogout = this.clickLogout.bind(this);
    this.clickFileTransmit = this.clickFileTransmit.bind(this);
    this.clickLeft = this.clickLeft.bind(this);
    this.realseLeft = this.realseLeft.bind(this);
    this.clickRight = this.clickRight.bind(this);
    this.realseRight = this.realseRight.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this); 
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.doubleClick = null;
    this.clickZoomIn = this.clickZoomIn.bind(this);
    this.clickZoomOut = this.clickZoomOut.bind(this);
    //view attributes
    this.view = undefined;
    this.prevView = undefined;
    this.prevprevView = undefined;
    this.logicManager.startViewer((view)=>{
      this.view = view;
      this.handler.refresh()
      });
    //render functions
    this.renderView = this.renderView.bind(this);
    };

  clickMousey() {
    this.logicManager.endViewer();
    this.handler.navigate(new MouseScreen(this.handler, this.logicManager));
  }

  clickTouchPad() {
    this.logicManager.endViewer();
    this.handler.navigate(new TouchPadScreen(this.handler, this.logicManager));
  }

  clickLogout() {
    this.logicManager.endViewer();
    this.logicManager.logoutMousey();
  }

  clickFileTransmit() {
    this.logicManager.endViewer();
    this.handler.navigate(new FilesScreen(this.handler, this.logicManager));
  }

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
        this.onDoubleClick();
      }
    }
    this.prevMoveTimeStamp = e.nativeEvent.timestamp;
  }

  onTouchMove = (e) => {
    let currentTouch = null;
    let indexOfTouch = e.nativeEvent.touches.length-1;
    currentTouch = e.nativeEvent.touches[indexOfTouch]; 
    this.logicManager.sendTouchMove(currentTouch.locationX, currentTouch.locationY, false);
  }

  onTouchEnd = (e) => {
    this.logicManager.sendTouchMove(-1, -1, true);
  }

  clickZoomIn = (e) => {
    this.logicManager.viewZoomIn();
  }

  clickZoomOut = (e) => {
    this.logicManager.viewZoomOut();
  }

  renderView= () => {
    if(this.view == undefined)
      return <Image style={{position: 'absolute', left:0, top:0, width: 360, height: 540}} source={require('./img/pic1.png')}/>;
    if(this.prevView != undefined) {
      let output = (<View>
                <Image style={{position: 'absolute', left:0, top:0, width: 360, height: 540}} source={{uri: this.prevView}}/>
                <Image style={{position: 'absolute', left:0, top:0, width: 360, height: 540}} source={{uri: this.view}}/>
              </View>);
      this.prevView = this.view;
      return output;
    }
    this.prevView = this.view;
    return <Image style={{position: 'absolute', left:0, top:0, width: 360, height: 540}} source={{uri: this.view}}/>;
  }

  render = () => {
      return ( 
        <ImageBackground source={require('./img/Viewer_Screen.png')} style={styles.container}>
          <Menu handler={this.handler} clickMousey={this.clickMousey} clickTouchPad={this.clickTouchPad} clickLogout={this.clickLogout}
                clickFileTransmit={this.clickFileTransmit}/>
          <View style={{flex:1,}}/>
          <View key={3000} style={{marginLeft:'0%', marginRight:'0%', flex:6, alignItems:'baseline', alignSelf:'baseline', 
                alignContent:'flex-start'}}
                onTouchStart = {this.onTouchStart}
                onTouchMove = {this.onTouchMove}
                onTouchEnd = {this.onTouchEnd}> 
            {this.renderView()}
            <View style={{ zIndex:1, backgroundColor:'rbga(0,0,0,0)'}}>
              <CustomButton handler={this.handler}  onTouchStart={this.clickZoomIn} 
                          flex={1} borderWidth={2} borderRadius={80}
                          borderColor={'#19336B'} BASE_COLOR={'rgba(173, 214, 250, 0.7)'} CLICK_COLOR={'#0A79DB'}>
                            <Text style={{fontSize:25, top:'5%', right:'5%'}}> + </Text>
              </CustomButton>  
              <CustomButton handler={this.handler}  onTouchStart={this.clickZoomOut} 
                          flex={1} borderWidth={2} borderRadius={80}
                          borderColor={'#19336B'} BASE_COLOR={'rgba(173, 214, 250, 0.7)'} CLICK_COLOR={'#0A79DB'}>
                            <Text style={{fontSize:25, top:'5%', right:'3%'}}> – </Text>
              </CustomButton> 
              <View style={{flex:9}}/> 
            </View>
          </View>
          <View style={{flex:1,  flexDirection:'row-reverse', backgroundColor:'rgba(0, 0, 0, 0)'}}>
            <CustomButton handler={this.handler}  onTouchStart={this.clickLeft} onTouchEnd={this.realseLeft} 
                          flex={1} borderWidth={2} borderTopRightRadius={80}
                          borderColor={'#19336B'} BASE_COLOR={'rgba(173, 214, 250, 0.7)'} CLICK_COLOR={'#0A79DB'}/>
            <CustomButton handler={this.handler} onTouchStart={this.clickRight} onTouchEnd={this.realseRight} 
                          flex={1} borderWidth={2} borderTopLeftRadius={80}
                          borderColor={'#19336B'}  BASE_COLOR={'rgba(173, 214, 250, 0.7)'} CLICK_COLOR={'#0A79DB'}/>
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