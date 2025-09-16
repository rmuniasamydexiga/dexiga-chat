import React from 'react';

import { MESSAGE_TYPE, WIDTH } from '../../../Constant/Constant';
import { getFileUrlForInternal, getFileUrlForInternalReceiver } from '../../../chat-services/MediaHelper';




interface IBroadCastInfoViewer {
  users: any;
  onFriendItemPress:(item: any)=>void
  navigationGoBack:()=>void
  channel:any
  isExit:boolean
  navigateExitGroup:()=>void

  groupParticpantsList:any
  groupUserDetails:any
  documentList:any
  mediaList:any
  navigateMediaList:()=>void,
  isLoading:boolean
  
}

const BroadCastInfoViewer: React.FC<IBroadCastInfoViewer>=(props) => {

  const {
    navigationGoBack,
    onFriendItemPress,
    navigateExitGroup,
    navigateMediaList,
    channel,
    groupParticpantsList,
    users,
    groupUserDetails,
    documentList,
    mediaList,
    isLoading
}=props
 
 
 


};

export default BroadCastInfoViewer;

