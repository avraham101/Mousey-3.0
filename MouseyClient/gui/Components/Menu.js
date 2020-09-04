import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

export default class Menu extends Component{

  constructor(props) {
    super(props);
    this.clickMenu = this.clickMenu.bind(this);
    this.menuOn = false;
  };

  clickMenu() {
    this.menuOn = !this.menuOn;
    this.props.handler.refresh();
  }

  renderMenu() {
    return <View style={{height:'90%', width:'90%', zIndex:1,
                        backgroundColor: 'rgba(1, 29, 69, 0.68)',}}>
            {/* <View style={{flex:1}}/> */}
            <TouchableOpacity style={{flex:2, margin:'3%', marginTop:'10%'}}>
              <Image source={require('./img/Button_Mousey.png')} resizeMode='contain'/>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:2, margin:'3%'}}>
              <Image source={require('./img/Button_Pad.png')} resizeMode='contain'/>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:2, margin:'3%'}}>
              <Image source={require('./img/Button_Files.png')} resizeMode='contain'/>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:2, margin:'3%'}}>
              <Image source={require('./img/Button_Logout.png')} resizeMode='contain'/>
            </TouchableOpacity>
              
            </View> 
  }

  renderMenuButton() {
    if(this.menuOn) {
      return (
        <TouchableOpacity onPress={this.clickMenu} style={{zIndex:1, height:'11%', width:'90%', backgroundColor:'#4A94FC', borderColor:'black', 
                          borderWidth:1, borderTopLeftRadius:25, borderTopRightRadius:25}}>
          <Text style={{textAlign:'center', marginTop:'15%', color:'white' }}> ... </Text>
        </TouchableOpacity>
      ); 
    }
    return (
      <TouchableOpacity onPress={this.clickMenu} style={{margin:'2%', height:'100%', backgroundColor:'#4F7495', borderColor:'black', 
                        borderWidth:1, borderRadius:50,}}>
        <Text style={{textAlign:'center',  marginTop:'25%', color:'white' }}> Menu </Text>
      </TouchableOpacity>
    ); 
  }

  render = () => {
    if(!this.menuOn) {
      return (
      <View style={{position:'absolute', right:'2%',top:'2%', width:'18%', height:'9%'}}>
        {this.renderMenuButton()}
      </View>);
    }
    return (
      <View style={{right:'0%', top:'2%', height:'90%', position:'absolute'}}>
        {this.renderMenuButton()}
        {this.renderMenu()}
      </View>);
    
  };
};
