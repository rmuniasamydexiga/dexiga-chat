import {  Alert, Platform, PermissionsAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import MediaViewingViewer from '../../Viewer/Chat/MediaViewingViewer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectChannelGroupParticipants, selectFlieList, selectInternalFlieList, selectUser, selectedChannelDetails } from '../../../Redux/chat/reducers';
import MessageInfoViewer from '../../Viewer/Chat/MessageInfoViewer';
import { getMessageInformation } from '../../../firebase/channel';
import { useAuth } from '../../../Router/Context/Auth';


  
const MessageInfoController: React.FC= () => {
const navigation=useNavigation()
const route=useRoute<any>()
const user=useSelector(selectUser)
const fileList = useSelector(selectFlieList);
const channel=useSelector(selectedChannelDetails)
const groupParticiants =useSelector(selectChannelGroupParticipants)
const  internalFileList=useSelector(selectInternalFlieList)
 const [msg,setMsg]=useState(null)
 const { usersSubscribe}=useAuth()

      
 
useEffect(()=>{

getMessageInfo(route?.params?.message)
},[])

const getMessageInfo=async (message:any)=>{
   let result:any=await getMessageInformation(channel?.id,message,channel?.participants?.[0]?.is_broadCast)
   if(channel?.participants?.[0]?.is_group){
      setMsg({
         ...route?.params?.message,
         messageListeners:result
      })

   }else if (channel?.participants?.[0]?.is_broadCast){
      setMsg({
         ...route?.params?.message,
         messageListeners:result
      })
   }else{
   setMsg({
      ...route?.params?.message,
      ...result[0]
   })
}
}

   const goNavigationBack=()=>{
    navigation.goBack()
   }
return(
    <MessageInfoViewer
    user={user}
    message={msg}
    allUser={usersSubscribe}
    channel={channel}
    groupParticiants={groupParticiants}
    fileList={fileList}
    navigationBack={()=>goNavigationBack()}
    internalFileList={internalFileList}
   
          />

)
  
 
};

export default MessageInfoController;


