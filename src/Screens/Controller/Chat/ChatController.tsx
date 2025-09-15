import {
  BackHandler,
  Alert,
  Platform,
  Linking,

} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import storage from '@react-native-firebase/storage';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import {channelManager, firebaseStorage} from '../../../chat-firebase';
import ChatViewer from '../../Viewer/Chat/ChatViewer';
import {
  CHAT_DETAILS_CONFIGURE,
  CHAT_OPTIONS,
  IS_ANDROID,
  IS_IOS,
  MAXIMUM_FILE_SIZE,
  MESSAGE_STATUS,
  MESSAGE_TYPE,
  SNACKBAR_MESSAGE_LENGTH,
} from '../../../Constant/Constant';
import {SCREEN_NAMES} from '../../../Constant/ScreenName';
import {
  blockChat,
  muteChat,
  deleteChat,
  currentTimestamp,
  deleteBroadcast,
  exitTheGroup,
  makeAdmin,
  onLeaveGroup,
  updateMessageStatusThread,
} from '../../../chat-firebase/channel';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectChannelGroupParticipants,
  selectChatList,
  selectFlieList,
  selectInternalFlieList,
  selectThread,
  selectUser,
  selectedChannelDetails,
  setAudioDuration,
  setChatChanneDetails,
  setChatList,
  setDocumentList,
  setFileList,
  setInternalFileList,
  setMediaList,
  setParticipantsList,
  setThread,
} from '../../../redux/chatSlice';
import DocumentPicker from 'react-native-document-picker';
import {
  checkFileOrDirectoryExists,
  directoryTOSaveDocumentFileInternal,
  directoryTOSaveFile,
  directoryTOSaveFileInternal,
  getFileName,
  getFileNameJoin,
  getFilePathForOsBased,
  getFileViewer,
  readFileName,
  readFileNameMedia,
  readInternalFileName,
} from '../../../chat-services/MediaHelper';
import {
  getFileSizeLimit,
  requestAudioPermission,
  requestPerMissions,
  showLog,
  snackBarMessage,
} from '../../../chat-services/common';

import {useAuth} from '../../../Router/Context/Auth';
import {
  broadCastPushNotifications,
  groupPushNotifications,
  indiviualPushNotifications,
} from '../../../chat-services/NotificationHelper';
import Clipboard from '@react-native-clipboard/clipboard';
import {encrypt, sharedKeyAlgorthim} from '../../../chat-services/EndToEndEncryption';
import ActionSheet from 'react-native-actionsheet';
import MessageThread from '../../../Components/chat/message-thread';
import HeaderThree from '../../../Components/chat/header/header-three';
import HeaderOne from '../../../Components/chat/header/header-one';
import dynamicStyles from '../../Viewer/Chat/styles';

const audioRecorderPlayer = new AudioRecorderPlayer();

