import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

export default class CustomButton extends Component{

  constructor(props) {
    super(props);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.BASE_COLOR = this.props.BASE_COLOR;
    this.CLICK_COLOR = this.props.CLICK_COLOR;
    this.backgroundColor = this.BASE_COLOR;
  };

  onTouchStart(e) {
    this.backgroundColor = this.CLICK_COLOR;
    if(this.props.onTouchStart) {
      this.props.onTouchStart(e);
    }
    this.props.handler.refresh();
  }

  onTouchEnd(e) {
    this.backgroundColor = this.BASE_COLOR;
    if(this.props.onTouchEnd) {
      this.props.onTouchEnd(e);
    }
    this.props.handler.refresh();
  }

  onTouchMove(e) {
    if(this.props.onTouchMove) {
      this.props.onTouchMove(e);
    }
    this.props.handler.refresh();
  }
  
  render() {
    return <View onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} onTouchMove={this.onTouchMove}
              style={{backgroundColor:this.backgroundColor,  
                      flex:this.props.flex, height:this.props.height, width:this.props.width, 
                      right:this.props.right, top:this.props.top,
                      zIndex:this.props.zIndex, position:this.props.position, 
                      margin:this.props.margin, 
                      alignSelf:this.props.alignSelf, alignItems:this.props.alignItems,
                      marginTop:this.props.marginTop, marginBottom:this.props.marginBottom,
                      marginRight:this.props.marginRight, marginLeft:this.props.marginLeft,  
                      borderColor:this.props.borderColor, 
                      borderWidth:this.props.borderWidth,
                      borderLeftWidth:this.props.borderLeftWidth, borderRightWidth:this.props.borderRightWidth, 
                      borderBottomWidth:this.props.borderBottomWidth,
                      borderRadius:this.props.borderRadius,
                      borderTopRightRadius:this.props.borderTopRightRadius, borderTopLeftRadius:this.props.borderTopLeftRadius,
                      flexDirection:this.props.flexDirection }}>
            {this.props.children}
            </View>
  }

}