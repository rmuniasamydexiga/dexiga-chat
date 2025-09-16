import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectChannelGroupParticipants, selectFlieList, selectInternalFlieList, selectUser, selectedChannelDetails } from '../../../redux/chatSlice';
import { getMessageInformation } from '../../../chat-firebase/channel';
import { useAuth } from '../../../Router/Context/Auth';
import { PageContainer,dayDate, useAssets, useStylesheet, VectorIcon, verticalScale,ThreadItem } from 'react-native-dex-moblibs';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { View, Text,FlatList,Image,TouchableOpacity} from 'react-native';
import { WIDTH } from '../../../Constant/Constant';
import { getNameWithList } from '../../../chat-services/common';


  
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
const {theme}=useStylesheet()
const {images}=useAssets()
      
 
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

   const Messagestatus=({title,time,tickColor,isGroupOrBoardCast,messageListeners}:any)=>{
   
   return <View style={{borderBottomWidth:0.5,margin:10 }}>
   <View style={{margin:10 ,flexDirection:'row'}}>
   <VectorIcon name={'checkmark-done-outline'} color={tickColor} size={30} type='Ionicons'/>
   <Text style={{marginLeft:10,fontSize:theme.typography.label,fontFamily:theme.fonts.bold}}>{title}</Text>
   </View>
   {isGroupOrBoardCast?
   <>
   <FlatList
           data={messageListeners}
           renderItem={({ item, index }) => {
             return (
               <TouchableOpacity
               style={{ height: 80 }}
               // onLongPress={()=>Alert.alert("loangPress")}
               onPress={() => {
   // onFriendItemPress(item)
   console.log("Pressed")
               }
              
               }
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
                         style={{ fontFamily:theme.fonts.bold, fontSize:theme.typography.subSubTitle, color: theme.colors.text }}
                       >
                         {getNameWithList(item.receiverId,usersSubscribe?.completeData)}
                       </Text>
                     </Col>
                      
                 
                   </Row>
                 
                 </Col>
               </Grid>
               <Text style={{marginLeft:10,fontSize:theme.typography.label,fontFamily:theme.fonts.bold}}>{dayDate(title==='Delivery'?item?.deliveryDate:item?.seenDate)
   }</Text>
   
             </TouchableOpacity>
             );
           }}
           keyExtractor={(item, index) => index.toString()}
         />
   </>:
   <Text style={{marginLeft:10,fontSize:theme.typography.label,fontFamily:theme.fonts.bold}}>{time}</Text>
   }
   </View>
   }
     return (
   <PageContainer>
             <View style={{flex:0.1,flexDirection:'row',alignItems:'center'}}>
                <View style={{flex:0.05}}/>
                <View style={{flex:0.2}}>
                <VectorIcon name={'arrow-back-ios-new'} size={30} onPress={()=>goNavigationBack()} type='MaterialIcons' />
                </View>
                <View style={{flex:0.75}}>
                <Text style={{fontFamily:theme.fonts.bold,fontSize:theme.typography.subSubTitle,color:theme.colors.text}}>Message Info </Text>
                </View>
             </View>
          
      <ThreadItem
              outBound={msg?.senderID === user?.id}
              item={msg || {}}
              fromComponet={"MessageInfo"}
              internalFileList={internalFileList}
              fileList={fileList}
              is_group={false}
              uploadProgress={null}
              key={'chatitem' + msg?.createdAt + msg?.senderID}
              user={{ ...user, userID: user?.id }}
              isHeaderChage={false}
              messageSelectionList={[]}
              onChatMediaPress={(data) => { } }
              onSenderProfilePicturePress={() => { } }
              onMessageLongPress={(item) => { } }
              pauseAudio={() => { } }
              messageUnSelect={(item) => { } }
              audioDetails={null} sharedKey={''}      />
    

     <View style={{height:verticalScale(200),width:WIDTH-20,alignSelf:'center' }}>
  
     {/* Today,15.48 */}
     <Messagestatus
      title={'Delivery'}
      isGroupOrBoardCast={channel?.participants?.[0]?.is_group||channel?.participants?.[0]?.is_broadCast}
      tickColor={theme.colors.primary}
      messageListeners={msg?.messageListeners?.filter((ele: { messageStatus: string; })=>ele?.messageStatus==="2")}
      time={dayDate(msg?.deliveryDate)}
     />
        <Messagestatus
     messageListeners={msg?.messageListeners?.filter((ele: { messageStatus: string; })=>ele?.messageStatus==="3")}
     title={'Read'}
     tickColor={theme.colors.borderColor}
     isGroupOrBoardCast={channel?.participants?.[0]?.is_group||channel?.participants?.[0]?.is_broadCast}

     time={dayDate(msg?.seenDate)}
     />

     </View>
     </PageContainer>
   
  );


 
};

export default MessageInfoController;


