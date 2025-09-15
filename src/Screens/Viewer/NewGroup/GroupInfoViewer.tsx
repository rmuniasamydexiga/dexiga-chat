import React from 'react';
import {View, Text,  FlatList, Image, TouchableOpacity,Alert, ImageBackground} from 'react-native';
import HeaderFive from '../../../Components/Header/HeaderFive';
import { Col, Grid, Row } from 'react-native-easy-grid';
import ActionSheet from 'react-native-actionsheet';
import { CHAT_DETAILS_CONFIGURE, MESSAGE_TYPE, WIDTH } from '../../../Constant/Constant';
import { getFileUrlForInternal, getFileUrlForInternalReceiver } from '../../../chat-services/MediaHelper';
import { PageContainer, useStylesheet, VectorIcon } from 'react-native-dex-moblibs';

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
  navigateExitGroup:()=>void
  navigateMediaList:()=>void
  groupParticpantsList:any
  groupUserDetails:any
  mediaList:any
  documentList:any
  menuVisible:boolean
  onPressmenuVisible:()=>void
  onPressMenu:(data:string)=>void
  navigationMediaInfoPress:(data:any)=>void
 

  
}

const GroupInfoViewer: React.FC<IPlayerListViewer>=(props) => {
const{theme}=useStylesheet()

  const {
    groupPermissionData,
    selectedPermission,
    selecteandUnselect,
    navigationGoBack,
    groupUserActionSheetRef,
    onGroupSettingsActionDone,
    onFriendItemPress,
    navigatePermissions,
    navigstionBack,
    navigateExitGroup,
    channel,
    groupParticpantsList,
    users,
    isExit,
    selectedUser,
    groupUserDetails,
    mediaList,
    documentList,
    menuVisible,
    navigateMediaList,
    onPressmenuVisible,
    onPressMenu,
    navigationMediaInfoPress
}=props
  const getName=(data:any)=>{
    let name="name"
    if(data&&data.name){
        if(users.id===data.user){
            name="You"
        }else{
        name= data.name
        }
    }
    return name
  }
 
 

  return (
    <PageContainer>
          <HeaderFive 
      title={channel?.name} 
      subTitle={`Group ${groupParticpantsList.length} participants`}
      isHideDot={false}
      isHideSearch={true}
      onPress={()=>navigationGoBack()} 
      onPressmenuVisible={()=>onPressmenuVisible()}
      menuVisible={menuVisible} menuList={[CHAT_DETAILS_CONFIGURE.CHANGE_GROUP_NAME]} onPressMenu={(data)=>{
      
        onPressMenu(data)
   

      }
      } 
      onPressDeleteMessage={function (): void {
        throw new Error('Function not implemented.');
      } }
      ></HeaderFive>
      {groupUserDetails?.isAdmin&&groupUserDetails.isExit!==true?
      <View style={{height:60,margin:10,flexDirection:'row',backgroundColor:theme.colors.background,borderColor:'grey',borderRadius:10}}>
  <TouchableOpacity style={{flex:0.9,justifyContent:'center'}} onPress={()=>navigatePermissions()}>
  <Text style={{fontFamily:theme.fonts.regular,marginLeft:10}}>Group Permissions</Text>
  </TouchableOpacity>
  <View style={{flex:0.1,justifyContent:'center',}}>
    <VectorIcon name={'settings'} color={theme.colors.text} size={18} type='Feather'></VectorIcon>

    </View>
</View>:<></>}
{mediaList.length+documentList.length!==0&&<View style={{margin:10,backgroundColor:theme.colors.background,borderColor:'grey',borderRadius:10}}>
  <TouchableOpacity style={{ flexDirection:'row',height:30}} onPress={()=>navigateMediaList()}>
  <View style={{flex:0.9,justifyContent:'center'}} >
  <Text style={{fontFamily:theme.fonts.regular,marginLeft:10}}>Media and documents</Text>
  </View>
  <View style={{flex:0.1,justifyContent:'center'}}>
    <View style={{flexDirection:'row'}}>
    <Text>{mediaList.length+documentList.length}</Text>
    <VectorIcon size={18} name={"right"} color={theme.colors.text} type='AntDesign'/>
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
<View style={{flex:1,backgroundColor:theme.colors.background,margin:10,borderRadius:10}}>
  <Text style={{margin:10,fontSize:theme.typography.title,fontFamily:theme.fonts.bold}}>{`${groupParticpantsList.length} Participants`}</Text>
  <FlatList
        data={
          groupUserDetails?.isAdmin||(channel?.participants?.[0]?.is_user_add&&groupUserDetails?.isExit!==true)?
          [{name:'Add Participants'},...groupParticpantsList]:
          [...groupParticpantsList]

        }
        renderItem={({ item, index }) => {
          return (item.isExit?<></>:
            <TouchableOpacity
            style={{ height: 80 }}
            disabled={item.user===groupUserDetails?.user&&item.isAdmin===true}
            onPress={() => onFriendItemPress(item)}
          >
            <Grid style={{ maxHeight: 80 }}>
              <Col
                style={{ width: 80, alignItems: "center", justifyContent: "center" }}
              >
                 <Image
      style={{
        width: 65,
        height: 65,
        borderRadius: 65,
      }}
      source={require("../../../Assets/Images/user.png")
      }
      resizeMode="cover"
    />
              </Col>
              <Col style={{ marginLeft: 10 }}>
                <Row style={{ alignItems: "center" }}>
                  <Col>
                    <Text
                      style={{ fontFamily:theme.fonts.bold, fontSize: theme.typography.title, color: theme.colors.text }}
                    >
                      {getName(item)}
                    </Text>
                    {item.isAdmin&&<Text style={{ fontFamily:theme.fonts.bold, fontSize: theme.typography.label, color:'green'}}>Admin</Text>}
                  </Col>
                   
              
                </Row>
              
              </Col>
            </Grid>
            <ActionSheet
       ref={groupUserActionSheetRef}
       title={'Group Settings'}
       options={
    //     selectedUser?.isAdmin?       
    //    [
    //    'Remove',
    //    "cancel"
    //   ]
    //   : 
    groupUserDetails?.isAdmin?
    [
        'Message'+" "+selectedUser?.name,
        selectedUser?.isAdmin?"Remove Group Admin":'Make Group admin',
       'Remove'+" "+selectedUser?.name,
       "cancel"
      ]: [
        'Message'+" "+selectedUser?.name,
       "cancel"
      ]
    }
       cancelButtonIndex={groupUserDetails?.isAdmin?3:1}
       destructiveButtonIndex={1}
       onPress={onGroupSettingsActionDone}
     />
          </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
      </View>
   
      <View style={{height:60,flexDirection:'row',backgroundColor:theme.colors.background,margin:10,borderRadius:10}}>
      <View style={{flex:0.2,justifyContent:'center',marginLeft:10}}>
    <VectorIcon size={30} color={'red'} name={isExit?"delete":"exit-to-app"} type='MaterialIcons'/>
    </View>
  <TouchableOpacity style={{flex:0.8,justifyContent:'center'}} onPress={()=>navigateExitGroup()}>
  <Text style={{fontFamily:theme.fonts.bold,marginLeft:10,color:'red',fontSize:theme.typography.title}}>{isExit?'delete group':'Exit group'}</Text>
  </TouchableOpacity>

</View>
    
    </PageContainer>
  );
};

export default GroupInfoViewer;