const ChatController: React.FC = () => {
  const thread = useSelector(selectThread);
  const [inputValue, setInputValue] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [isRenameDialogVisible, setIsRenameDialogVisible] = useState(false);
  const [inReplyToItem, setInReplyToItem] = useState(null);
  const fileList = useSelector(selectFlieList);
  const internalFileList = useSelector(selectInternalFlieList);

  const [recorderDetails, setRecorderDetails] = useState({
    recordSecs: 0,
    recordTime: '',
    isRecording: false,
    isAudio: false,
    firebasePath: '',
  });
  const dispatch = useDispatch();

  const [audioDetails, setAudioDetails] = useState({
    isPlaying: false,
    url: null,
  });

  // Define a type for your message object
  type MessageType = {
    id: string;
    content?: string;
    [key: string]: any;
  };
  const [selectedMessage, setSeletedMessage] = useState<MessageType[]>([]);
  const [isHeaderChage, setIsHeaderChange] = useState<boolean>(false);

  const [menuVisible, setMenuVisble] = useState(false);

  const navigation = useNavigation<any>();


  const route = useRoute();

  const groupSettingsActionSheetRef = useRef<any>();
  const privateSettingsActionSheetRef = useRef<any>();
  const chatList = useSelector(selectChatList);
  const channel = useSelector(selectedChannelDetails);
  const user = useSelector(selectUser);
  const groupParticpantsList = useSelector(selectChannelGroupParticipants);
  const {usersSubscribe} = useAuth();
  const isClearAllRef = useRef(false);
  const [sharedKey, setSharedKey] = useState('');

  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.navigate(SCREEN_NAMES.CHAT_LIST);
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    getApiCall();
    if (channel?.participants?.[0]?.is_group === true) {
      getChannelParticipants();
      channelManager.subscribeChanelParticipantSnapshot(
        channel,
        user,
        onChannelParticipantUpdate,
      );
    }

    channelManager.subscribeThreadSnapshot(channel, onThreadCollectionUpdate);
    channelManager.subscribeChanelSnapshot(channel, onChannelCollectionUpdate);
  }, [isFocused]);

  useEffect(() => {
    let listener = updateMessageStatusThread(
      channel,
      // MESSAGE_STATUS.READ,
      user?.id,
      channel?.participants?.[0]?.is_broadCast,
    );
    return () => {
      if (listener) {
        listener();
      }
    };
  }, []);

  const getChannelParticipants = () => {
    channelManager.fetchChannelParticipantUsers(channel, response => {
      let particiants: {user: any}[] = [];
      response.map((ele: {user: any}) => {
        if (ele.user) {
          let findUser = usersSubscribe?.data.find(
            (item: {id: any}) => item.id === ele.user,
          );
          if (findUser) {
            particiants.push({
              ...ele,
              ...findUser,
            });
          } else {
            particiants.push({
              ...ele,
            });
          }
        }
      });
      dispatch(setParticipantsList(particiants));
    });
  };

  const onPressMenu = async (data: string) => {
    if (data === 'copy') {
      let message = selectedMessage?.[0]?.content;
      Clipboard.setString(message ?? '');
      setIsHeaderChange(false);
      snackBarMessage('Message copied', SNACKBAR_MESSAGE_LENGTH.SHORT);

      setSeletedMessage([]);
      return;
    }
    setMenuVisble(!menuVisible);

    if (
      data === CHAT_DETAILS_CONFIGURE.BLOCK ||
      data === CHAT_DETAILS_CONFIGURE.UN_BLOCK
    ) {
      let updateDetails = await blockChatDetails(data);
      if (updateDetails?.status) {
        chatListUpdate(updateDetails?.data);
      }
    } else if (
      data === CHAT_DETAILS_CONFIGURE.MUTE ||
      data === CHAT_DETAILS_CONFIGURE.UN_MUTE
    ) {
      await muteChat(channel, user?.userID, data);
    } else if (data === CHAT_DETAILS_CONFIGURE.CLEAR_CHAT) {
      clearChatMessage();
    } else if (data === CHAT_DETAILS_CONFIGURE.DELETE_BRAOD_CAST) {
      await deleteBroadcast(channel, user?.userID, data);
      let chatLists = chatList.filter(ele => ele.id !== channel.id);
      dispatch(setChatList(chatLists));
    } else if (data === CHAT_DETAILS_CONFIGURE.EXIT_GROUP) {
      let requestData: any = {
        isExit: true,
        exitTime: currentTimestamp(),
      };
      let findUserData = groupParticpantsList.find(
        (ele: {user: any}) => ele.user === user.userID,
      );
      if (findUserData.isAdmin) {
        requestData.isAdmin = false;
      }
      exitTheGroup(channel.id, user, requestData, res => {
        let users = user;

        if (res?.success) {
          let findUserData = groupParticpantsList.find(
            (ele: {user: any}) => ele.user === users.userID,
          );
          if (findUserData.isAdmin) {
            let fileteGroupParticpantsList = groupParticpantsList.filter(
              (              ele: { user: any; }) => ele.user !== users.userID,
            );
            fileteGroupParticpantsList.sort(
              (a: {name: string}, b: {name: string}) => {
                let fa = a.name.toLowerCase(),
                  fb = b.name.toLowerCase();

                if (fa < fb) {
                  return -1;
                }
                if (fa > fb) {
                  return 1;
                }
                return 0;
              },
            );
            makeAdmin(channel.id, fileteGroupParticpantsList[0], res => {
              getChannelParticipants();
            });
          } else {
            getChannelParticipants();
          }
        }
      });
    } else if (data === CHAT_DETAILS_CONFIGURE.DELETE_GROUP) {
      onLeaveGroup(channel.id, user?.id, res => {
        getChannelParticipants();
        navigation.navigate(SCREEN_NAMES.CHAT_LIST);
      });
    } else if (data === 'info') {
      let message = selectedMessage[0];
      setSeletedMessage([]);
      setIsHeaderChange(false);
      navigation.navigate(SCREEN_NAMES.MESSAGE_INFO, {message: message});
    }
  };

  const onChangeName = (text: string) => {
    showRenameDialog(false);

    const channels = {...channel};
    delete channels.participants;
    channels.name = text;

    channelManager.onRenameGroup(
      text,
      channel,
      ({success, error, newChannel}) => {
        if (success) {
          dispatch(setChatChanneDetails(newChannel));
        }

        if (error) {
          Alert.alert(error);
        }
      },
    );
  };

  const onLeave = () => {
    Alert.alert(
      `Leave ${channel.name || 'group'}`,
      'Are you sure you want to leave this group?',
      [
        {
          text: 'Yes',
          onPress: onLeaveDecided,
          style: 'destructive',
        },
        {text: 'No'},
      ],
      {cancelable: false},
    );
  };

  const onLeaveDecided = () => {
    channelManager.onLeaveGroup(
      channel.id,
      user?.userID,
      ({success, error}) => {
        if (success) {
          navigation.goBack();
        }

        if (error) {
          Alert.alert(error);
        }
      },
    );
  };

  const showRenameDialog = (show: boolean) => {
    setIsRenameDialogVisible(show);
  };
  const chatListUpdate = (threadData: any) => {
    try {
      let findIndexValue = chatList.findIndex(
        ele => ele.channelID === channel?.id,
      );
      if (findIndexValue != -1) {
        let tempData = [...chatList]; // Create a new array to avoid modifying the original array
        let tempDetalis = {
          ...chatList[findIndexValue],
          ...threadData,
        };

        tempData.splice(findIndexValue, 1, tempDetalis);

        dispatch(setChatList([...tempData]));
      }
    } catch (e) {
      showLog('exception', e);
    }
  };

  const onThreadCollectionUpdate = (querySnapshot: any[]) => {
    let data: any[] = [];
    let tempDetalis = {};
    if (!isClearAllRef.current) {
      if (querySnapshot) {
        // if(thread.length===0){
        data = [];

        querySnapshot.forEach(doc => {
          const message = doc.data();
          if (message) {
            data.push({...message, id: doc.id});
          }
        });

        getMediaList(data);
        tempDetalis = {
          lastMessage: data?.[0]?.content,
        };

        dispatch(setThread(data));

        chatListUpdate(tempDetalis);
      }
    }
  };

  const getMediaList = (data: any[]) => {
    let mediaList: any = [];
    let documentList: any = [];
    if (data) {
      data.map((element: {fileName: any; messageType: any}) => {
        if (element.fileName) {
          if (
            checkFileOrDirectoryExists(fileList, element) ||
            checkFileOrDirectoryExists(fileList, element)
          ) {
            if (element?.messageType === MESSAGE_TYPE.DOCUMENT) {
              documentList.push(element);
            } else {
              if (element?.messageType !== MESSAGE_TYPE.AUDIO) {
                mediaList.push(element);
              }
            }
          }
        }
      });
      dispatch(setDocumentList(documentList));

      dispatch(setMediaList(mediaList));
    }
  };
  const onChannelCollectionUpdate = (querySnapshot: {data: () => void}) => {
    let tempData: any = querySnapshot.data();
    // console.log('Selected channel', channel);
    if (tempData) {
      dispatch(
        setChatChanneDetails({
          ...channel,
          name: channel?.is_group ? tempData.name : channel.name,
          is_edit: tempData?.is_edit,
          participants: [
            {
              ...channel.participants[0],
              ...tempData,
            },
          ],
        }),
      );
    }
  };

  const onChannelParticipantUpdate = (querySnapshot: {_docs: any}) => {
    getChannelParticipants();
  };

  const onChangeTextInput = (text: string) => {
    setInputValue(text);
  };

  const createOne2OneChannel = () => {
    return new Promise(resolve => {
      channelManager
        .createChannel(user, channel.participants, null)
        .then((response: any) => {
          channelManager.subscribeChanelSnapshot(
            response.channel,
            onChannelCollectionUpdate,
          );
          channelManager.subscribeThreadSnapshot(
            response.channel,
            onThreadCollectionUpdate,
          );
          resolve(response.channel);
        });
    });
  };

  const onSendInput = async () => {
    if (thread.length > 0 || channel?.participants?.length > 1) {
      sendMessage(MESSAGE_TYPE.TEXT, '', '', '');
      return;
    }

    // If we don't have a chat id, we need to create it first together with the participations
    createOne2OneChannel().then(_response => {
      sendMessage(MESSAGE_TYPE.TEXT, '', '', '');
    });
  };

  const blockChatDetails = async (data: string) => {
    if (thread.length > 0 || channel?.participants?.length > 1) {
      let result = await blockChat(channel, user?.userID, data);
      return result;
    }
    createOne2OneChannel().then(async _response => {
      let result = await blockChat(channel, user?.userID, data);
      return result;
    });
  };

  const onSendStorageData = async (
    url: string,
    messageType: string,
    fileName: string,
    fileInfo: any,
  ) => {
    if (thread.length > 0 || channel?.participants?.length > 1) {
      sendMessage(messageType, url, fileName, fileInfo);

      return;
    }

    createOne2OneChannel().then(_response => {
      sendMessage(messageType, url, fileName, fileInfo);
    });
  };

  const sendMessage = async (
    messsageType: string,
    url: any,
    fileName: any,
    fileInfo: any,
  ) => {
    let inputValues = inputValue;
    let downloadUrls = url || downloadUrl;
    let inReplyToItems = inReplyToItem;

    setInputValue('');
    setDownloadUrl('');
    setInReplyToItem(null);
    if (isClearAllRef?.current) {
      isClearAllRef.current = false;
    }

    channelManager
      .sendMessage(
        user,
        channel,
        //  messsageType===MESSAGE_TYPE.TEXT? encrypt(inputValues,sharedKey):
        inputValues,
        //  messsageType!==MESSAGE_TYPE.TEXT? encrypt(downloadUrls,sharedKey):
        downloadUrls,
        inReplyToItems,
        messsageType,
        fileName,
        fileInfo,
      )
      .then((response: any) => {
        if (response.status === false) {
          Alert.alert('Alert', response?.message, [
            {
              text: 'Cancel',
              onPress: () => showLog('', 'Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                let updateDetails = await blockChatDetails(
                  CHAT_DETAILS_CONFIGURE.UN_BLOCK,
                );
                if (updateDetails?.status) {
                  chatListUpdate(updateDetails?.data);
                }
              },
            },
          ]);
          return;
        }
        if (response.error) {
          setInputValue(inputValues);
          setDownloadUrl(downloadUrls);
          setInReplyToItem(inReplyToItems);
        } else {
          if (channel?.participants[0]?.is_broadCast) {
            channel?.participants[0]?.broadCastUserChannels.map((ele: any) => {
              let channelData = {
                ...channel,
                id: ele.channelID,
                userId: ele.userId,
              };

              channelManager.sendMessageForBroadCast(
                user,
                channelData,
                inputValues,
                downloadUrls,
                inReplyToItems,
                messsageType,
                '',
                response?.data,
                fileInfo // Add the missing 9th argument here
              );
              let userData = usersSubscribe?.data.find(
                (element: {id: any}) => element?.id === ele?.userId,
              );
              if (ele?.id && ele?.id !== user?.id) {
                let threadData = response.data;
                threadData.receiverId = ele.userId;
                threadData.channel = ele.channelID;
                threadData.masterChannel = channel?.id;
                channelManager.addMessageInfo(threadData);
                broadCastPushNotifications(
                  channel,
                  user,
                  inputValue,
                  downloadUrls,
                  response.data,
                  userData,
                );
              }
            });
          } else if (channel?.participants[0]?.is_group) {
            groupParticpantsList?.map((ele: {id: any}) => {
              if (ele?.id && ele?.id !== user?.id) {
                let threadData = response.data;
                threadData.receiverId = ele?.id;
                channelManager.addMessageInfo(threadData);
              }
            });
            groupPushNotifications(
              channel,
              user,
              inputValue,
              downloadUrls,
              groupParticpantsList,
              response.data,
            );
          } else {
            indiviualPushNotifications(
              channel,
              user,
              inputValue,
              downloadUrls,
              response.data,
            );
          }
        }
      });
  };

  const onAddMediaPress = (message: string) => {
    Alert.alert('Alert', message, [
      {
        text: 'Cancel',
        onPress: () => showLog('', 'Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          let updateDetails = await blockChatDetails(
            CHAT_DETAILS_CONFIGURE.UN_BLOCK,
          );
          if (updateDetails?.status) {
            chatListUpdate(updateDetails?.data);
          }
        },
      },
    ]);
    return;
  };

  const onLaunchDocument = async () => {
    const {id, name, profilePictureURL} = user;
    let result = await requestPerMissions();
    if (result) {
      const pickerResult = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.csv,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.pdf,
          DocumentPicker.types.plainText,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
          DocumentPicker.types.xls,
        ],
      });

      const data = {
        content: '',
        created: channelManager.currentTimestamp(),
        senderFirstName: name,
        senderID: id,
        senderLastName: '',
        senderProfilePictureURL: '',
        url: 'http://fake',
      };

      pickerResult.map(ele => {
        let source = ele?.uri;
        let mime = ele.type;
        let fileName = ele.name;
        let size = ele.size;
        if (getFileSizeLimit(ele?.size)) {
          let participants = channel?.participants?.[0];
          const threadDataList = [
            {
              content: '',
              created: currentTimestamp(),
              recipientFirstName: '',
              recipientID: '',
              recipientLastName: '',
              recipientProfilePictureURL: '',
              senderFirstName:
                user?.firstName || user?.fullname || user?.name || '',
              senderID: user?.id,
              senderLastName: '',
              senderProfilePictureURL: '',
              url: source,
              inReplyToItem: inReplyToItem,
              messageType: MESSAGE_TYPE.DOCUMENT,
              fileName: fileName || '',
              isBlocked: participants?.isBlocked || false,
              blockedBy: participants?.blockedBy || null,
              isAudio: false,
            },
          ];

          let tempData = thread;
          let list = threadDataList.concat(tempData);

          startUpload(
            {
              source,
              mime,
              fileName,
              size,
            },
            data,
          );
          dispatch(setThread(list));
        } else {
          snackBarMessage(
            'File Size is To High Please Upload' +
              ' ' +
              MAXIMUM_FILE_SIZE +
              ' Mb',
            SNACKBAR_MESSAGE_LENGTH.SHORT,
          );
        }
      });
    } else {
      Alert.alert(
        'Permission Required',
        'Please allow both required permissions to access local files.',
        [{text: 'Allow', onPress: () => Linking.openSettings()}],
      );
    }
  };

  const onLaunchCameraPhoto = async () => {
    let result = await requestPerMissions();
    if (result) {
      onLaunchCamera('photo');
    } else {
      Alert.alert(
        'Permission Required',
        'Please allow both required permissions to access local files.',
        [{text: 'Allow', onPress: () => Linking.openSettings()}],
      );
    }
  };
  const onLaunchCameraVideo = async () => {
    let result = await requestPerMissions();
    if (result) {
      onLaunchCamera('video');
    } else {
      Alert.alert(
        'Permission Required',
        'Please allow both required permissions to access local files.',
        [{text: 'Allow', onPress: () => Linking.openSettings()}],
      );
    }
  };

  const onLaunchCamera = (type: any) => {
    try {
      const {id, name, profilePictureURL} = user;

      let options: any = {};
      if (type === 'photo') {
        options = {
          mediaType: type,
          quality: 0.1,
        };
      } else {
        options = {
          mediaType: type,
          videoQuality: 'low',
        };
      }

      launchCamera(options)
        .then((image: any) => {
          let source = '';
          let mime = '';
          let fileName = '';
          let size = 0;
          if (image?.assets[0]) {
            if (getFileSizeLimit(image?.assets[0].fileSize)) {
              source = image?.assets[0].uri;
              mime = image?.assets[0].type;
              fileName = image?.assets[0].fileName;
              size = image?.assets[0].fileSize;
              let participants = channel?.participants?.[0];
              const threadDataList = [
                {
                  content: '',
                  created: null,
                  recipientFirstName: '',
                  recipientID: '',
                  recipientLastName: '',
                  recipientProfilePictureURL: '',
                  senderFirstName:
                    user?.firstName || user?.fullname || user.name || '',
                  senderID: user?.userID,
                  senderLastName: '',
                  senderProfilePictureURL: '',
                  url: source,
                  inReplyToItem: inReplyToItem,
                  messageType:
                    mime.startsWith('image') === true
                      ? MESSAGE_TYPE.IMAGE
                      : MESSAGE_TYPE.VIDEO,
                  fileName: fileName || '',
                  isBlocked: participants?.isBlocked || false,
                  blockedBy: participants?.blockedBy || null,
                  isAudio: false,
                },
              ];

              let tempData = thread;
              let list = threadDataList.concat(tempData);
              dispatch(setThread(list));
              const data = {
                content: '',
                created: channelManager.currentTimestamp(),
                senderFirstName: name,
                senderID: id,
                senderLastName: '',
                senderProfilePictureURL: '',
                url: 'http://fake',
              };
              startUpload({source, mime, fileName, size}, data);
            } else {
              snackBarMessage(
                'File Size is To High Please Upload' +
                  ' ' +
                  MAXIMUM_FILE_SIZE +
                  ' Mb',
                SNACKBAR_MESSAGE_LENGTH.SHORT,
              );
            }
          }
        })
        .catch(function (error) {
          showLog('erroe--->', error);
        });
    } catch (e) {
      showLog('erroe--->', e);
    }
  };

  const onOpenPhotos = async () => {
    try {
      const {id, firstName, profilePictureURL, name} = user;
      const self = this;
      let result = await requestPerMissions();
      if (result) {
        launchImageLibrary({
          mediaType: 'mixed',
          quality: 0.2,
          videoQuality: 'low',
          selectionLimit: 10,
        })
          .then((image: any) => {
            let source = '';
            let mime = '';
            let fileName = '';
            let size = 0;
            if (image?.assets[0]) {
              image?.assets.forEach(
                (ele: {
                  uri: string;
                  type: string;
                  fileName: string;
                  fileSize: any;
                }) => {
                  source = ele.uri;
                  mime = ele.type;
                  (fileName = ele.fileName), (size = ele.fileSize);
                  if (getFileSizeLimit(ele.fileSize)) {
                    let participants = channel?.participants?.[0];
                    const threadDataList = [
                      {
                        content: '',
                        created: currentTimestamp(),
                        recipientFirstName: '',
                        recipientID: '',
                        recipientLastName: '',
                        recipientProfilePictureURL: '',
                        senderFirstName:
                          user?.firstName || user?.fullname || user?.name || '',
                        senderID: user?.id,
                        senderLastName: '',
                        senderProfilePictureURL: '',
                        url: source,
                        inReplyToItem: inReplyToItem,
                        messageType:
                          mime.startsWith('image') === true
                            ? MESSAGE_TYPE.IMAGE
                            : MESSAGE_TYPE.VIDEO,
                        fileName: fileName || '',
                        isBlocked: participants?.isBlocked || false,
                        blockedBy: participants?.blockedBy || null,
                        isAudio: false,
                      },
                    ];

                    let tempData = thread;
                    let list = threadDataList.concat(tempData);

                    const data = {
                      content: '',
                      created: channelManager.currentTimestamp(),
                      senderFirstName: firstName || name,
                      senderID: id,
                      senderLastName: '',
                      senderProfilePictureURL: profilePictureURL || '',
                      url: 'http://fake',
                    };

                    startUpload({source, mime, fileName, size}, data);
                    dispatch(setThread(list));
                  } else {
                    snackBarMessage(
                      'File Size is To High Please Upload' +
                        ' ' +
                        MAXIMUM_FILE_SIZE +
                        ' Mb',
                      SNACKBAR_MESSAGE_LENGTH.SHORT,
                    );
                  }
                },
              );
            }
          })
          .catch(function (error) {
            showLog('error--->', error);
          });
      } else {
        Alert.alert(
          'Permission Required',
          'Please allow both required permissions to access local files.',
          [{text: 'Allow', onPress: () => Linking.openSettings()}],
        );
      }
    } catch (e) {
      showLog('catchError===>', e);
    }
  };

  const startUpload = (
    uploadData: {
      source: any;
      uri?: string;
      mime?: any;
      fileName: any;
      size: any;
    },
    data:
      | {
          content: string;
          created: any;
          senderFirstName: any;
          senderID: any;
          senderLastName: string;
          senderProfilePictureURL: any;
          url: string;
        }
      | undefined,
  ) => {
    const {source, mime} = uploadData;

    directoryTOSaveFile(uploadData);
    const filename =
      new Date() + '-' + source.substring(source.lastIndexOf('/') + 1);
    const uploadUri =
      Platform.OS === 'ios' ? source.replace('file://', '') : source;

    firebaseStorage.uploadFileWithProgressTracking(
      filename,
      uploadUri,
      async (snapshot: {bytesTransferred: number; totalBytes: number}) => {
        const uploadProgress1 =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(uploadProgress1);
      },
      (url: any, fileInfo: any) => {
        if (url) {
          setUploadProgress(0);
          setDownloadUrl(url); // This should correctly update the downloadUrl state.
          onSendStorageData(
            url,
            uploadData.mime.startsWith('image') === true
              ? MESSAGE_TYPE.IMAGE
              : uploadData.mime.startsWith('video')
              ? MESSAGE_TYPE.VIDEO
              : MESSAGE_TYPE.DOCUMENT,
            uploadData.fileName,
            {
              ...fileInfo,
              created: data?.created || currentTimestamp(),
            },
          );
          let readInternalFile = readInternalFileName();
          dispatch(setInternalFileList(readInternalFile));
        }
      },
      (error: any) => {
        setUploadProgress(0);

        Alert.alert('Oops! An error has occured. Please try again.');
      },
    );
  };
  const saveFileData = async (item: any) => {
    let result = await directoryTOSaveFileInternal(item);
    console.log('result', result);
    let fileList = await readInternalFileName();
    console.log('FileList---in savefile data--', JSON.stringify(fileList));
    dispatch(setInternalFileList(fileList));
    return true;
  };

  const downloadFile = (data: {url: any; fileName: string}) => {
    let FILE_URL = data?.url;
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;

    let downloadProgress = 0; // Initialize download progress as 0

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path: RootDir + '/' + data?.fileName,
        description: 'Downloading file...',
        notification: true,
        useDownloadManager: true,
      },
    };

    config(options)
      .fetch('GET', FILE_URL)
      .progress((received, total) => {
        // Calculate download progress as a percentage
        const progress = (received / total) * 100;
        downloadProgress = progress;
        console.log(`Download Progress: ${progress}%`);
      })
      .then(async res => {
        let fileList = await readFileNameMedia();

        dispatch(setFileList(fileList));
        downloadProgress = 100; // Set progress to 100% when download is complete
      })
      .catch(error => {
        // Download failed or was canceled
        downloadProgress = -1; // Set progress to -1 to indicate failure or cancellation
        console.error('Download failed or was canceled:', error);
      })
      .finally(() => {
        // You can use downloadProgress here to determine if the download was successful
        if (downloadProgress === 100) {
          // Download was successful
        } else if (downloadProgress === -1) {
          // Download failed or was canceled
        }
      });
  };

  const onChatMediaPress = async (item: any) => {
    if (selectedMessage.length === 0) {
      if (item.messageType === MESSAGE_TYPE.DOCUMENT) {
        let result = checkFileOrDirectoryExists(
          item.senderID === user?.id ||
            item.messageType === MESSAGE_TYPE.DOCUMENT
            ? internalFileList
            : fileList,
          item,
        );

        if (!result) {
          getFileViewer(item);
          return true;
        } else {
          await directoryTOSaveDocumentFileInternal(item);
          let readInternalFile = readInternalFileName();
          dispatch(setInternalFileList(readInternalFile));
        }
      } else if (item.messageType !== MESSAGE_TYPE.AUDIO) {
        if (item.senderID === user?.id) {
          let result = checkFileOrDirectoryExists(internalFileList, item);

          if (!result) {
            // if(item.messageType===MESSAGE_TYPE.VIDEO){
            //   let uri=getFileUrlForInternal(item)
            //   VideoPlayerBridge.renderVideoFromUrl(uri);
            // }else{
            navigation.navigate(SCREEN_NAMES.MEDIA_VIEWER, {data: item});
            // }
          } else {
            let result = await saveFileData(item);
          }
        } else {
          let result = checkFileOrDirectoryExists(fileList, item);
          console.log('FileList', fileList);
          console.log('item', item);

          if (!result) {
            navigation.navigate(SCREEN_NAMES.MEDIA_VIEWER, {data: item});
          } else {
            saveFileData(item);
            // downloadFile(item);
          }
        }
      } else {
        if (item?.isAudio) {
          if (audioDetails.isPlaying) {
            stopAudio();
          } else {
            if (!checkFileOrDirectoryExists(internalFileList, item)) {
              playAudio(item);
            } else {
              let result = await saveFileData(item);
            }
          }
        }
      }
    } else {
      onMessageLongPress(item);
    }
  };
 
  const onMediaClose = () => {
    setIsMediaViewerOpen(false);
  };

  const onUserBlockPress = () => {
    reportAbuse('block');
  };

  const onUserReportPress = () => {
    reportAbuse('report');
  };

  const reportAbuse = (type: string) => {
    const participants = channel.participants;
    if (!participants || participants.length != 1) {
      return;
    }
    const myID = user?.id;
    const otherUserID = participants[0].id || participants[0].userID;
    // reportingManager.markAbuse(myID, otherUserID, type).then((response: { error: any; }) => {
    //   if (!response.error) {
    //   navigation.goBack();
    //   }
    // });
  };

  const onReplyActionPress = (inReplyToItem: any) => {
    setInReplyToItem(inReplyToItem);
  };

  const onReplyingToDismiss = () => {
    setInReplyToItem(null);
  };
  const getDisPlayNameName = () => {
    // console.log('Channel details', JSON.stringify(channel));
    return channel?.name;
  };

  const getChanelTitleBtnDisable = () => {
    if (channel && channel?.participants?.[0])
      return channel?.participants?.[0]?.is_group === true
        ? false
        : channel?.participants?.[0]?.is_broadCast === true
        ? false
        : true;
  };

  const getRecorderSeconds = (value: any) => {
    let secondSplit = value.split(':');
    let minuteAndSeconds = `${secondSplit[0]}:${secondSplit[1]}`;
    return minuteAndSeconds;
  };

  const recordStop = async (type: string) => {
    try {
      if (type === 'finish') {
        const record = await audioRecorderPlayer.stopRecorder();

        let splitFileName = record.split('/');
        let fileName = splitFileName[splitFileName.length - 1]
          ? IS_IOS
            ? new Date().getSeconds() + splitFileName[splitFileName.length - 1]
            : splitFileName[splitFileName.length - 1]
          : '';

        let audioRef = 'Audio/' + fileName;
        let store = storage().ref(audioRef);
        let task = store.putFile(`${record}`);
        let participants = channel?.participants[0];
        const threadDataList = [
          {
            content: '',
            created: currentTimestamp(),
            recipientFirstName: '',
            recipientID: '',
            recipientLastName: '',
            recipientProfilePictureURL: '',
            senderFirstName:
              user?.firstName || user?.fullname || user?.name || '',
            senderID: user?.id,
            senderLastName: '',
            senderProfilePictureURL: '',
            url: record,
            inReplyToItem: inReplyToItem,
            messageType: MESSAGE_TYPE.AUDIO,
            fileName: fileName || '',
            isBlocked: participants?.isBlocked || false,
            blockedBy: participants?.blockedBy || null,
            isAudio: true,
          },
        ];

        let tempData = thread;
        let list = threadDataList.concat(tempData);
        dispatch(setThread(list));
        let recordData = recorderDetails;
        setRecorderDetails({
          ...recordData,
          isRecording: false,
          isAudio: false,
          firebasePath: audioRef,
        });

        task.on(
          'state_changed',
          snapshot => {
            const uploadProgress1 =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(uploadProgress1);
          },
          error => {
            return {error: error};
          },
          async () => {
            let result = await saveFileData({
              source: record,
              fileName: fileName,
              messageType: MESSAGE_TYPE.AUDIO,
              url: audioRef,
            });

            task.snapshot.ref.getMetadata().then((res: any) => {
              let audioRequest = {
                ...recordData,
                ...res,
              };

              setInputValue(audioRef);
              if (thread.length > 0 || channel?.participants?.length > 1) {
                sendMessage(
                  MESSAGE_TYPE.AUDIO,
                  audioRef,
                  fileName,
                  // splitFileName[splitFileName.length - 1],
                  audioRequest,
                );

                return;
              }

              // If we don't have a chat id, we need to create it first together with the participations
              createOne2OneChannel().then(_response => {
                sendMessage(
                  MESSAGE_TYPE.AUDIO,
                  audioRef,
                  fileName,
                  // splitFileName[splitFileName.length - 1],
                  audioRequest,
                );
              });
            });
          },
        );
      } else if (type === 'cancel') {
        const record = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setRecorderDetails({
          ...recorderDetails,
          isRecording: false,
          isAudio: false,
          firebasePath: '',
        });
      }
    } catch {
      (err: any) => {
        showLog('Record stop error', err);
      };
    }
  };
  const recordStart = async () => {
    try {
      // Request audio recording permissions
      let permissions = await requestAudioPermission();

      // Ensure permissions were granted
      if (!permissions) {
        showLog('AudioFIle', 'Audio recording permissions not granted');
        return;
      }

      if (IS_IOS) {
        const audioPath = Platform.select({
          ios: undefined,
          android: undefined,
        });

        const audioSet: AudioSet = {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
          OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
        };
        const uri = await audioRecorderPlayer.startRecorder(
          audioPath,
          audioSet,
        );
      } else {
        let audioDirectory = await getFilePathForOsBased(MESSAGE_TYPE.AUDIO);
        const audioPath = `${audioDirectory}/${
          user.id + new Date().getTime()
        }.mp3`;
        const record = await audioRecorderPlayer.startRecorder(
          audioPath,
          null,
          true,
        );
      }
      // Add record back listener
      audioRecorderPlayer.addRecordBackListener(val => {
        setRecorderDetails({
          ...recorderDetails,
          recordSecs: val.currentPosition,
          recordTime: getRecorderSeconds(
            audioRecorderPlayer.mmssss(val.currentPosition),
          ),
          isRecording: true,
          isAudio: true,
        });
      });
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const playAudio = async (item: any) => {
    try {
      setAudioDetails({
        isPlaying: true,
        url: item?.url,
      });
      if (IS_IOS) {
        let url = getFileNameJoin(item);
        const msg = await audioRecorderPlayer.startPlayer('file://' + url);
        const volume = await audioRecorderPlayer.setVolume(0.4);

        audioRecorderPlayer.addPlayBackListener(playback => {
          if (playback.currentPosition === playback.duration) {
            dispatch(setAudioDuration('0:00:00'));

            setAudioDetails({
              isPlaying: false,
              url: null,
            });
          } else {
            const currentPosition = playback.currentPosition / 1000;

            // Convert seconds to hours, minutes, and seconds
            const hours = Math.floor(currentPosition / 3600);
            const minutes = Math.floor((currentPosition % 3600) / 60);
            const seconds = Math.round(currentPosition % 60);
            const formattedTime = `${hours}:${String(minutes).padStart(
              2,
              '0',
            )}:${String(seconds)}`;

            dispatch(setAudioDuration(formattedTime));
          }
        });
      } else {
        let url = getFileNameJoin(item);

        await audioRecorderPlayer.startPlayer(url);
        audioRecorderPlayer.addPlayBackListener(playback => {
          if (playback.currentPosition === playback.duration) {
            dispatch(setAudioDuration('0:00:00'));

            setAudioDetails({
              isPlaying: false,
              url: null,
            });
          } else {
            const currentPosition = playback.currentPosition / 1000;

            // Convert seconds to hours, minutes, and seconds
            const hours = Math.floor(currentPosition / 3600);
            const minutes = Math.floor((currentPosition % 3600) / 60);
            const seconds = Math.round(currentPosition % 60);
            const formattedTime = `${hours}:${String(minutes).padStart(
              2,
              '0',
            )}:${String(seconds)}`;

            dispatch(setAudioDuration(formattedTime));
          }
        });
      }
    } catch (e) {
      showLog('error--->', e);
    }
  };

  const stopAudio = async () => {
    setAudioDetails({
      ...audioDetails,
      isPlaying: false,
    });
    await audioRecorderPlayer.stopPlayer();
  };

  const clearChatMessage = () => {
    return Alert.alert('Alert', 'Are you Sure Clear message', [
      {
        text: 'Cancel',
        onPress: () => showLog('', 'Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          isClearAllRef.current = true;

          let channelID = channel?.id;
          const isGroup = channel?.participants?.[0]?.is_group;
          let deleteData = thread;
          dispatch(setThread([]));

          deleteChat(channelID, deleteData, user.userID, isGroup);
        },
      },
    ]);
  };
  const deleteChatMessage = async () => {
    Alert.alert('Alert', 'Are you Sure Delete message', [
      {
        text: 'Cancel',
        onPress: () => showLog('', 'Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          let channelID = channel?.id;
          const isGroup = channel?.participants?.[0]?.is_group;

          let result = await deleteChat(
            channelID,
            selectedMessage,
            user.userID,
            isGroup,
          );

          if (result.status) {
            setSeletedMessage([]);
            setIsHeaderChange(false);
          }
        },
      },
    ]);
    return true;
  };

  const onMessageLongPress = async (inReplyToItem: any) => {
    let selectedMessageList = selectedMessage;
    let findIndex = selectedMessageList.findIndex(
      ele => ele.id === inReplyToItem.id,
    );

    if (findIndex !== -1) {
      selectedMessageList.splice(findIndex, 1);
    } else {
      selectedMessageList.push(inReplyToItem);
    }
    setSeletedMessage([...selectedMessageList]);
    setIsHeaderChange(selectedMessageList.length !== 0);
  };

  const getIsInputHideOrNot = (groupParticpantsLists: any[]) => {
    if (channel?.participants?.[0]?.is_group === true) {
      let findData = groupParticpantsLists.find(
        (ele: {user: any}) => ele.user === user.id,
      );

      if (
        channel?.participants?.[0]?.is_message === false &&
        !findData?.isAdmin
      ) {
        return true;
      }
      if (findData?.isExit) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const getIsInputHideMessage = (groupParticpantsLists: any[]) => {
    let text = '';

    let findData = groupParticpantsLists.find(
      (ele: {user: any}) => ele.user === user.id,
    );
    if (findData?.isExit) {
      text =
        "You can't send message to this group because you're no longer a participant";
    } else if (
      channel?.participants?.[0]?.is_message === false &&
      !findData?.isAdmin
    ) {
      text = 'Admin Only send a message to group';
    } else {
      text = '';
    }
    return text;
  };

  async function getApiCall() {
    let result = await channelManager.getUserParticipants(channel.id, user.id);
    if (result && result?.[0]?.data()) {
      let channelData = result[0].data();
      let sharedKeyResult = sharedKeyAlgorthim(
        channelData.publicKey,
        channelData.privateKey,
      );
      if (sharedKeyResult) {
        setSharedKey(sharedKeyResult.toString());
      }
    }
  }
 
  return (
    <ChatViewer
      fileList={fileList}
      internalFileList={internalFileList}
      disPlayName={getDisPlayNameName()}
      isTitleBtnDisable={false}
      is_group={!getChanelTitleBtnDisable()}
      isInPutHide={getIsInputHideOrNot(groupParticpantsList)}
      groupParticpantsList={groupParticpantsList}
      inputHideMessage={getIsInputHideMessage(groupParticpantsList)}
      user={user}
      selectedMessage={selectedMessage}
      menuVisible={menuVisible}
      thread={thread}
      isHeaderChage={isHeaderChage}
      inputValue={inputValue}
      inReplyToItem={inReplyToItem}
      onAddMediaPress={message => onAddMediaPress(message)}
      onSendInput={onSendInput}
      channel={channel}
      menuList={
        channel?.participants?.[0]?.is_group
          ? [
              CHAT_DETAILS_CONFIGURE.CLEAR_CHAT,
              !channel?.participants?.[0]?.mutedBy &&
              channel?.participants?.[0]?.mutedBy !== CHAT_OPTIONS.BOTH &&
              channel?.participants?.[0]?.mutedBy !== user?.userID
                ? CHAT_DETAILS_CONFIGURE.MUTE
                : CHAT_DETAILS_CONFIGURE.UN_MUTE,
              !getIsInputHideOrNot(groupParticpantsList)
                ? CHAT_DETAILS_CONFIGURE.EXIT_GROUP
                : CHAT_DETAILS_CONFIGURE.DELETE_GROUP,
            ]
          : channel?.participants?.[0]?.is_broadCast
          ? [
              // !channel?.participants?.[0]?.blockedBy&&channel?.participants?.[0]?.blockedBy!==CHAT_OPTIONS.BOTH&&channel?.participants?.[0]?.blockedBy!==user?.userID?
              // CHAT_DETAILS_CONFIGURE.BLOCK:CHAT_DETAILS_CONFIGURE.UN_BLOCK,
              CHAT_DETAILS_CONFIGURE.CLEAR_CHAT,
              !channel?.participants?.[0]?.mutedBy &&
              channel?.participants?.[0]?.mutedBy !== CHAT_OPTIONS.BOTH &&
              channel?.participants?.[0]?.mutedBy !== user?.userID
                ? CHAT_DETAILS_CONFIGURE.MUTE
                : CHAT_DETAILS_CONFIGURE.UN_MUTE,
              CHAT_DETAILS_CONFIGURE.DELETE_BRAOD_CAST,
            ]
          : [
              channel?.participants?.[0]?.blockedBy !== CHAT_OPTIONS.BOTH &&
              channel?.participants?.[0]?.blockedBy !== user?.userID
                ? CHAT_DETAILS_CONFIGURE.BLOCK
                : CHAT_DETAILS_CONFIGURE.UN_BLOCK,
              CHAT_DETAILS_CONFIGURE.CLEAR_CHAT,
              channel?.participants?.[0]?.mutedBy !== CHAT_OPTIONS.BOTH &&
              channel?.participants?.[0]?.mutedBy !== user?.userID
                ? CHAT_DETAILS_CONFIGURE.MUTE
                : CHAT_DETAILS_CONFIGURE.UN_MUTE,
            ]
      }
      onChangeTextInput={onChangeTextInput}
      onLaunchCamera={onLaunchCamera}
      onLaunchCameraVideo={onLaunchCameraVideo}
      onLaunchCameraPhoto={onLaunchCameraPhoto}
      onLaunchDocument={onLaunchDocument}
      onOpenPhotos={onOpenPhotos}
      navigationGOBack={() => navigation.navigate(SCREEN_NAMES.CHAT_LIST)}
      sharedKey={sharedKey}
      uploadProgress={uploadProgress}
      onPressMenu={data => onPressMenu(data)}
      isMediaViewerOpen={isMediaViewerOpen}
      onChatMediaPress={data => onChatMediaPress(data)}
      onMediaClose={() => onMediaClose}
      isRenameDialogVisible={isRenameDialogVisible}
      groupSettingsActionSheetRef={groupSettingsActionSheetRef}
      privateSettingsActionSheetRef={privateSettingsActionSheetRef}
      showRenameDialog={() => showRenameDialog}
      onChangeName={() => onChangeName}
      onLeave={() => onLeave}
      onUserBlockPress={() => onUserBlockPress}
      onUserReportPress={() => onUserReportPress}
      onReplyActionPress={item => onReplyActionPress(item)}
      onReplyingToDismiss={() => onReplyingToDismiss}
      onSenderProfilePicturePress={function (): void {
        throw new Error('Function not implemented.');
      }}
      navigationTitlePress={() => {
        if (channel?.participants?.[0]?.is_group) {
          navigation.navigate(SCREEN_NAMES.GROUP_INFO);
        } else if (channel?.participants?.[0]?.is_broadCast) {
          navigation.navigate(SCREEN_NAMES.BROADCAST_INFO);
        } else {
          navigation.navigate(SCREEN_NAMES.INDIVIDUAL_INFO);
        }
      }}
      startRecord={() => recordStart()}
      stopRecord={type => recordStop(type)}
      recorderDetails={recorderDetails}
      onMessageLongPress={data => onMessageLongPress(data)}
      onPressDeleteMessage={() => deleteChatMessage()}
      pauseAudio={() => stopAudio()}
      audioDetails={audioDetails}
    />
  );
};

export default ChatController;
