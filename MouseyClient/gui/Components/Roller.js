import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

export default class Roller extends Component{

  constructor(props) {
    super(props);
    this.onRollerMove = this.onRollerMove.bind(this);
    this.onRollerEnd = this.onRollerEnd.bind(this);
    this.prevRoll = null;
    this.rollerSpeed = null;
  };

  onRollerMove = (e) => {
    let treshold = 0.3;
    let tresholdTime = 50;
    if(this.prevRoll != null) {
      if(e.nativeEvent.timestamp - this.prevRoll.timestamp > tresholdTime) {
        this.rollerSpeed = null;
      }
      else if(e.nativeEvent.pageY - this.prevRoll.pageY <= treshold && e.nativeEvent.pageY - this.prevRoll.pageY >= -treshold) {
        this.rollerSpeed = null;
      }
      else {
        // if(e.nativeEvent.pageY - this.prevRollerY > treshold) { //Moving roller Down
        // else if(e.nativeEvent.pageY - this.prevRollerY < -treshold) { //Moving Roller Up
        this.rollerSpeed = e.nativeEvent.pageY - this.prevRoll.pageY;
        this.props.logicManager.sendRoller(this.rollerSpeed);
      }
    }
    this.prevRoll = e.nativeEvent;
    this.props.handler.refresh();
  }
  
  onRollerEnd = (e) => {
    this.prevRoll = null;
    this.rollerSpeed = null;
    this.props.handler.refresh();
  }

  renderRollerTag() {
    if(this.rollerSpeed == null) {
      return (<View style={{flex:1, backgroundColor:'#19336B'}}/>);
    }
    if(this.rollerSpeed > 0) {
      return  <Image style={{borderRadius:10, borderWidth:0, transform: [{ scale: 0.9 }]}} source={require('./img/Roller_down.png')}/>
    }
    return  <Image style={{borderRadius:10, borderWidth:0, transform: [{ scale: 0.9 }]}} source={require('./img/Roller_up.png')}/>
  }

  render() {
    return (<View style={{flex:1, backgroundColor:'#19336B'}} 
                  onTouchMove={this.onRollerMove} onTouchEnd={this.onRollerEnd}
                  onMouseLeave={this.onRollerEnd}
                  onMouseOut={this.onRollerEnd}>
              {this.renderRollerTag()}
              <View style={{flex:3}}/>
            </View>);
  }

}