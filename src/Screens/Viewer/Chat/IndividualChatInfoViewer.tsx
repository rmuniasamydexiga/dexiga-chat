import React from 'react';
import {View, Text,  FlatList, TouchableOpacity, ImageBackground} from 'react-native';

import { CHAT_DETAILS_CONFIGURE, MESSAGE_TYPE, WIDTH } from '../../../Constant/Constant';
import { getFileUrlForInternal, getFileUrlForInternalReceiver } from '../../../chat-services/MediaHelper';
import { PageContainer, useStylesheet, VectorIcon ,HeaderSix} from 'react-native-dex-moblibs';


interface IPlayerListViewer {
  users: any;
  navigationGoBack:()=>void
  channel:any
  navigateBlockChat:(data: any)=>void
  documentList:any
  mediaList:any
  navigateMediaList:()=>void
  navigationMediaInfoPress:(data:any)=>void
}

const IndividualChatInfoViewer: React.FC<IPlayerListViewer>=(props) => {
const {theme}=useStylesheet()

  const {
    navigationGoBack,
    navigateBlockChat,
    navigateMediaList,
    channel,
    users,
    documentList,
    mediaList,
    navigationMediaInfoPress
}=props

 

  return (
<PageContainer>
          <HeaderSix 
      title={channel?.name} 
      subTitle={``}
      isHideDot={true}
      isHideSearch={true}
      onPress={()=>navigationGoBack()} 
      menuVisible={false} menuList={[]} onPressMenu={function (data: string): void {
        throw new Error('Function not implemented.');
      } } 
      onPressDeleteMessage={function (): void {
        throw new Error('Function not implemented.');
      } }
      />
     {mediaList.length+documentList.length!==0&&<View style={{margin:10,backgroundColor:theme.colors.background,borderColor:'grey',borderRadius:10}}>
  <TouchableOpacity style={{ flexDirection:'row',height:30}} onPress={()=>navigateMediaList()}>
  <View style={{flex:0.9,justifyContent:'center'}} >
  <Text style={{fontFamily:theme.fonts.regular,marginLeft:10}}>Media and documents</Text>
  </View>
  <View style={{flex:0.1,justifyContent:'center'}}>
    <View style={{flexDirection:'row'}}>
    <Text>{mediaList.length+documentList.length}</Text>
    <VectorIcon size={18} name={"right"} color={theme.colors.text}/>
    </View>
    </View>
    </TouchableOpacity>
    <FlatList
      horizontal={true}
        data={mediaList}
        renderItem={({ item, index }) => {
          if (item.messageType !== MESSAGE_TYPE.DOCUMENT) {
            return (
              <ImageBackground
                source={{ uri: item.senderID !== users?.id ? getFileUrlForInternalReceiver(item) : getFileUrlForInternal(item) }}
                style={{ height: 70, width: WIDTH / 5, margin: 10 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => navigationMediaInfoPress(item)} />
              </ImageBackground>
            );
          }
          return null;
        }}
        keyExtractor={(item, index) => index.toString()}
      />
</View>}


   
      <View style={{height:60,flexDirection:'row',backgroundColor:theme.colors.background,margin:10,borderRadius:10}}>
      <View style={{flex:0.2,justifyContent:'center',marginLeft:10}}>
    <VectorIcon size={30} color={'red'} name={"block"} type='MaterialIcons'/>
    </View>
  <TouchableOpacity style={{flex:0.8,justifyContent:'center'}} onPress={()=>navigateBlockChat(channel?.participants?.[0]?.blockedBy===users.id?CHAT_DETAILS_CONFIGURE.UN_BLOCK:CHAT_DETAILS_CONFIGURE.BLOCK)}>
  <Text style={{fontFamily:theme.fonts.bold,marginLeft:10,color:theme.colors.error,fontSize:theme.typography.superText}}>{channel?.participants?.[0]?.blockedBy===users.id?`Unblock ${channel?.participants?.[0]?.name}`:`Block ${channel?.participants?.[0]?.name}`}</Text>
  </TouchableOpacity>

</View>
    
   </PageContainer>
  );
};

export default IndividualChatInfoViewer;

