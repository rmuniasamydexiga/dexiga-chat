import React, {  useEffect, useState } from 'react';
import { GROUP_PERMISSIONS } from '../../chat-services/constant/constant';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {  selectGroupPermission, selectedChannelDetails, setChatChanneDetails, setPermssions } from '../../redux/chatSlice';
import { channelPermissionUpdate } from '../../chat-firebase/channel';
import { View, Text, FlatList,Switch, BackHandler} from 'react-native';
import {  HEIGHT } from '../../chat-services/constant/constant';

import {HeaderSeven, PageContainer, useStylesheet, VectorIcon } from 'react-native-dex-moblibs';

  
const GroupPermissionsController: React.FC= () => {
    const navigation=useNavigation()
    const route=useRoute()
    const channel = useSelector(selectedChannelDetails)
const selectedPermissions=useSelector(selectGroupPermission)
    const dispatch=useDispatch()
const {theme}=useStylesheet()

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

useFocusEffect(
  React.useCallback(() => {
    const backAction = () => {
      navigation.goBack()
      return true
   
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []),
);



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
  const PermissionComponet=({item}:any)=>{

  return  <View style={{flexDirection:'row',flex:1}}>
    <View style={{flexDirection:'row',flex:0.15,alignItems:'center',justifyContent:'center',backgroundColor:theme.colors.background}}>
       <VectorIcon name={item.icon} color={theme.colors.text} size={30} type='Entypo'></VectorIcon>
    </View>
    <View style={{flexDirection:'row',flex:0.65,alignItems:'center'}}>
        <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{fontFamily:theme.fonts.bold,color:theme.colors.text,fontSize:theme.typography.title}}>{item.title}</Text>
        <Text style={{fontFamily:theme.fonts.regular,color:theme.colors.text}}>{item.descriptions}</Text>
</View>

    </View>
    <View style={{flexDirection:'row',flex:0.2}}>
        <Switch 
     trackColor={{false: '#767577', true: theme.colors.primary}}
     thumbColor={theme.colors.secondary}
     ios_backgroundColor={theme.colors.background}
     onValueChange={()=>selecteandUnselect(item.icon)}
     value={!!selectedPermissions.find((ele: { type: any; is_select: boolean; })=>ele.type===item.icon&&ele.is_select===true)}
        />
    </View>


    </View>
  }
  return (
 <PageContainer>
        <HeaderSeven title={'Group Permissions'} 
        onPress={()=>{
    if(route?.params?.fromNavigation){
      navigationBackOption()
    }else{
    navigation.goBack()
    }
 
  }} 
          menuVisible={false}
           menuList={[]}
            subTitle={''} 
            onPressMenu={function (data: string): void {
              throw new Error('Function not implemented.');
          } } 
          onPressDeleteMessage={function (): void {
              throw new Error('Function not implemented.');
          } }></HeaderSeven>
  <Text style={{marginLeft:10,fontSize:theme.typography.title,fontFamily:theme.fonts.bold}}>Participant can :</Text>
  <FlatList
  data={GROUP_PERMISSIONS.PARTICIPANTS}
  renderItem={({ item }) => {
    return <View style={{height:HEIGHT/8,margin:10}}>
  
       <PermissionComponet
       item={item}
       />
    </View>
  }}
/>
<Text style={{marginLeft:10,fontSize:theme.typography.title,fontFamily:theme.fonts.bold}}>Admin can :</Text>

<FlatList
  data={GROUP_PERMISSIONS.ADMINS}
  renderItem={({ item }) => {
    return    <View style={{height:HEIGHT/10,margin:10}}>
  
    <PermissionComponet
    item={item}
    />
 </View>
  }}
/>
    
    </PageContainer>
  );


  
 
};

export default GroupPermissionsController;


