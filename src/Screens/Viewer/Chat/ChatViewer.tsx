import React, {useRef} from 'react';
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import dynamicStyles from './styles';
import MessageThread from '../../../Components/chat/MessageThread';
import BottomInput from '../../../Components/chat/BottomInput';
import ActionSheet from 'react-native-actionsheet';
import HeaderOne from '../../../Components/Header/HeaderOne';
import HeaderThree from '../../../Components/Header/HeaderThree';

import {
  ERROR_MESSAGE_CONTENT,
  IS_IOS,
  MESSAGE_TYPE,
  WIDTH,
} from '../../../Constant/Constant';
import { PageContainer } from 'react-native-dex-moblibs';

interface IChatViewer {
  disPlayName: string;
  inputValue: string;
  user: any;
  uploadProgress: any;
  inReplyToItem: any;
  thread: any[];
  menuList: string[];
  onSendInput: () => void;
  onChatMediaPress: (obj: any) => void;
  onChangeTextInput: (item: string) => void;
  onOpenPhotos: () => void;
  groupSettingsActionSheetRef: any;
  privateSettingsActionSheetRef: any;
  showRenameDialog: (item: boolean) => void;
  onLeave: () => void;
  appStyles: any;
  onUserBlockPress: () => void;
  onUserReportPress: () => void;
  onSenderProfilePicturePress: () => void;
  onReplyActionPress: (item: any) => void;
  onReplyingToDismiss: () => void;
  onLaunchCameraVideo: () => void;
  onLaunchCameraPhoto: () => void;
  navigationGOBack: () => void;
  onAddMediaPress: (message: string) => void;
  onLaunchCamera: (item: any) => void;
  isMediaViewerOpen: any;

  onMediaClose: () => void;
  isRenameDialogVisible: any;
  onChangeName: () => void;
  recorderDetails: {
    recordSecs: number;
    recordTime: number | undefined;
    isRecording: boolean;
    isAudio: boolean;
    firebasePath: string;
  };
  isHeaderChage: boolean;
  startRecord: () => void;
  stopRecord: (type: string) => void;

  pauseAudio: () => void;
  audioDetails: any;
  menuVisible: boolean;
  onPressMenu: (data: string) => void;
  onPressDeleteMessage: () => void;
  onMessageLongPress: (data: any) => void;
  selectedMessage: any[];
  fileList: any;
  internalFileList: any;
  onLaunchDocument: () => void;
  channel: any;
  navigationTitlePress: () => void;
  isTitleBtnDisable: boolean;
  isInPutHide: boolean;
  inputHideMessage: string;
  is_group: boolean;
  groupParticpantsList: any[];
  sharedKey: string;
}

