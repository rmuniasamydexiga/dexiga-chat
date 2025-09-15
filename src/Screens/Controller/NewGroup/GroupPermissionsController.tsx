import React, {  useEffect, useState } from 'react';
import { GROUP_PERMISSIONS } from '../../../Constant/Constant';
import GroupPermissionsViewer from '../../Viewer/NewGroup/GroupPermissionsViewer';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {  selectGroupPermission, selectedChannelDetails, setChatChanneDetails, setPermssions } from '../../../redux/chatSlice';
import { channelPermissionUpdate } from '../../../chat-firebase/channel';
import { BackHandler } from 'react-native';




interface Props {
  user:any
}
interface User {
    name: string;
    email: string;
  }
  
const GroupPermissionsController: React.FC= () => {
    const navigation=useNavigation()
    const route=useRoute()
    const channel = useSelector(selectedChannelDetails)
const selectedPermissions=useSelector(selectGroupPermission)
    const dispatch=useDispatch()

const selecteandUnselect=(data)=>{
    let selectedPermission=selectedPermissions
   
   let findIndexData= selectedPermission.findIndex(ele=>ele.type===data)
   let tempData=selectedPermissions[findIndexData]
   let fileteData= selectedPermission.filter(ele=>ele.type!==data)

   fileteData.push({
    type:data,
    is_select:!tempData.is_select
   })

   dispatch(setPermssions(fileteData))

}

// useFocusEffect(
//   React.useCallback(() => {
//     const backAction = () => {
//       navigationBackOption()
//       navigation.goBack()
//       return true
   
//     };
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction,
//     );

//     return () => backHandler.remove();
//   }, []),
// );



useEffect(() => {
  if(route?.params?.groupPermission){

    dispatch(setPermssions(route?.params?.groupPermission))

  }
}, [route]);
const navigationBackOption=async ()=>{
  let result:any=await channelPermissionUpdate(channel?.id,selectedPermissions)
  if(result?.success){
   let channels = {
     ...channel,
     participants: [{
       ...(channel?.participants?.[0] || {}), // Use the spread operator here
       ...result.data
     }
     ],
   };
    dispatch(setChatChanneDetails(channels))

  }


  

}
return(
  <GroupPermissionsViewer
  groupPermissionData={GROUP_PERMISSIONS}
  selectedPermission={selectedPermissions}
  selecteandUnselect={(data)=>selecteandUnselect(data)}
  navigationGoBack={async ()=>{
    if(route?.params?.fromNavigation){
      navigationBackOption()
     

    }
    navigation.goBack()
 
  }
  }


/>
)
  
 
};

export default GroupPermissionsController;


