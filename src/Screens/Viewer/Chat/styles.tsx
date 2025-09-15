import {StyleSheet, Dimensions} from 'react-native';
import {verticalScale} from '../../../Constant/Metrics';

import { WIDTH} from '../../../Constant/Constant';
import { useStylesheet } from 'react-native-dex-moblibs';

const WINDOW_WIDTH = Dimensions.get('window').width;

const dynamicStyles = (outBound: any) => {
const { theme } = useStylesheet();
  const chatBackgroundColor = theme.colors.background;
  const audioPlayPauseContainerSize = 24;
  const audioPlayIconSize = 15;

  return StyleSheet.create({
    safeAreaViewContainer: {
      backgroundColor: chatBackgroundColor,
      flex: 1,

      marginBottom: 5,
    },
    personalChatContainer: {
      backgroundColor: chatBackgroundColor,
      flex: 1,
    },
    //Bottom Input
    bottomContentContainer: {
      backgroundColor: chatBackgroundColor,
      // paddingBottom: 19,
      paddingBottom: 5,
    },
    inputContainer: {
      flex: 8,
      borderRadius: 20,
      backgroundColor:  theme.colors.inputText,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    },
    micIconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      backgroundColor: 'transparent',
    },
    inputBar: {
      justifyContent: 'center',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor:  theme.colors.borderColor,
      backgroundColor:  theme.colors.inputBackground,
      flexDirection: 'row',
    },
    progressBar: {
      borderRadius: 50, // Set the borderRadius to make it a circle
      height: '100%',
      backgroundColor:  theme.colors.background,
      // height: 3,
      // shadowColor: '#000',
      // width: 3,
    },
    inputIconContainer: {
      flex: 0.5,
    },
    inputIcon: {
      tintColor:  theme.colors.inputText,
      width: 25,
      height: 25,
    },
    micIcon: {
      tintColor: theme.colors.inputText,
      width: 17,
      height: 17,
    },
    input: {
      alignSelf: 'center',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 3,
      paddingRight: 20,
      width: '93%',
      fontSize: 16,
      lineHeight: 22,
      color:  theme.colors.inputText,
    },
    inReplyToView: {
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderColor,
      padding: 8,
      flex: 1,
      flexDirection: 'column',
    },
    replyingToHeaderText: {
      fontSize: 13,
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
      marginBottom: 4,
    },
    replyingToNameText: {
      fontFamily: theme.fonts.bold,
    },
    replyingToContentText: {
      fontSize: 12,
      color:  theme.colors.inputText,
      fontFamily: theme.fonts.regular,
    },
    replyingToCloseButton: {
      position: 'absolute',
      right: 0,
      top: 2,
    },
    replyingToCloseIcon: {
      width: 25,
      height: 25,
      tintColor:  theme.colors.borderColor,
    },
    // Message Thread
    messageThreadContainer: {
      margin: 6,
    },
    // Thread Item
    sendItemContainer: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      flexDirection: 'row',
      // marginBottom: 10,
      margin: 10,
    },
    itemContent: {
      padding: 10,
      backgroundColor:  theme.colors.inputText,
      borderRadius: 10,
    },
    sendItemContent: {
      marginRight: 9,
      backgroundColor: theme.colors.background,
    },
    mediaMessage: {
      width: 350,
      height: 250,
      borderRadius: 10,
    },
    boederImgSend: {
      position: 'absolute',
      width: WIDTH,
      height: 0,
      resizeMode: 'stretch',
      tintColor: chatBackgroundColor,
    },
    textBoederImgSend: {
      position: 'absolute',
      right: -5,
      bottom: 0,
      width: 20,
      height: 8,
      resizeMode: 'stretch',
      tintColor: theme.colors.secondary,
    },
    sendTextMessage: {
      fontSize: 16,
      fontFamily: theme.fonts.regular,
      color: theme.colors.textInverse,
    },
    userIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
    },
    userIconReciever: {
      width: 34,
      height: 34,
      marginLeft: -20,
      marginTop: -55,
      borderRadius: 17,
    },
    receiveItemContainer: {
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      flexDirection: 'row',
      marginBottom: 10,
    },
    receiveItemContent: {
      // marginLeft: 9,
      backgroundColor:  theme.colors.secondary,

      margin: 25,
    },
    boederImgReceive: {
      position: 'absolute',
      width: WIDTH,
      height: 0,
      resizeMode: 'stretch',
      tintColor: chatBackgroundColor,
    },
    receiveTextMessage: {
      color:  theme.colors.text,
      fontSize: 16,
    },
    textBoederImgReceive: {
      position: 'absolute',
      left: -5,
      bottom: 0,
      width: 20,
      height: 8,
      resizeMode: 'stretch',
      tintColor:  theme.colors.secondary
    },
    mediaVideoLoader: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    centerItem: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    playButton: {
      position: 'absolute',
      top: '40%',
      alignSelf: 'center',
      width: 38,
      height: 38,
      overflow: 'hidden',
    },
    myMessageBubbleContainerView: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      flexDirection: 'column',
      maxWidth: '80%',
    },
    theirMessageBubbleContainerView: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'column',
      maxWidth: '80%',
    },
    inReplyToItemContainerView: {
      overflow: 'hidden',
      flex: 1,
      marginBottom: -20,
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    inReplyToTheirItemContainerView: {
      overflow: 'hidden',
      flex: 1,
      marginBottom: -20,
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    inReplyToItemHeaderView: {
      flexDirection: 'row',
      marginTop: 15,
      marginRight: 10,
    },
    inReplyToIcon: {
      width: 12,
      height: 12,
      marginRight: 5,
      tintColor: theme.colors.borderColor,
      marginTop: 1,
      marginLeft: 10,
    },
    inReplyToHeaderText: {
      fontSize: 12,
      color: theme.colors.borderColor,
      fontFamily: theme.fonts.regular,
      marginBottom: 5,
    },
    inReplyToItemBubbleView: {
      borderRadius: 15,
      backgroundColor: theme.colors.borderColor,
      paddingBottom: 30,
      paddingLeft: 15,
      paddingRight: 10,
      paddingTop: 5,
      overflow: 'hidden',
      flex: 1,
    },
    inReplyToItemBubbleText: {
      color: theme.colors.borderColor,
      fontSize: 14,
      fontFamily: theme.fonts.regular,
    },
    // Bottom Audio Recorder
    recorderContainer: {
      backgroundColor: theme.colors.primary,
      flex: 1,
    },
    counterContainer: {
      flex: 8,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    counterText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    recorderButtonsContainer: {
      flex: 1.8,
      paddingHorizontal: 5,
      paddingBottom: 2,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    recorderButtonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    recorderControlButton: {
      backgroundColor: theme.colors.secondary,
      width: '96%',
      height: '90%',
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    butonAlternateColor: {
      backgroundColor: theme.colors.error,
    },
    recoderControlText: {
      fontSize: 16,
      color: theme.colors.white,
    },

    // Audio media thread item
    audioMediaThreadItemContainer: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'center',
      width: Math.floor(WINDOW_WIDTH * 0.46),
      padding: 9,
    },
    audioPlayPauseIconContainer: {
      flex: 2,
      justifyContent: 'center',
      zIndex: 9,
    },
    playPauseIconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: outBound
        ? theme.colors.borderColor
        : theme.colors.secondary,
      height: audioPlayPauseContainerSize,
      width: audioPlayPauseContainerSize,
      borderRadius: Math.floor(audioPlayPauseContainerSize / 2),
    },
    audioMeterContainer: {
      flex: 6.5,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    audioMeter: {
      width: '95%',
      height: 6,
      paddingLeft: 7,
    },
    audioMeterThumb: {
      width: 9,
      height: 9,
    },
    audioTimerContainer: {
      flex: 2.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    audioPlayIcon: {
      width: audioPlayIconSize,
      height: audioPlayIconSize,
      tintColor: outBound
        ? theme.colors.borderColor
        : theme.colors.secondary,
      // marginLeft: 2,
    },
    audioTimerCount: {
      color: outBound ? theme.colors.borderColor : theme.colors.secondary,
      fontSize: 12,
    },
  
    minimumAudioTrackTintColor: {
      color: outBound ? theme.colors.borderColor : theme.colors.secondary,
    },
    audioThumbTintColor: {
      color: outBound ? theme.colors.borderColor : theme.colors.secondary,
    },
    popupContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.darkSemiTransparent,
    },
    optionButton: {
      padding: 10,
      marginBottom: 10,
      backgroundColor: 'white',
      borderRadius: 8,
    },
    closeButton: {
      marginTop: 20,
      backgroundColor: 'lightgray',
      padding: 10,
      borderRadius: 8,
    },
    TypeMessageInput: {
      height: verticalScale(45),
      width: '95%',
      borderRadius: 30,
      backgroundColor: theme.colors.borderColor,
      flexDirection: 'row',
      alignSelf: 'center',
    },
    RecorderView: {
      height: verticalScale(45),
      width: '95%',
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignSelf: 'center',
    },
    RecorderViewTouchables: {
      height: '100%',
      justifyContent: 'center',
      width: '70%',
      alignItems: 'center',
    },
  });
};

export default dynamicStyles;
