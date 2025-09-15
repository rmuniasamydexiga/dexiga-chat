import React from 'react';
import {View, Text,  FlatList, Image, TouchableOpacity,Alert, ImageBackground} from 'react-native';
import { FONTS } from '../../../Constant/Fonts';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { CHAT_DETAILS_CONFIGURE, MESSAGE_TYPE, WIDTH } from '../../../Constant/Constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getFileUrlForInternal, getFileUrlForInternalReceiver } from '../../../chat-services/MediaHelper';
import HeaderSix from '../../../Components/Header/HeaderSix';
import { useStylesheet } from 'react-native-dex-moblibs';

interface User {
  name: string;
  email: string;
}

interface IPlayerListViewer {
  mode: string;
  users: any;
  selectedBroadCast:any[]
  onFriendItemPress:(item: any)=>void
  navigstionBack:()=>void
  contactOnNavigation:()=>void
  removeSelectedContact:(item:any)=>void
  title:string,
  groupSletecedUser:any
  groupPermissionData:any,
  selectedPermission:any
  selecteandUnselect:(data:string)=>void
  navigationGoBack:()=>void
  groupUserActionSheetRef:any
  onGroupSettingsActionDone:()=>void
  navigatePermissions:()=>void
  channel:any
  selectedUser:any
  isExit:boolean
  navigateBlockChat:(data: any)=>void

  groupParticpantsList:any
  groupUserDetails:any
  documentList:any
  mediaList:any
  navigateMediaList:()=>void
  navigationMediaInfoPress:(data:any)=>void
}

const IndividualChatInfoViewer: React.FC<IPlayerListViewer>=(props) => {
const {theme}=useStylesheet()

  const {

    navigationGoBack,
    groupUserActionSheetRef,
    onGroupSettingsActionDone,
    onFriendItemPress,
    navigatePermissions,
  
    navigateBlockChat,
    navigateMediaList,
    channel,
    groupParticpantsList,
    users,
    isExit,
    selectedUser,
    groupUserDetails,
    documentList,
    mediaList,
    navigationMediaInfoPress
}=props

 

  return (
    <View style={{flex:1,backgroundColor:'#faf9f7'}}>
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
    <AntDesign size={18} name={"right"}/>
    </View>
    </View>
    </TouchableOpacity>
    <FlatList
      horizontal={true}
        data={mediaList}
        renderItem={({ item, index }) => {
          return (
            item.messageType!==MESSAGE_TYPE.DOCUMENT&&
            <ImageBackground
            source={{ uri: item.senderID!==users?.id?getFileUrlForInternalReceiver(item):getFileUrlForInternal(item)}}

            
            style={{height:70,width:WIDTH/5,margin:10}}>
                            <TouchableOpacity style={{flex:1}} onPress={()=>navigationMediaInfoPress(item)}/>

            </ImageBackground>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
</View>}


   
      <View style={{height:60,flexDirection:'row',backgroundColor:theme.colors.background,margin:10,borderRadius:10}}>
      <View style={{flex:0.2,justifyContent:'center',marginLeft:10}}>
    <MaterialIcons size={30} color={'red'} name={"block"}></MaterialIcons>
    </View>
  <TouchableOpacity style={{flex:0.8,justifyContent:'center'}} onPress={()=>navigateBlockChat(channel?.participants?.[0]?.blockedBy===users.id?CHAT_DETAILS_CONFIGURE.UN_BLOCK:CHAT_DETAILS_CONFIGURE.BLOCK)}>
  <Text style={{fontFamily:theme.fonts.bold,marginLeft:10,color:'red',fontSize:20}}>{channel?.participants?.[0]?.blockedBy===users.id?`Unblock ${channel?.participants?.[0]?.name}`:`Block ${channel?.participants?.[0]?.name}`}</Text>
  </TouchableOpacity>

</View>
    
    </View>
  );
};

export default IndividualChatInfoViewer;

