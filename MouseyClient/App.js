/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import Screen from './gui/Screen';
import WelcomeScreen from './gui/WelcomeScreen';
import InitScreen from './gui/InitScreen'
import ConnectionScreen from './gui/ConnectionScreen';
import MouseScreen from './gui/MouseScreen';
import TouchPadScreen from './gui/TouchPadScreen';
import FilesScreen from './gui/FilesScreen';
import LogicManager from './service/LogicManager';


export default class ScreenHandler extends React.Component{
  
  constructor() {
    super();
    // this.state = {stratgyScreen:new WelcomeScreen(this)};  
    // this.state = {stratgyScreen:new ConnectionScreen(this, new LogicManager())};
    // this.state = {stratgyScreen:new InitScreen(this, new LogicManager())};
    // this.state = {stratgyScreen:new MouseScreen(this, new LogicManager())}; 
    // this.state = {stratgyScreen:new TouchPadScreen(this,new LogicManager())};
    this.state = {stratgyScreen:new FilesScreen(this,new LogicManager())};
  }

  navigate(stratgyScreen) {
    this.setState({stratgyScreen:stratgyScreen}); 
  }

  refresh() {
    this.setState({});
  }

  render() {
    return this.state.stratgyScreen.render();
  }
}