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
    this.clickLogout = this.clickLogout.bind(this);
    this.clickPrevFolder = this.clickPrevFolder.bind(this);
    this.clickNextFolder = this.clickNextFolder.bind(this);
    this.clickPath = this.clickPath.bind(this);
    //send file properties
    this.selectedFile = null;
    this.selectedFileEvent = null;
    this.sendFile = null;
    this.selectFile = this.selectFile.bind(this);
    this.moveSelectFile = this.moveSelectFile.bind(this);
    this.endSelectFile = this.endSelectFile.bind(this);
    //select path properties
    this.choises = ['Os Files', 'Downloads', 'Images', 'Docs'];
    this.selectedPath = this.choises[0];
    //reder function 
    this.renderItems = this.renderItems.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderLogo = this.renderLogo.bind(this);
    this.renderSelectedFile = this.renderSelectedFile.bind(this);
    this.renderComputerGate = this.renderComputerGate.bind(this);
    this.renderPathSelect = this.renderPathSelect.bind(this);
  };

  clickMousey() {
    this.handler.navigate(new MouseScreen(this.handler, this.logicManager));
  }

  clickTouchPad() {
    this.handler.navigate(new TouchPadScreen(this.handler, this.logicManager));
  }

  clickLogout() {
    this.logicManager.logoutMousey();
  }

  clickPrevFolder(e) {
    this.logicManager.moveToPrevFolder();
  }

  selectFile(e, file) {
    if(file.tag!='Folder') {
      this.selectedFile = file;
      this.selectedFileEvent = e.nativeEvent;
    }
    else {
      this.clickNextFolder(e, file);
    }
  }

  clickNextFolder(e, item) {
    if(item.tag == 'Folder') {
      this.logicManager.moveToFolder(item.path);
    }
  }

  moveSelectFile(e, fixed_y, send_line_y) {
    if(send_line_y > fixed_y) {
      let date = this.selectedFile.date.getDay()+'.'+this.selectedFile.date.getMonth()+'.'+this.selectedFile.date.getFullYear(); 
      this.logicManager.sendFile(this.selectedFile.name, this.selectedFile.path, date, this.selectedFile.size, this.selectedFile.type);
      this.sendFile = this.selectedFile;
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

  clickPath(name) {
    if(name=='Downloads' & this.selectedPath!=name) {
      this.logicManager.setDownloadPath(()=>this.handler.refresh()); 
    }
    else if(name=='Docs' & this.selectedPath!=name) {
      this.logicManager.setDocumentPath(()=>this.handler.refresh());
    }
    else if(name=='Images' & this.selectedPath!=name) {
      this.logicManager.setImagePath(()=>this.handler.refresh());
    }
    else if(name=='Os Files' & this.selectedPath!=name) {
      this.logicManager.setExternalPath(()=>this.handler.refresh());
    }
    this.selectedPath = name;
    this.handler.refresh();
  }

  renderLogo(item) {
    switch(item.tag) {
      case 'File': return <Image source={require('./img/file_c.png')}/>;
      case 'Folder': return <Image source={require('./img/folder_c.png')}/>;
      case 'Image': return <Image source={require('./img/image_c.png')}/>;
      default: return <Text> U </Text>;
    }
  }

  refactorName(str, max=20) {
    if(str.length > max) {
      let prefix = str.slice(0, max-6); 
      let sefix = str.slice(-5);
      return prefix + ' ... '+sefix;
    }
    return str;
  }

  renderItem(item, index) {
    return (<View key={index} style={{flexDirection:'row-reverse', margin:'1%', borderColor:'black', borderBottomWidth:1}}>
              <CustomButton handler={this.handler} flex={1} onTouchStart={(e)=>this.selectFile(e, item)}>
                {this.renderLogo(item)}
              </CustomButton>
              <View style={{flex:6}}>
                <View style={{flex:2}}>
                  <Text style={{fontFamily:'sans-serif', fontSize:16, textAlign:'right'}}> {this.refactorName(item.name)} </Text>
                </View>
                <View style={{flex:1, flexDirection:'row-reverse'}}>
                  <View style={{flex:1}}>
                    <Text style={{textAlign:'right', fontFamily:'sans-serif', fontSize:14, color:'gray'}}>
                      {item.date.getDay()}.{item.date.getMonth()}.{item.date.getFullYear()} </Text>
                  </View>
                  <View style={{flex:1}}>
                    <Text style={{textAlign:'left', fontFamily:'sans-serif', fontSize:14, color:'gray'}}> {item.size} b </Text>
                  </View>
                </View>
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
                                  <Text> Selected: </Text>
                                  <Text style={{color:'green'}}> {this.refactorName(this.selectedFile.name, 14)} </Text>
                                  <Text style={{color:'gray'}}> {this.selectedFile.tag} </Text>
                                  {/* {this.renderLogo(this.selectedFile)} */}
                                  <CustomButton handler={this.handler} onTouchStart={this.endSelectFile}
                                      margin={'1%'} BASE_COLOR='#0E83F0' CLICK_COLOR='white'>
                                    <Text style={{textAlign:'center', width:50, height:25}}> X </Text>
                                  </CustomButton>
                  </View>
              </CustomButton>);
    }
  }

  //TODO: new feature after selecting the file see the progress he sents to the server 
  renderSendFile() {
    if(this.sendFile!=null) {
      return (<View style={{ alignSelf:'center', position:'absolute', top:'40%', width:'80%', backgroundColor:'white', 
                  borderColor:'black', borderWidth:2, zIndex:1}}>
                    <View style={{flex:1, textAlign:'center'}}>
                      <Text> Sending File {this.sendFile.name} </Text>
                    </View>
                    <View style={{flex:1}}>
                      <Text> Progress Bar </Text>
                    </View>
              </View>);
    }
  }

  renderPathSelect = () => {
    let output = [];
    this.choises.forEach((ch,i) => {
      if(this.selectedPath===ch) {
        output.push(<CustomButton key={ch} handler={this.handler} flex={1} marginRight={'1%'} marginLeft={'1%'} onTouchEnd={()=>this.clickPath(ch)} 
                            marginTop={'1%'} marginBottom={'1%'}
                            borderColor={'white'} BASE_COLOR={'#2196F3'} CLICK_COLOR={'#69B9F6'}>
                        <Text style={{textAlign:'center', color:'white', top:'30%', fontSize:14, fontWeight:'bold'}}> {ch} </Text>
                    </CustomButton>);
      }
      else {
        output.push(<CustomButton key={i} handler={this.handler} flex={1} marginRight={'1%'} marginLeft={'1%'} onTouchEnd={()=>this.clickPath(ch)} 
                            marginTop={'1%'} marginBottom={'1%'}
                            BASE_COLOR={'#85A0C7'} CLICK_COLOR={'#69B9F6'}>
                        <Text style={{textAlign:'center', color:'black', top:'30%', fontSize:14, }}> {ch} </Text>
                    </CustomButton>);
      }
    });
    return (<View style={{flex:1, marginTop:'3%', marginLeft:'5%', marginRight:'5%', backgroundColor:'#48658D', flexDirection:'row-reverse'}}>
              {output}
            </View>);
  }

  render = () => {
      return ( 
        <ImageBackground source={require('./img/Files_Screen.png')} style={styles.container}>
          <Menu handler={this.handler} clickMousey={this.clickMousey} clickTouchPad={this.clickTouchPad} clickLogout={this.clickLogout}/>
          {this.renderComputerGate()}
          {this.renderSelectedFile()}
          <View style={{flex:1,}}/>
          {this.renderPathSelect()}
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
                <Text style={{textAlign:'center', paddingTop:'30%', fontSize:24}}> ... </Text>
              </CustomButton>
          </View>
          <View style={{flex:6, marginRight:'5%', marginLeft:'5%', marginBottom:'15%', backgroundColor:'#C8DDF1'}}>
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