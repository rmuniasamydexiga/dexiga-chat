import React, { useEffect, useRef, useState } from 'react';
import { CHAT_DETAILS_CONFIGURE, ERROR_MESSAGE_CONTENT, GROUP_PERMISSIONS, MESSAGE_CONTENT } from '../../chat-services/constant/constant';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectChannelGroupParticipants, selectDocumentList, selectMediaList, selectUser, selectedChannelDetails, setChatChanneDetails, setParticipantsList, setPermssions } from '../../redux/chatSlice';
import { Paths } from '../../chat-services/constant/ScreenName';
import { currentTimestamp, exitTheGroup, makeAdmin, onLeaveGroup, persistChannelParticipations, sendInfoMessage } from '../../chat-firebase/channel';
import { channelManager } from '../../chat-firebase';
import { useAuth } from '../../chat-context/chat-auth';

import {View, Text,  FlatList, Image, TouchableOpacity, ImageBackground,Alert} from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import ActionSheet from 'react-native-actionsheet';
import {  MESSAGE_TYPE, WIDTH } from '../../chat-services/constant/constant';
import { getFileUrlForInternal, getFileUrlForInternalReceiver } from '../../chat-services/MediaHelper';
import {HeaderFive, PageContainer, useAssets, useStylesheet, VectorIcon } from 'react-native-dex-moblibs';





const GroupInfoController: React.FC = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route = useRoute<any>()
  const channel = useSelector(selectedChannelDetails)
  const users = useSelector(selectUser)
  const [selectedUser, SetSelectedUser] = useState(null)
  const groupParticpantsList = useSelector(selectChannelGroupParticipants)
  const { usersSubscribe } = useAuth()
const mediaList=useSelector(selectMediaList)
const documentList=useSelector(selectDocumentList)
  const groupUserActionSheetRef = useRef<any>()
  const [menuVisible,setMenuVisible]=useState(false)
    
    const getUserInfo = (channel: any[]) => {
    if (channel) {
      return channel.find((ele: { user: any; }) => ele.user === users.id)
    } else {
      return {}
    }
  }
    
    const getIsExitOrNot = (channel: any[]) => {
    if (channel) {
      let findData = channel.find((ele: { user: any; }) => ele.user === users.id)
      if (findData?.isExit) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }


  }

    const groupUserDetails=getUserInfo(groupParticpantsList)
    const  isExit=getIsExitOrNot(groupParticpantsList)

  const [selectedPermissions, setSelectedPerMissions] = useState([
    {
      type: 'edit',
      is_select: true
    },
    {
      type: 'message',
      is_select: true
    },
    {
      type: 'add-user',
      is_select: true
    },
    {
      type: 'user',
      is_select: true
    },
  ])

  const {images}=useAssets()
const{theme}=useStylesheet()

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
 
  const selecteandUnselect = (data: string) => {
    let selectedPermission = selectedPermissions

    let findIndexData = selectedPermission.findIndex(ele => ele.type === data)
    let tempData = selectedPermissions[findIndexData]
    selectedPermission.splice(findIndexData, 1, {
      type: data,
      is_select: !tempData.is_select


    })
    setSelectedPerMissions([...selectedPermission])
    dispatch(setPermssions(selectedPermission))

    
  }
  const getChannelParticipants = () => {
    channelManager.fetchChannelParticipantUsers(channel, (response) => {
      let particiants: { user: any; }[] = []
      response.map((ele: { user: any; }) => {
        if (ele?.user&&ele?.user!==true) {
          let findUser = usersSubscribe?.data.find((item: { id: any; }) => item.id === ele.user)
          if (findUser) {
            particiants.push({
              ...ele,
              ...findUser
            })

          } else {
            particiants.push({
              ...ele
            })

          }

        }

      })
      dispatch(setParticipantsList(particiants))

    })
  }

  useEffect(() => {
    if (route?.params?.groupSletecedUser) {
      persistChannelParticipation(route?.params?.groupSletecedUser)
    }

  }, [route])


  const persistChannelParticipation = async (groupSletecedUser: any[]) => {
    persistChannelParticipations(groupSletecedUser, channel.id).then(res => {
      if (res?.success) {
        getChannelParticipants()
      }
    })
  }
  const navigateExitGroup = async () => {
    if (getIsExitOrNot(groupParticpantsList)) {
      onLeaveGroup(channel.id, users?.id, (res) => {
        sendInfoMessage(users,channel,MESSAGE_CONTENT.REMOVE,null)
        getChannelParticipants()
        navigation.navigate(Paths.ChatList)
      })
    } else {
      let requestData:any={
        isExit:true
      }
      let findUserData = groupParticpantsList.find((ele: { user: any; }) => ele.user === users.userID)
      if (findUserData.isAdmin) {
        requestData={
          ...requestData,
          isAdmin:false,
          exitTime:currentTimestamp()

        }
      }

      exitTheGroup(channel.id, users,requestData, (res) => {
        sendInfoMessage(users,channel,MESSAGE_CONTENT.LEFT,null)

        if (res?.success) {
          let findUserData = groupParticpantsList.find((ele: { user: any; }) => ele.user === users.userID)
          if (findUserData.isAdmin) {
          
            let fileteGroupParticpantsList = groupParticpantsList.filter(ele => ele.user !== users.userID)
            fileteGroupParticpantsList.sort((a: { name: string; }, b: { name: string; }) => {
              let fa = a.name.toLowerCase(),
                fb = b.name.toLowerCase();

              if (fa < fb) {
                return -1;
              }
              if (fa > fb) {
                return 1;
              }
              return 0;
            });
            makeAdmin(channel.id, fileteGroupParticpantsList[0], (res) => {
            
              getChannelParticipants()
            })
          } else {
            getChannelParticipants()

          }

        }

      })
    }

  }

