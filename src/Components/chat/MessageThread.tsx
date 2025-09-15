

import React, { FC } from "react";
import { FlatList, Text, View } from "react-native";
import dynamicStyles from "../../Screens/Viewer/Chat/styles";
import ThreadItem from "./ThreadItem";
import { IUser } from "../../Interfaces/Chat";
import { useSelector } from "react-redux";
import { selectedChannelDetails } from "../../redux/chatSlice";
import { MESSAGE_CONTENT, MESSAGE_TYPE, WIDTH } from "../../Constant/Constant";
import { useStylesheet } from "react-native-dex-moblibs";



interface props {
  title: string,
  onPress: () => void;
  thread: any,
  user: IUser,
  onChatMediaPress: (obj: any) => void,
  appStyles: any,
  onSenderProfilePicturePress: any,
  onMessageLongPress: (item: any) => void,

  pauseAudio: () => void
  messageUnSelect: (item: any) => void
  uploadProgress: any
  audioDetails: any
  isHeaderChage: boolean,
  messageSelectionList: any[]
  fileList: any
  internalFileList: any
  is_group:boolean,
  groupParticpantsList:any,
  sharedKey:string
}

const MessageThread: FC<props> = (props) => {
  const {
    thread,
    user,
    onChatMediaPress,
    onSenderProfilePicturePress,
    onMessageLongPress,
    isHeaderChage,
    pauseAudio,
    audioDetails,
    uploadProgress,
    fileList,
    internalFileList,
    groupParticpantsList,
    messageUnSelect,
    messageSelectionList,
    is_group,
    sharedKey
  } = props;
  const channel=useSelector(selectedChannelDetails)

  const styles = dynamicStyles(null);
  const {theme} = useStylesheet();

  const getIsMessageHideOrNot = (messageData:any) => {
    if (channel?.participants?.[0]?.is_group === true) {
      let findData = groupParticpantsList?.find((ele: { user: any; }) => ele.user === user.id)

    
      if (findData?.isExit&&findData.exitTime<messageData.created) {
    
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  const getInformationMessage = (messageData:any) => {
    if (channel?.participants?.[0]?.is_group === true) {
      let findData = groupParticpantsList?.find((ele: { user: any; }) => ele.user === messageData.actionId)
       if(messageData.content===MESSAGE_CONTENT.ADD){
        return `${messageData.actionId===user?.id?'You':findData?.name||''}  add a New group`
       }  if(messageData.content.startsWith(MESSAGE_CONTENT.GROUP_NAME_CHAGE)){
        return `${messageData.senderID===user?.id?'You':findData?.name||'d'} ${messageData.content}`
       }   else  if(messageData.content===MESSAGE_CONTENT.CREATE_GROUP){
        return `${messageData.senderID===user?.id?'You':findData?.name||''} Created group ${channel?.name}`
       } else  if(messageData.content===MESSAGE_CONTENT.LEFT){
        return `${messageData.actionId===user?.id?'You':findData?.name||''} Left`
       }  else  if(messageData.content===MESSAGE_CONTENT.REMOVE){
        let senderData = groupParticpantsList?.find((ele: { user: any; }) => ele.user === messageData.senderID)

        return `${messageData.senderID===user?.id?'You':senderData?.name} Removed ${findData?.id===user?.id?'You':findData?.name||''}`
       }  else{
        return messageData.content

       }
  }
}
  const renderChatItem = ({ item }: any) => {


    return (
      <>
      {getIsMessageHideOrNot(item)?<></>:
      item.messageType===MESSAGE_TYPE.INFORMATION?
      <View style={{height:30, flex:1,alignItems:'center',backgroundColor:theme.colors.borderColor,justifyContent:'center', margin:10,borderRadius:10}}>
      <Text style={{}}>{getInformationMessage(item)}</Text>
      </View>
      :
      <ThreadItem
        outBound={item.senderID === user?.id}
        item={item}
        sharedKey={sharedKey}
        internalFileList={internalFileList}
        fileList={fileList}
        is_group={is_group}
        uploadProgress={uploadProgress}
        key={'chatitem' + item.createdAt + item.senderID}
        user={{ ...user, userID: user?.id }}
        isHeaderChage={isHeaderChage}
        messageSelectionList={messageSelectionList}
        onChatMediaPress={(data) => onChatMediaPress(data)}
        onSenderProfilePicturePress={() => onSenderProfilePicturePress}
        onMessageLongPress={(item) => onMessageLongPress(item)}

        pauseAudio={() => pauseAudio()}
        messageUnSelect={(item) => messageUnSelect(item)}
        audioDetails={audioDetails} fromComponet={""}      />
    }
    
    </>
    )
  };

  return (
    <FlatList
      inverted={true}
      showsVerticalScrollIndicator={false}
      data={thread}
      renderItem={renderChatItem}
      keyExtractor={(item) => `${item.id}`}
      contentContainerStyle={styles.messageThreadContainer}
      removeClippedSubviews={true}
    />

  );

}

export default MessageThread