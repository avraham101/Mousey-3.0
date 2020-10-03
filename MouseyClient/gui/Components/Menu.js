import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import CustomButton from './CustomButton';

export default class Menu extends Component{

  //TODO: no more needed can delete this
  PATH_MOUSEY_OFF = require('./img/Button_Mousey.png');
  PATH_MOUSEY_ON = require('./img/Button_Mousey_Click.png');
  PATH_TOUCH_OFF = require('./img/Button_Pad.png');
  PATH_TOUCH_ON = require('./img/Button_Pad_Click.png');
  PATH_FILES_OFF = require('./img/Button_Files.png');
  PATH_FILES_ON = require('./img/Button_Files.png');
  PATH_LOGOUT_OFF = require('./img/Button_Logout.png');
  PATH_LOGOUT_ON = require('./img/Button_Logout.png');

  constructor(props) {
    super(props);
    this.clickMenu = this.clickMenu.bind(this);
    this.menuOn = false;
    //Mousey properties
    this.pathMousey = this.PATH_MOUSEY_OFF;
    this.releaseMousey = this.releaseMousey.bind(this);
    this.clickMousey = this.clickMousey.bind(this);
    //TouchPad properties
    this.pathTouchPad = this.PATH_TOUCH_OFF;
    this.releaseTouchPad = this.releaseTouchPad.bind(this);
    this.clickTouchPad = this.clickTouchPad.bind(this);
    //Files properties
    this.pathFiles = this.PATH_FILES_OFF;
    this.releaseFiles = this.releaseFiles.bind(this);
    this.clickFileTransmit = this.clickFileTransmit.bind(this);
    //Logout properties
    this.pathLogout = this.PATH_LOGOUT_OFF;
    this.releaseLogout = this.releaseLogout.bind(this);
    this.clickLogout = this.clickLogout.bind(this);
    //Viewer properties
    this.clickViewer = this.clickViewer.bind(this);
  };

  clickMenu() {
    this.menuOn = !this.menuOn;
  }

  clickMousey() {
    if(this.props.clickMousey) {
      this.props.clickMousey();
    }
    // this.pathMousey = this.PATH_MOUSEY_ON;
  }

  releaseMousey() {
    this.pathMousey = this.PATH_MOUSEY_OFF;
  }

  clickTouchPad() {
    if(this.props.clickTouchPad) {
      this.props.clickTouchPad();
    }
    // this.pathTouchPad = this.PATH_TOUCH_ON;
  }

  releaseTouchPad() {
    this.pathTouchPad = this.PATH_TOUCH_OFF;
  }

  clickFileTransmit() {
    if(this.props.clickFileTransmit) {
      this.props.clickFileTransmit();
    }
  }

  releaseFiles() {
    this.pathFiles = this.PATH_FILES_OFF;
  }

  clickLogout() {
    if(this.props.clickLogout) {
      this.props.clickLogout();
    }
  }

  clickViewer() {
    if(this.props.clickViewer) {
      this.props.clickViewer();
    }
  }

  releaseLogout() {
    this.pathLogout = this.PATH_LOGOUT_OFF;
  }

  renderMenu() {
    return <View style={{height:'90%', width:'90%', zIndex:2,
                        backgroundColor: 'rgba(1, 29, 69, 0.68)',}}>
            {/* <View style={{flex:1}}/> */}

              <CustomButton handler={this.props.handler} onTouchStart={this.clickMousey}
                            flex={2} margin={'3%'} marginTop={'10%'} borderColor={'black'} borderWidth={2} borderRadius={25} 
                            BASE_COLOR={'#2196F3'} CLICK_COLOR={'#69B9F6'}>
                  <Text style={{textAlign:'center', color:'white', top:'35%', fontSize:18, }}> Mousey </Text>
              </CustomButton>
              <CustomButton handler={this.props.handler} onTouchStart={this.clickTouchPad}
                            flex={2} margin={'3%'} borderWidth={2} borderRadius={25} 
                            BASE_COLOR={'#2196F3'} CLICK_COLOR={'#69B9F6'}>
                  <Text style={{textAlign:'center', color:'white', top:'35%', fontSize:18, }}> Touch Pad </Text>
              </CustomButton>
              <CustomButton handler={this.props.handler} onTouchStart={this.clickFileTransmit}
                            flex={2} margin={'3%'} borderWidth={2} borderRadius={25} 
                            BASE_COLOR={'#2196F3'} CLICK_COLOR={'#69B9F6'}>
                  <Text style={{textAlign:'center', color:'white', top:'35%', fontSize:18, }}> Files </Text>
              </CustomButton>
              <CustomButton handler={this.props.handler} onTouchStart={this.clickViewer}
                            flex={2} margin={'3%'} borderWidth={2} borderRadius={25} 
                            BASE_COLOR={'#2196F3'} CLICK_COLOR={'#69B9F6'}>
                  <Text style={{textAlign:'center', color:'white', top:'35%', fontSize:18, }}> Viewer </Text>
              </CustomButton>
              <CustomButton handler={this.props.handler} onTouchStart={this.clickLogout}
                            flex={2} margin={'3%'} borderWidth={2} borderRadius={25} 
                            BASE_COLOR={'#2196F3'} CLICK_COLOR={'#69B9F6'}>
                  <Text style={{textAlign:'center', color:'white', top:'35%', fontSize:18, }}> Logout </Text>
              </CustomButton>
            </View> 
  }

  renderMenuButton() {
    if(this.menuOn) {
      return (
        <CustomButton handler={this.props.handler} onTouchStart={this.clickMenu} zIndex={2} height={'11%'} width={'90%'} 
                      borderWidth={1} borderTopLeftRadius={25} borderTopRightRadius={25}
                      BASE_COLOR={'#4F7495'} CLICK_COLOR={'#4A94FC'} borderColor={'black'}>
            <Text style={{textAlign:'center', marginTop:'15%', color:'white' }}> ... </Text>          
        </CustomButton>
      ); 
    }
    return (
      <CustomButton handler={this.props.handler} onTouchStart={this.clickMenu} margin={'2%'} height={'100%'}
                    borderRadius={50} borderWidth={1}
                    BASE_COLOR={'#4F7495'} CLICK_COLOR={'#4A94FC'} borderColor={'black'}>
          <Text style={{textAlign:'center',  marginTop:'25%', color:'white' }}> Menu </Text>
      </CustomButton>
    ); 
  }

  render = () => {
    if(!this.menuOn) {
      return (
      <View style={{position:'absolute', right:'2%',top:'1.5%', width:'18%', height:'9%'}}>
        {this.renderMenuButton()}
      </View>);
    }
    return (
      <View style={{right:'0%', top:'1.5%', height:'90%', position:'absolute'}}>
        {this.renderMenuButton()}
        {this.renderMenu()}
      </View>);
    
  };
};
