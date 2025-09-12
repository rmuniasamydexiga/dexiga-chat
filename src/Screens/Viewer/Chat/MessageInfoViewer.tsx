import React from 'react';
import { View, Text,FlatList,Image,TouchableOpacity,Alert, SafeAreaView} from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { GetTheme } from '../../../Constant/Colors';
import chatStyles from '../../Style/ChatListStyle';
import { FONTS } from '../../../Constant/Fonts';
import { verticalScale } from '../../../Constant/Metrics';
import { WIDTH } from '../../../Constant/Constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { font_size } from '../../../Helper/Helpers';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ThreadItem from '../../../Components/chat/ThreadItem';
import { dayDate } from '../../../Helper/DayHelper';
import { getNameWithList } from '../../../Helper/common';

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
  const theme=GetTheme()
  const {message,user,internalFileList,fileList,navigationBack,channel,groupParticiants,allUser}=props

const Messagestatus=({title,time,tickColor,isGroupOrBoardCast,messageListeners}:any)=>{

return <View style={{borderBottomWidth:0.5,margin:10 }}>
<View style={{margin:10 ,flexDirection:'row'}}>
<Ionicons name={'checkmark-done-outline'} color={tickColor} size={30}/>
<Text style={{marginLeft:10,fontSize:font_size(14),fontFamily:FONTS.OpenSans_Bold}}>{title}</Text>
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
                      style={{ fontFamily:FONTS.OpenSans_Bold, fontSize: 16, color: theme.text }}
                    >
                      {getNameWithList(item.receiverId,allUser?.completeData)}
                    </Text>
                  </Col>
                   
              
                </Row>
              
              </Col>
            </Grid>
            <Text style={{marginLeft:10,fontSize:font_size(14),fontFamily:FONTS.OpenSans_Bold}}>{dayDate(title==='Delivery'?item?.deliveryDate:item?.seenDate)
}</Text>

          </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
</>:
<Text style={{marginLeft:10,fontSize:font_size(14),fontFamily:FONTS.OpenSans_Bold}}>{time}</Text>
}
</View>
}
  return (
    <SafeAreaView
      style={[
        styles.container
      ]}
    >
             <View style={{flex:0.1,flexDirection:'row',alignItems:'center'}}>
                <View style={{flex:0.05}}/>
                <View style={{flex:0.2}}>
                <MaterialIcons name={'arrow-back-ios-new'} size={30} onPress={()=>navigationBack()} />
                </View>
                <View style={{flex:0.75}}>
                <Text style={{fontFamily:FONTS.OpenSans_Bold,fontSize:font_size(14),color:theme.text}}>Message Info </Text>
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
      tickColor={theme.headerTheme}
      messageListeners={message?.messageListeners?.filter((ele: { messageStatus: string; })=>ele?.messageStatus==="2")}
      time={dayDate(message?.deliveryDate)}
     />
        <Messagestatus
     messageListeners={message?.messageListeners?.filter((ele: { messageStatus: string; })=>ele?.messageStatus==="3")}
     title={'Read'}
     tickColor={theme.grey6}
     isGroupOrBoardCast={channel?.participants?.[0]?.is_group||channel?.participants?.[0]?.is_broadCast}

     time={dayDate(message?.seenDate)}
     />

     </View>
   
    </SafeAreaView>
  );
};

export default MessageInfoViewer;