const  navigatePermissions=() => {
  navigation.navigate(Paths.AddNewGroupPermissions,{
        fromNavigation:Paths.GroupInfo,
        groupPermission:[
        {
          type: 'edit',
          is_select: channel?.participants?.[0]?.is_edit
        },
        {
          type: 'message',
          is_select:  channel?.participants?.[0]?.is_message
        },
        {
          type: 'add-user',
          is_select:  channel?.participants?.[0]?.is_user_add
        },
        {
          type: 'user',
          is_select:  channel?.participants?.[0]?.is_user_approved
        },
      ]})
    }


  const getUserIsAdmin = (channel: any[]) => {
   let channelUserDetails=getUserInfo(channel)
   return channelUserDetails.isAdmin||false
  }
  const  onGroupSettingsActionDone=
        (data: any) => {
        
        let getUserInfoDetails=getUserInfo(groupParticpantsList)
        if(getUserInfoDetails.isAdmin){
        if(data===0){

          const id1 :any= users.userID
          const id2 = selectedUser?.user
          if (id1 == id2) {
            return;
          }
    
          const channel = {
            id: id1 < id2 ? id1 + id2 : id2 + id1,
            name:selectedUser?.name,
            participants: [selectedUser],
          };
          dispatch(setChatChanneDetails(channel))
         navigation.navigate(Paths.Chat);

        } else if (data === 1) {
          makeAdmin(channel.id, selectedUser, (res) => {
            getChannelParticipants()
           
          })
        } else if (data === 2) {
          // onLeaveGroup(channel.id, selectedUser?.id, (res) => {

            let requestData: any = {
              isExit: true,
              exitTime:currentTimestamp()
            }
            exitTheGroup(channel.id,selectedUser,requestData,(res) => {
            sendInfoMessage(users,channel,MESSAGE_CONTENT.REMOVE,selectedUser)
            getChannelParticipants()
            
          })
        }
      }else{
        if(data===0){

          const id1 :any= users.userID
          const id2 = selectedUser?.user
          if (id1 == id2) {
            return;
          }
    
          const channel = {
            id: id1 < id2 ? id1 + id2 : id2 + id1,
            name:selectedUser?.name,
            participants: [selectedUser],
          };
     
          dispatch(setChatChanneDetails(channel))
      
         navigation.navigate(Paths.Chat);

        }
      }

      }
    
 return (
    <PageContainer>
         <HeaderFive 
      title={channel?.name} 
      subTitle={`Group ${groupParticpantsList.length} participants`}
      isHideDot={false}
      isHideSearch={true}
      onPress={()=>navigation.goBack()} 
      onPressmenuVisible={()=>setMenuVisible(!menuVisible)}
      menuVisible={menuVisible} menuList={[CHAT_DETAILS_CONFIGURE.CHANGE_GROUP_NAME]}
       onPressMenu={
      (data)=>{
        setMenuVisible(false)
        if(data===CHAT_DETAILS_CONFIGURE.CHANGE_GROUP_NAME){
if(channel.is_edit||getUserIsAdmin(groupParticpantsList)){
  navigation.navigate(Paths.GroupNameChange)
}else{
  Alert.alert(ERROR_MESSAGE_CONTENT.GROUP_EDIT_PERMISSION_ERROR)
}
        }
      }
      } 
     
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
  <TouchableOpacity style={{ flexDirection:'row',height:30}} onPress={()=>navigation.navigate(Paths.MediaList)}>
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
              <TouchableOpacity style={{flex:1}} onPress={()=>navigation.navigate(Paths.MediaViewer,{data:item})}/>
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
            onPress={ (daa) => {
        SetSelectedUser(item)
        if (item?.name === 'Add Participants') {
          navigation.navigate(Paths.AddNewGroup, { formNavigation: Paths.GroupInfo ,groupParticpantsList:groupParticpantsList})
        } else {
          groupUserActionSheetRef?.current?.show()
        }
      }}
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
      source={images['chat-user']
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

export default GroupInfoController;


