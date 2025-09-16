import {  Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import {  useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import {  selectUser, selectedChannelDetails, setChatChanneDetails } from '../../../redux/chatSlice';
import {  sendInfoMessage, updateChannel } from '../../../chat-firebase/channel';
import { MESSAGE_CONTENT } from '../../../Constant/Constant';
import { View, TouchableOpacity, ImageBackground, TextInput, } from 'react-native';

import {HeaderSeven, Button, useAssets, useStylesheet, wp } from 'react-native-dex-moblibs';


const GroupNameChangeController: React.FC= () => {
  const channel=useSelector(selectedChannelDetails)
  const [groupName,setGroupName]=useState(channel?.name)
  const navigation=useNavigation<any>()
  const user=useSelector(selectUser)
  const dispatch=useDispatch()
  const {theme}=useStylesheet()
  const {images}=useAssets();

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




   return (
      <View style={{ flex: 1, backgroundColor: theme.colors.borderColor }}>
        <HeaderSeven title={'Enter the Group Name'}
          onPress={() => navigation.goBack()}
          menuVisible={false}
          menuList={[]}
          subTitle={''}
          onPressMenu={function (data: string): void {
            throw new Error('Function not implemented.');
          }}
          onPressDeleteMessage={function (): void {
            throw new Error('Function not implemented.');
          }} isMediaHeader={false} activeIndex={0} navigationTab={function (indexValue: any): void {
            throw new Error('Function not implemented.');
          }}></HeaderSeven>
        <View style={{ flex: 0.15, margin: 10 }}>
          <TouchableOpacity style={{ flexDirection: 'row' }} >
            <View style={{ flex: 0.15 }}>
              <ImageBackground
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 45,
                }}
                source={images['chat-user']}
                
                resizeMode="cover"
              />
              
            </View>
            <View style={{ flex: 0.7 }}>
              <TextInput
                value={groupName}
                onChangeText={(text) => setGroupName(text)}
                style={{ borderBottomWidth: 2, borderColor: theme.colors.primary, fontFamily: theme.fonts.regular }}
                placeholder={'Enter the Group Name'}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', marginTop: 10, flexDirection: 'row' }}>
          <View style={{ marginHorizontal: 10 }}>
              <Button
                    title={'OK'}
                    style={{ width: wp('90%') }}
                    onPress={updateGroup}
                  />
          </View>
          <View style={{ marginHorizontal: 10 }}>
             <Button
                    title={'OK'}
                    style={{ width: wp('90%') }}
                    onPress={()=>navigation.goBack()}
                  />
          </View>
        </View>
      </View>
    ); 
};

export default GroupNameChangeController;