const ChatViewer: React.FC<IChatViewer> = props => {
  const {
    disPlayName,
    onSendInput,
    thread,
  inputValue,
    onChangeTextInput,
    user,
    inReplyToItem,
    onOpenPhotos,
    uploadProgress,
    onChatMediaPress,
    groupSettingsActionSheetRef,
    privateSettingsActionSheetRef,
    showRenameDialog,
    onLeave,
    appStyles,
    onUserBlockPress,
    onSenderProfilePicturePress,
    onReplyActionPress,
    onReplyingToDismiss,
    onLaunchCameraVideo,
    onLaunchCameraPhoto,
    navigationGOBack,
    recorderDetails,
    startRecord,
    stopRecord,
    pauseAudio,
    channel,
    audioDetails,
    menuVisible,
    onPressMenu,
    onPressDeleteMessage,
    isHeaderChage,
    onMessageLongPress,
    selectedMessage,
    fileList,
    internalFileList,
    onLaunchDocument,
    navigationTitlePress,
    isTitleBtnDisable,
    isInPutHide,
    inputHideMessage,
    is_group,
    groupParticpantsList,
    onAddMediaPress,
    sharedKey,
  } = props;
  const TrackInteractive = true;
  const styles = dynamicStyles(null);
  const photoUploadDialogRef = useRef<any>();
  const longPressActionSheetRef = useRef<any>();
  const longPressAudioVideoActionSheetRef = useRef<any>();

  const onChangeText = (text: string) => {
    onChangeTextInput(text);
  };

  const onSend = () => {
    onSendInput();
  };

  const onPhotoUploadDialogDone = async (index: number) => {
    if (index == 0) {
      longPressAudioVideoActionSheetRef.current.show();
    }
    if (index == 1) {
      onOpenPhotos();
    } else if (index === 2) {
      onLaunchDocument();
    }
  };

  const onGroupSettingsActionDone = (index: number) => {
    if (index == 0) {
      showRenameDialog(true);
    } else if (index == 1) {
      onLeave();
    }
  };

  const onVideoPhotoPress = (index: number) => {
    if (index == 0) {
      onLaunchCameraVideo();
    } else if (index == 1) {
      onLaunchCameraPhoto();
    }
  };

  const onPrivateSettingsActionDone = (index: number) => {
    if (index == 2) {
      return;
    }
    var message, actionCallback;
    if (index == 0) {
      actionCallback = onUserBlockPress;
      message =
        "Are you sure you want to block this user? You won't see their messages again.";
    } else if (index == 1) {
      actionCallback = onUserReportPress;
      message =
        "Are you sure you want to report this user? You won't see their messages again.";
    }
    Alert.alert('Are you sure?', message, [
      {
        text: 'Yes',
        onPress: actionCallback,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const onReplyPress = (index: number) => {
    if (index == 0) {
      onReplyActionPress(selectedMessage);
    }
  };

  const messageUnSelect = async (data: any) => {
    onMessageLongPress(data);
  };
  const ConditionalRendering = () => {
    return (
      <>
        {!isHeaderChage ? (
          <HeaderOne
            isTitleBtnDisable={isTitleBtnDisable}
            outBond={selectedMessage?.[0]?.senderID === user?.id}
            title={disPlayName}
            onPress={() => navigationGOBack()}
            menuVisible={menuVisible}
            menuList={props.menuList}
            onPressMenu={data => onPressMenu(data)}
            navigationTitlePress={() => navigationTitlePress()}></HeaderOne>
        ) : (
          <HeaderThree
            title={disPlayName}
            outBond={
              selectedMessage?.[0]?.senderID === user?.id &&
              selectedMessage.length == 1
            }
            onPress={() => navigationGOBack()}
            menuVisible={menuVisible}
            showCopyButton={
              selectedMessage.length === 1 &&
              selectedMessage[0].messageType === MESSAGE_TYPE.TEXT
            }
            menuList={props.menuList}
            onPressDeleteMessage={() => onPressDeleteMessage()}
            onPressMenu={data => onPressMenu(data)}
          />
        )}
        <MessageThread
          thread={thread}
          is_group={is_group}
          fileList={fileList}
          groupParticpantsList={groupParticpantsList}
          internalFileList={internalFileList}
          isHeaderChage={isHeaderChage}
          user={user}
          sharedKey={sharedKey}
          uploadProgress={uploadProgress}
          messageSelectionList={selectedMessage}
          appStyles={appStyles}
          messageUnSelect={data => messageUnSelect(data)}
          onChatMediaPress={data => onChatMediaPress(data)}
          onSenderProfilePicturePress={onSenderProfilePicturePress}
          onMessageLongPress={onMessageLongPress}
          title={''}
          onPress={function (): void {
            throw new Error('Function not implemented.');
          }}
          pauseAudio={() => pauseAudio()}
          audioDetails={audioDetails}
        />

        {isInPutHide ? (
          <View>
            <Text
              style={{
                marginLeft: WIDTH / 15,
                alignItems: 'center',
                fontSize: 16,
                fontFamily: theme.fonts.bold,
              }}>
              {inputHideMessage}
            </Text>
          </View>
        ) : (
          <BottomInput
            uploadProgress={uploadProgress}
            value={inputValue}
            onChangeText={onChangeText}
            onSend={onSend}
            appStyles={appStyles}
            trackInteractive={TrackInteractive}
            onAddMediaPress={() => {
              if (channel?.participants?.[0]?.blockedBy === user?.id) {
                onAddMediaPress(ERROR_MESSAGE_CONTENT.UN_BLOCK);
              } else {
                photoUploadDialogRef.current.show();
              }
            }}
            inReplyToItem={inReplyToItem}
            onReplyingToDismiss={onReplyingToDismiss}
            item={undefined}
            startRecord={() => startRecord()}
            stopRecord={type => stopRecord(type)}
            recorderDetails={recorderDetails}
          />
        )}

        <ActionSheet
          title={'Are you sure?'}
          options={['Confirm', 'Cancel']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={() => null}
        />
        <ActionSheet
          ref={photoUploadDialogRef}
          title={'Photo Upload'}
          options={[
            'Launch Camera',
            'Open Photo Gallery',
            'Document',
            'Cancel',
          ]}
          cancelButtonIndex={3}
          onPress={onPhotoUploadDialogDone}
        />
        <ActionSheet
          ref={groupSettingsActionSheetRef}
          title={'Group Settings'}
          options={['Rename Group', 'Leave Group', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={onGroupSettingsActionDone}
        />
        <ActionSheet
          ref={privateSettingsActionSheetRef}
          title={'Actions'}
          options={['Block user', 'Report user', 'Cancel']}
          cancelButtonIndex={2}
          onPress={onPrivateSettingsActionDone}
        />

        <ActionSheet
          ref={longPressActionSheetRef}
          title={'Actions'}
          options={['Reply', 'Cancel']}
          cancelButtonIndex={1}
          onPress={onReplyPress}
        />
        <ActionSheet
          ref={longPressAudioVideoActionSheetRef}
          title={'Actions'}
          options={['Video', 'Photo', 'Cancel']}
          cancelButtonIndex={2}
          onPress={onVideoPhotoPress}
        />
      </>
    );
  };
  return (
    <PageContainer>
      {IS_IOS ? (
        <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
          {ConditionalRendering()}
        </KeyboardAvoidingView>
      ) : (
        ConditionalRendering()
      )}
    </PageContainer>
  );
};

export default ChatViewer;
