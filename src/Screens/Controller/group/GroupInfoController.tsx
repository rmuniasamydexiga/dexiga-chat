import React, { useEffect, useRef, useState } from 'react';
import { CHAT_DETAILS_CONFIGURE, ERROR_MESSAGE_CONTENT, GROUP_PERMISSIONS, MESSAGE_CONTENT } from '../../../Constant/Constant';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectChannelGroupParticipants, selectDocumentList, selectMediaList, selectUser, selectedChannelDetails, setChatChanneDetails, setParticipantsList, setPermssions } from '../../../redux/chatSlice';
import GroupInfoViewer from '../../Viewer/NewGroup/GroupInfoViewer';
import { SCREEN_NAMES } from '../../../Constant/ScreenName';
import { currentTimestamp, exitTheGroup, makeAdmin, onLeaveGroup, persistChannelParticipations, sendInfoMessage } from '../../../chat-firebase/channel';
import { channelManager } from '../../../chat-firebase';
import { useAuth } from '../../../Router/Context/Auth';
import { Alert } from 'react-native';




interface Props {
  user: any
}
interface User {
  name: string;
  email: string;
}

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
        navigation.navigate(SCREEN_NAMES.CHAT_LIST)
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

  const getUserInfo = (channel: any[]) => {
    if (channel) {
      return channel.find((ele: { user: any; }) => ele.user === users.id)
    } else {
      return {}
    }
  }

  const getUserIsAdmin = (channel: any[]) => {
   let channelUserDetails=getUserInfo(channel)
   return channelUserDetails.isAdmin||false
  }

  return (
    <GroupInfoViewer
      groupPermissionData={GROUP_PERMISSIONS}
      groupParticpantsList={groupParticpantsList}
      channel={channel}
      users={users}
      mediaList={mediaList}
      documentList={documentList}
      onPressMenu={(data)=>{
        setMenuVisible(false)
        if(data===CHAT_DETAILS_CONFIGURE.CHANGE_GROUP_NAME){
if(channel.is_edit||getUserIsAdmin(groupParticpantsList)){
  navigation.navigate(SCREEN_NAMES.GROUP_NAME_CHANGE)
}else{
  Alert.alert(ERROR_MESSAGE_CONTENT.GROUP_EDIT_PERMISSION_ERROR)
}
        }
      }}
      onPressmenuVisible={()=>{
setMenuVisible(!menuVisible)
      }}
      groupUserDetails={getUserInfo(groupParticpantsList)}
      isExit={getIsExitOrNot(groupParticpantsList)}
      selectedUser={selectedUser}
      menuVisible={menuVisible}
      // navigationMediaInfoPress={()=>{}}
       navigationMediaInfoPress={(data)=>navigation.navigate(SCREEN_NAMES.MEDIA_VIEWER,{data:data})}
      groupUserActionSheetRef={groupUserActionSheetRef}
      selectedPermission={selectedPermissions}
      navigateMediaList={()=>navigation.navigate(SCREEN_NAMES.MEDIA_LIST)}
      selecteandUnselect={(data) => selecteandUnselect(data)}
      navigationGoBack={() => navigation.goBack()}
      navigatePermissions={() => navigation.navigate(SCREEN_NAMES.ADD_NEW_GROUP_PERMISSIONS,{
        fromNavigation:SCREEN_NAMES.GROUP_INFO,
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
      ]})}
      onFriendItemPress={(data) => {
        SetSelectedUser(data)
        if (data?.name === 'Add Participants') {
          navigation.navigate(SCREEN_NAMES.ADD_NEW_GROUP, { formNavigation: SCREEN_NAMES.GROUP_INFO ,groupParticpantsList:groupParticpantsList})
        } else {
          groupUserActionSheetRef?.current?.show()
        }
      }
      }
      onGroupSettingsActionDone={(data: any) => {
        
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
         navigation.navigate(SCREEN_NAMES.CHAT);

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
      
         navigation.navigate(SCREEN_NAMES.CHAT);

        }
      }

      }}

      navigateExitGroup={() => navigateExitGroup()}



    />
  )


};

export default GroupInfoController;


