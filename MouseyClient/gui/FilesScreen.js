import React from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, ScrollView} from 'react-native';
import Screen from './Screen';
import MouseScreen from './MouseScreen';
import TouchPadScreen from './TouchPadScreen';
import Menu from './Components/Menu';
import CustomButton from './Components/CustomButton';

export default class FilesScreen extends Screen{

  constructor(handler, logicManager) {
    super(handler);
    this.logicManager = logicManager;
    //click function
    this.clickMousey = this.clickMousey.bind(this);
    this.clickTouchPad = this.clickTouchPad.bind(this);
    this.clickPrevFolder = this.clickPrevFolder.bind(this);
    //send file properties
    this.selectedFile = null;
    this.selectedFileEvent = null;
    this.selectFile = this.selectFile.bind(this);
    this.moveSelectFile = this.moveSelectFile.bind(this);
    this.endSelectFile = this.endSelectFile.bind(this);
    //reder function 
    this.renderItems = this.renderItems.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderLogo = this.renderLogo.bind(this);
    this.renderSelectedFile = this.renderSelectedFile.bind(this);
    this.renderComputerGate = this.renderComputerGate.bind(this);
  };

  clickMousey() {
    this.handler.navigate(new MouseScreen(this.handler, this.logicManager));
  }

  clickTouchPad() {
    this.handler.navigate(new TouchPadScreen(this.handler, this.logicManager));
  }

  clickPrevFolder(e) {
    this.logicManager.moveToPrevFolder();
  }

  selectFile(e, file) {
    this.selectedFile = file;
    this.selectedFileEvent = e.nativeEvent;
  }

  moveSelectFile(e, fixed_y, send_line_y) {
    if(send_line_y > fixed_y) {
      console.log('send file to computer ' + this.selectedFile.name);
      this.selectedFile = null;
      this.selectedFileEvent = null;
    }
    else {
      this.selectedFileEvent = e.nativeEvent;
    }
  }

  endSelectFile(e) {
    this.selectedFile = null;
    this.selectedFileEvent = null;
  }

  renderLogo(item) {
    switch(item.tag) {
      case 'File': return <Image source={require('./img/file_c.png')}/>; 
      case 'Image': return <Image source={require('./img/image_c.png')}/>;
      case 'Folder': return <Image source={require('./img/folder_c.png')}/>;
      default: return <Text> U </Text>;
    }
  }

  renderItem(item, index) {
    // return (<View key={index} style={{flexDirection:'row-reverse', margin:'1%', borderColor:'black', borderBottomWidth:1}}>
    return (<View key={index} style={{flexDirection:'row-reverse', margin:'1%', borderColor:'black', borderBottomWidth:1}}>
              <CustomButton handler={this.handler} flex={1} onTouchStart={(e)=>this.selectFile(e, item)}>
                {this.renderLogo(item)}
              </CustomButton>
              <View style={{flex:3, alignSelf:'flex-start', padding:'1%'}}>
                <Text style={{fontFamily:'sans-serif', fontSize:18}}> {item.name} </Text>
              </View>
              <View style={{flex:2}}>
                <Text style={{textAlign:'center', fontFamily:'sans-serif', fontSize:18}}> x-x-x </Text>
              </View>
              <View style={{flex:1}}>
                <Text style={{textAlign:'center', fontFamily:'sans-serif', fontSize:18}}> {item.size} </Text>
              </View>
            </View>);
  }

  renderItems() {
    let items = this.logicManager.getCurrentItems();
    if(items.length == 0) {
      return <Text style={{textAlign:'center', marginTop:'5%'}}> Empty Folder </Text>;
    }
    return items.map((item,index)=>this.renderItem(item, index));
  }

  renderComputerGate() {
    if(this.selectedFile!=null) {
      let base_line_y = 20;
      return (<View style={{ alignSelf:'center', position:'absolute', top:base_line_y, width:'95%', backgroundColor:'#5E9EDE', 
                              borderColor:'black', borderWidth:3, zIndex:1,borderRadius:1, borderStyle:'dashed',  flexDirection:'row-reverse'}}>
                <View style={{flex:1, top:'10%', alignItems:'center'}}>
                  <Image source={require('./img/arrow.gif')} style={{width: 50, height: 50, transform: [{ rotate: '0deg'}]}}/>
                </View>
                <Image style={{flex:1, alignSelf:'center'}} source={require('./img/computer_logo.png')} resizeMode='contain'/>
                <View style={{flex:1, top:'10%', alignItems:'center'}}>
                  <Image source={require('./img/arrow.gif')} style={{width: 50, height: 50, transform: [{ rotate: '180deg'}]}}/>
                </View>
                {/* <Text style={{textAlign:'center', fontSize:24, margin:0, padding:0}}> Send </Text> */}
              </View>);
    }
  }

  renderSelectedFile() {
    if(this.selectedFile!=null) {
      let x = this.selectedFileEvent.pageX - 20;
      let y = this.selectedFileEvent.pageY - 50;
      let base_line_y = 100;
      return (<CustomButton handler={this.handler} onTouchMove={(e)=>this.moveSelectFile(e, y, base_line_y)} alignItems={'flex-end'}
                  zIndex={1} top={'5%'} height={'90%'} width={'100%'} position={'absolute'}> 
                  <View style={{ alignItems:'center', borderRadius:10, padding:'1%', backgroundColor:'#C8DDF1', borderColor:'black', borderWidth: 2,
                                 right:x, top:y}}>
                                  <Text> {this.selectedFile.name} </Text>
                                  {this.renderLogo(this.selectedFile)}
                                  <CustomButton handler={this.handler} onTouchStart={this.endSelectFile}
                                      margin={'1%'} BASE_COLOR='#0E83F0' CLICK_COLOR='white'>
                                    <Text style={{textAlign:'center', width:50, height:25}}> X </Text>
                                  </CustomButton>
                  </View>
              </CustomButton>);
      // return <View style={{zIndex:1, right:'5%', top:'5%', height:'90%', width:'90%', position:'absolute', backgroundColor:'black'}}></View>
    }
  }

  render = () => {
      return ( 
        <ImageBackground source={require('./img/Files_Screen.png')} style={styles.container}>
          <Menu handler={this.handler} clickMousey={this.clickMousey} clickTouchPad={this.clickTouchPad}/>
          {this.renderComputerGate()}
          {this.renderSelectedFile()}
          <View style={{flex:1.5}}/>
          <View style={{flex:1, marginRight:'5%', marginLeft:'5%', backgroundColor:'#85A0C7', flexDirection:'row-reverse'}}>
              <View style={{flex:2, alignItems:'center'}}>
                <Image source={require('./img/folder_p.png')} resizeMode='contain'/>
              </View>
              <View style={{flex:6}}>
                <Text style={{fontFamily:'sans-serif-medium', fontSize:20, textAlign:'right', paddingTop:'7%'}}> 
                  {this.logicManager.getCurrentFolderName()} 
                </Text>
              </View>
              <CustomButton handler={this.handler} onTouchEnd={this.clickPrevFolder} height={'100%'} flex={1} alignSelf={'center'} borderColor={'black'} borderRightWidth={1} 
                    CLICK_COLOR={'white'}>
                {/* <Image source={require('./img/back_p.png')}/> */}
                <Text style={{textAlign:'center', paddingTop:'30%', fontSize:24}}> ... </Text>
              </CustomButton>
          </View>
          <View style={{flex:6, marginRight:'5%', marginLeft:'5%', marginBottom:'20%', backgroundColor:'#C8DDF1'}}>
            <ScrollView>
              {this.renderItems()}
            </ScrollView>
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