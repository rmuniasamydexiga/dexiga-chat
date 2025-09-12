import {  Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import {  useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { SCREEN_NAMES } from '../../../Constant/ScreenName';
import { selectGroupPermission, selectUser, selectedChannelDetails, setChatChanneDetails } from '../../../Redux/chat/reducers';
import {  sendInfoMessage, updateChannel } from '../../../firebase/channel';
import GroupChangeViewer from '../../Viewer/NewGroup/GroupNameChangeViewer';
import { MESSAGE_CONTENT } from '../../../Constant/Constant';



const GroupNameChangeController: React.FC= () => {
  const channel=useSelector(selectedChannelDetails)
  const [groupName,setGroupName]=useState(channel?.name)
  const navigation=useNavigation<any>()
  const user=useSelector(selectUser)
  const dispatch=useDispatch()

  const updateGroup=async ()=>{
    
  if(groupName?.trim()===""){
Alert.alert("Kindly Enter Group Name")
  }else{
  let result=await  updateChannel(channel.id,{name:groupName})
  await sendInfoMessage(user,channel,MESSAGE_CONTENT.GROUP_NAME_CHAGE +' '+channel.name +' to '+groupName,null)
  dispatch(setChatChanneDetails({
    ...channel,
    name:groupName
  }))
  navigation.goBack()
  
    
    
  }
  } 




return(
  <GroupChangeViewer
  groupName={groupName}
  navigationGoback={()=>navigation.goBack()}
  setgroupName={(data)=>setGroupName(data)}
  updateGroup={()=>updateGroup()}
 

/>
)
  
 
};

export default GroupNameChangeController;


