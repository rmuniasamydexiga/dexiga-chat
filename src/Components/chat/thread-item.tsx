import {FC, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import dynamicStyles from '../../Screens/Viewer/Chat/styles';
import ThreadMediaItem from './thread-media-item';
import {dayFormatwithUnix} from '../../chat-services/DayHelper';
import {
  CHAT_OPTIONS,
  MESSAGE_TYPE,
  WIDTH,
} from '../../Constant/Constant';
import {checkFileOrDirectoryExists} from '../../chat-services/MediaHelper';
import {getFizeInUint, showLog} from '../../chat-services/common';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {useSelector} from 'react-redux';
import {selectAudioDuration} from '../../redux/chatSlice';
import React from 'react';
import { useStylesheet, VectorIcon } from 'react-native-dex-moblibs';

interface props {
  item: any;
  user: any;
  outBound: boolean;
  onChatMediaPress: (obj: any) => void;
  onSenderProfilePicturePress: (item: any) => void;
  onMessageLongPress: (item: any) => void;
  uploadProgress: any;

  pauseAudio: () => void;
  messageUnSelect: (item: any) => void;
  audioDetails: any;
  isHeaderChage: boolean;
  messageSelectionList: any[];
  fileList: any;
  internalFileList: any;
  is_group: boolean;
  fromComponet: string;
  sharedKey: string;
}

const assets = {
  boederImgSend: require('../../Assets/Images/borderImg1.png'),
  boederImgReceive: require('../../Assets/Images/borderImg2.png'),
  textBoederImgSend: require('../../Assets/Images/textBorderImg1.png'),
  textBoederImgReceive: require('../../Assets/Images/textBorderImg2.png'),
  reply: require('../../Assets/Images/reply-icon.png'),
};

const ThreadItem: FC<props> = props => {
  const {
    item,
    user,
    outBound,
    onChatMediaPress,
    onSenderProfilePicturePress,
    onMessageLongPress,
    uploadProgress,
    audioDetails,
    isHeaderChage,
    messageUnSelect,
    messageSelectionList,
    fileList,
    internalFileList,
    is_group,
    sharedKey,
  } = props;

  const styles = dynamicStyles(null);

const {theme} = useStylesheet();
  // console.log('Chat item data--', JSON.stringify(internalFileList));
  const [senderProfilePictureURL, setSenderProfilePictureURL] = useState(
    item.senderProfilePictureURL,
  );
  const videoRef = useRef<any>(null);
  const imagePath = useRef();
  const duration = useSelector(selectAudioDuration);
  const updateItemImagePath = (path: any) => {
    imagePath.current = path;
  };
  const isAudio =
    item.url && item.url.mime && item.url.mime.startsWith('audio');

  const didPressMediaChat = () => {
    const newLegacyItemURl = imagePath.current;
    const newItemURl = {...item.url, url: imagePath.current};
    let ItemUrlToUse;
    if (!item.url.url) {
      ItemUrlToUse = newLegacyItemURl;
    } else {
      ItemUrlToUse = newItemURl;
    }

    if (
      item?.messageType !== MESSAGE_TYPE.TEXT ||
      messageSelectionList.length !== 0
    ) {
      onChatMediaPress(item);
    }
  };

  const renderTextBoederImg = () => {
    if (outBound) {
      return (
        <Image
          source={assets.textBoederImgSend}
          style={styles.textBoederImgSend}
        />
      );
    }

    if (!outBound) {
      return (
        <Image
          source={assets.textBoederImgReceive}
          style={styles.textBoederImgReceive}
        />
      );
    }
  };

  const renderBoederImg = () => {
    if (isAudio) {
      return renderTextBoederImg();
    }
    if (outBound) {
      return (
        <Image source={assets.boederImgSend} style={styles.boederImgSend} />
      );
    }

    if (!outBound) {
      return (
        <Image
          source={assets.boederImgReceive}
          style={styles.boederImgReceive}
        />
      );
    }
  };

  const renderInReplyToIfNeeded = (
    item: {inReplyToItem: any; senderFirstName: any; senderLastName: any},
    isMine: boolean,
  ) => {
    const inReplyToItem = item.inReplyToItem;
    if (
      inReplyToItem &&
      inReplyToItem.content &&
      inReplyToItem.content.length > 0
    ) {
      return (
        <View
          style={
            isMine
              ? styles.inReplyToItemContainerView
              : styles.inReplyToTheirItemContainerView
          }>
          <View style={styles.inReplyToItemHeaderView}>
            <Image style={styles.inReplyToIcon} source={assets.reply} />
            <Text style={styles.inReplyToHeaderText}>
              {isMine
                ? 'You replied to ' +
                  (inReplyToItem.senderFirstName ||
                    inReplyToItem.senderLastName)
                : (item.senderFirstName || item.senderLastName) +
                  ' replied to ' +
                  (inReplyToItem.senderFirstName ||
                    inReplyToItem.senderLastName)}
            </Text>
          </View>
          <View style={styles.inReplyToItemBubbleView}>
            <Text style={styles.inReplyToItemBubbleText}>
              {item.inReplyToItem.content.slice(0, 50)}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  const handleOnLongPress = () => {
    onMessageLongPress(item);
  };

  const getIsSelection = () => {
    return (
      isHeaderChage &&
      messageSelectionList.find((ele: {id: any}) => ele.id === item.id)
    );
  };
  const getIsMessageHide = (deletedBy: any) => {
    let isHide = false;
    if (deletedBy) {
      let deletedUserList = deletedBy.split('~');
      isHide = !!deletedUserList.find((ele: any) => ele === user.id);
    }
    return isHide;
  };

  return (
    <TouchableWithoutFeedback onLongPress={handleOnLongPress}>
      {(item.isBlocked && item.blockedBy === user.userID) ||
      (item.isDeleted &&
        (item.deletedBy === user.userID ||
          item.deletedBy === CHAT_OPTIONS.BOTH ||
          getIsMessageHide(item.deletedBy))) ? (
        <></>
      ) : (
        <TouchableOpacity
          disabled={!isHeaderChage}
          onPress={() => messageUnSelect(item)}
          style={[
            outBound ? styles.sendItemContainer : styles.receiveItemContainer,
            getIsSelection()
              ? {backgroundColor: '#e8eafa', borderRadius: 10}
              : {},
          ]}>
          {item.url != null &&
            item.url != '' &&
            (item?.isAudio ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  backgroundColor: getIsSelection()
                    ? '#e8eafa'
                    : outBound
                    ? theme.colors.primary
                    : theme.colors.secondary,
                  width: WIDTH - 100,
                  height: !outBound && is_group ? 80 : 60,
                  borderRadius: 10,
                }}>
                <View style={{flex: !outBound && is_group ? 0.3 : 0.15}}>
                  {!outBound && is_group && (
                    <Text
                      style={{
                        fontSize: theme.typography.subSubTitle,
                        fontFamily: theme.fonts.bold,
                        color: theme.colors.primary,
                        marginLeft: 5,
                      }}>
                      {item?.senderFirstName}
                    </Text>
                  )}
                </View>
                <View style={{flex: !outBound && is_group ? 0.34 : 0.4}}>
                  <TouchableOpacity
                    onLongPress={handleOnLongPress}
                    onPress={didPressMediaChat}
                    style={{
                      flex: 1,
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}>
                    {audioDetails?.isPlaying &&
                    audioDetails.url === item.url ? (
                      <VectorIcon type='Ionicons' name="pause" style={{}} size={25} color={theme.colors.white} />
                    ) : item.url.startsWith('file') ? (
                      <AnimatedCircularProgress
                        size={30}
                        width={3}
                        fill={uploadProgress}
                        tintColor="#00e0ff"
                        onAnimationComplete={() =>
                          showLog('onAnimationComplete', 'Test')
                        }
                        backgroundColor="#3d5875"
                      />
                    ) : checkFileOrDirectoryExists(internalFileList, item) &&
                      !outBound ? (
                      <View
                        style={{
                          marginLeft: 10,
                          alignItems: 'center',
                          height: 35,
                          width: 35,
                          borderRadius: 35,
                          borderWidth: 0.5,
                        }}>
                        <VectorIcon
                        type='Octicons'
                          name="download"
                          style={{marginTop: 5, fontWeight: 'bold'}}
                          size={20}
                          color={'white'}
                        />
                      </View>
                    ) : (
                      <VectorIcon type='Ionicons' name="play" size={25} color={theme.colors.white} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={{flex: !outBound && is_group ? 0.33 : 0.4}}>
                  <Text
                    style={{
                      fontSize:theme.typography.label,
                      alignSelf: 'flex-start',
                      color: theme.colors.text,
                      fontFamily: theme.fonts.regular,
                      marginTop: 10,
                      marginLeft: 10,
                    }}>
                    {checkFileOrDirectoryExists(internalFileList, item) &&
                    !outBound
                      ? getFizeInUint(item.fileSize)
                      : audioDetails?.isPlaying
                      ? duration || item.duration
                      : item.duration}
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.typography.label,
                      alignSelf: 'flex-end',
                      color: theme.colors.text,
                      fontFamily: theme.fonts.regular,
                      marginTop: -15,
                      marginRight: 10,
                    }}>
                    {dayFormatwithUnix(item?.created, 'HH:MM')}
                  </Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onLongPress={handleOnLongPress}
                onPress={didPressMediaChat}
                activeOpacity={0.9}
                style={[
                  styles.itemContent,
                  outBound ? styles.sendItemContent : styles.receiveItemContent,
                  {padding: 0, marginRight: 0},
                ]}>
                <ThreadMediaItem
                  uploadProgress={uploadProgress}
                  outBound={outBound}
                  is_group={is_group}
                  isShowDownLoad={checkFileOrDirectoryExists(
                    outBound || item.messageType === MESSAGE_TYPE.DOCUMENT
                      ? internalFileList
                      : fileList,
                    item,
                  )}
                  updateItemImagePath={updateItemImagePath}
                  videoRef={videoRef}
                  dynamicStyles={styles}
                  item={item}
                />

                {renderBoederImg()}
              </TouchableOpacity>
            ))}
          {!item.url && (
            <View style={styles.myMessageBubbleContainerView}>
              {renderInReplyToIfNeeded(item, true)}
              <TouchableOpacity
                style={[
                  styles.itemContent,
                  outBound ? styles.sendItemContent : styles.receiveItemContent,
                ]}
                onLongPress={handleOnLongPress}
                onPress={didPressMediaChat}
                activeOpacity={0.9}>
                {!outBound && is_group && (
                  <Text
                    style={{
                      fontSize: theme.typography.subSubTitle,
                      fontFamily: theme.fonts.bold,
                      color: theme.colors.primary,
                    }}>
                    {item.senderFirstName}
                  </Text>
                )}

                <Text style={styles.sendTextMessage}>
                  {
                    item.content
                    // decrypt(item.content,sharedKey)
                  }
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.label,
                    alignSelf: 'flex-end',
                    fontFamily: theme.fonts.regular,
                    color: theme.colors.textInverse,
                  }}>
                  {item?.created
                    ? dayFormatwithUnix(item?.created, 'HH:MM')
                    : ''}
                </Text>

                {renderTextBoederImg()}
              </TouchableOpacity>
            </View>
          )}
          {is_group && (
            <TouchableOpacity
              onPress={() =>
                onSenderProfilePicturePress && onSenderProfilePicturePress(item)
              }>
              <FastImage
                style={outBound ? styles.userIcon : styles.userIconReciever}
                source={
                  senderProfilePictureURL
                    ? {uri: senderProfilePictureURL}
                    : require('../../Assets/Images/user.png')
                }
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )}
    </TouchableWithoutFeedback>
  );
};

export default ThreadItem;
