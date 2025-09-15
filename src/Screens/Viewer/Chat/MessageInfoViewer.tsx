import React from 'react';
import { View, Text,FlatList,Image,TouchableOpacity} from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import chatStyles from '../../Style/ChatListStyle';
import { verticalScale } from '../../../Constant/Metrics';
import { WIDTH } from '../../../Constant/Constant';
import ThreadItem from '../../../Components/chat/thread-item';
import { dayDate } from '../../../chat-services/DayHelper';
import { getNameWithList } from '../../../chat-services/common';
import { PageContainer } from '../../../../libs/moblibs/lib/module';
import { useStylesheet, VectorIcon } from 'react-native-dex-moblibs';

interface User {
  name: string;
  email: string;
}

interface IPlayerListViewer {
  mode: string;
  message:any
  user: any;
  fileList:any
  internalFileList:any
  channel:any
  groupParticiants:any
  onFriendItemPress:(item: any)=>void
  navigationBack:()=>void
  allUser:any
}


const MessageInfoViewer: React.FC <IPlayerListViewer>= (props) => {


  const styles =chatStyles()
const {theme}=useStylesheet()
  const {message,user,internalFileList,fileList,navigationBack,channel,groupParticiants,allUser}=props

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
            onPress={() => onFriendItemPress(item)}
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
      source={require("../../../Assets/Images/user.png")
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
                      {getNameWithList(item.receiverId,allUser?.completeData)}
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
                <VectorIcon name={'arrow-back-ios-new'} size={30} onPress={()=>navigationBack()} type='MaterialIcons' />
                </View>
                <View style={{flex:0.75}}>
                <Text style={{fontFamily:theme.fonts.bold,fontSize:theme.typography.subSubTitle,color:theme.colors.text}}>Message Info </Text>
                </View>
             </View>
          
      <ThreadItem
        outBound={message?.senderID === user?.id}
        item={message||{}}
        fromComponet={"MessageInfo"}
        internalFileList={internalFileList}
        fileList={fileList}
        is_group={false}
        uploadProgress={null}
        key={'chatitem' + message?.createdAt + message?.senderID}
        user={{ ...user, userID: user?.id }}
        isHeaderChage={false}
        messageSelectionList={[]}
        onChatMediaPress={(data) =>{}}
        onSenderProfilePicturePress={() => {}}
        onMessageLongPress={(item) =>{}}
        pauseAudio={() =>{}}
        messageUnSelect={(item) => {}}
        audioDetails={null}
      />
    

     <View style={{height:verticalScale(200),width:WIDTH-20,alignSelf:'center' }}>
  
     {/* Today,15.48 */}
     <Messagestatus
      title={'Delivery'}
      isGroupOrBoardCast={channel?.participants?.[0]?.is_group||channel?.participants?.[0]?.is_broadCast}
      tickColor={theme.colors.primary}
      messageListeners={message?.messageListeners?.filter((ele: { messageStatus: string; })=>ele?.messageStatus==="2")}
      time={dayDate(message?.deliveryDate)}
     />
        <Messagestatus
     messageListeners={message?.messageListeners?.filter((ele: { messageStatus: string; })=>ele?.messageStatus==="3")}
     title={'Read'}
     tickColor={theme.colors.borderColor}
     isGroupOrBoardCast={channel?.participants?.[0]?.is_group||channel?.participants?.[0]?.is_broadCast}

     time={dayDate(message?.seenDate)}
     />

     </View>
     </PageContainer>
   
  );
};

export default MessageInfoViewer;

