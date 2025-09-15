import {  Alert, Platform, PermissionsAndroid } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectDocumentList, selectMediaList, selectUser, selectedChannelDetails } from '../../../redux/chatSlice';
import MediaListViewer from '../../Viewer/Chat/MediaListViewer';
import { SCREEN_NAMES } from '../../../Constant/ScreenName';
import { MESSAGE_TYPE } from '../../../Constant/Constant';
import { getFileViewer } from '../../../chat-services/MediaHelper';




  
const MediaListController: React.FC= () => {
const navigation=useNavigation()
const route=useRoute<any>()
const user=useSelector(selectUser)
const channel=useSelector(selectedChannelDetails)
const [activeTabIndex,setActiveTabIndex]=useState(0)
    const mediaList=useSelector(selectMediaList)  
    const documentList=useSelector(selectDocumentList)
 



   const goNavigationBack=()=>{
    navigation.goBack()
   }
return(
    <MediaListViewer
    users={user}
    channel={channel}
    mediaList={mediaList}
    documentList={documentList}
    activeTabIndex={activeTabIndex}
    navigstionBack={()=>navigation.goBack()}
    navigationToMediaList={(data)=>{
        if(data.messageType===MESSAGE_TYPE.DOCUMENT){
          getFileViewer(data)
        }else{
        navigation.navigate(SCREEN_NAMES.MEDIA_VIEWER,{data:data})
        }
    }}
    navigationTab={(data)=>setActiveTabIndex(data)}
        onPressCorner={() => checkPermission()}
        goNavigationBack={()=>goNavigationBack()}
          />

)
  
 
};

export default MediaListController;


