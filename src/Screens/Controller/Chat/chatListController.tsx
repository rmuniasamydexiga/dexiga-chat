import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SCREEN_NAMES} from '../../../Constant/ScreenName';
import {Col, Grid, Row} from 'react-native-easy-grid';
import {channelManager, firebaseUser} from '../../../chat-firebase';
import {dayDate, dayFormatwithUnix} from '../../../chat-services/DayHelper';
import {useDispatch, useSelector} from 'react-redux';
import {
  resetChat,
  selectChatList,
  selectUser,
  setChatChanneDetails,
  setChatList,
  setFileList,
  setInternalFileList,
  setUser,
  setUserList,
} from '../../../redux/chatSlice';
import HeaderFour from '../../../Components/Header/HeaderFour';
import {useAuth} from '../../../Router/Context/Auth';
import {
  CHAT_DETAILS_CONFIGURE,
  CHAT_OPTIONS,
  FROM_NAVIGATION,
  IS_ANDROID,
} from '../../../Constant/Constant';

import {IUser} from '../../../Interfaces/Chat';
import {readFileName, readInternalFileName} from '../../../chat-services/MediaHelper';
import chatStyles from '../../Style/ChatListStyle';
import {requestPerMissions, showLog} from '../../../chat-services/common';

import ActionSheet from 'react-native-actionsheet';

import {launchCamera} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {getAllUserList} from '../../../chat-firebase/user';

import { clearAll, getData, PageContainer ,ContactsFloatingIcon, useStylesheet, VectorIcon} from 'react-native-dex-moblibs';
// import {
//   decrypt,
//   diffieHellManAlgorthim,
//   groupChatSimulation,
//   sharedKeyAlgorthim,
// } from '../../../Helper/EndToEndEncryption';
// import {groupEncryption} from '../../../Helper/Encryption';

const ChatList: React.FC = () => {
  const navigation: any = useNavigation();
  const [userId, setUserId] = useState<String | null>(null);
  const [channelFilter, setChanneFilter] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
const {theme}=useStylesheet()
  const dispatch = useDispatch();
  const chatList = useSelector(selectChatList);

  const [menuVisible, setMenuVisible] = useState(false);
  const {
    usersSubscribe,
    messageChannelCount,
    channelsSubscribe,
    channelParticipantSubscribe,
    setOrUpdateUsers,
    setOrUpdateChannelsSubscribe,
    setOrUpdateChannelParticipants,
    setChannelCount,
    resetChatAlldata,
  } = useAuth();
  const cameraActionSheetRef = useRef<any>();

  const users = useSelector(selectUser);
  const styles = chatStyles();
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (showTextInput) {
          searchText('');
          setShowTextInput(false);
          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [showTextInput]), // Include showTextInput in the dependency array
  );
  //   useFocusEffect(
  //     React.useCallback(() => {

  //       const backAction = () => {

  //         if(showTextInput){
  // setShowTextInput(false)

  // return true
  //         }else{

  //         BackHandler.exitApp();
  //         return true;
  //         }
  //       };
  //       const backHandler = BackHandler.addEventListener(
  //         'hardwareBackPress',
  //         backAction,
  //       );

  //       return () => backHandler.remove();
  //     }, []),
  //   );
  useEffect(() => {
    requestforPerMissions();
    // getUsers()
    setChanneFilter(chatList);
  }, []);
  useEffect(() => {
    setChanneFilter(chatList);
  }, [chatList]);

  useEffect(() => {
    const getUsers = async () => {
      getStored();

      const userId = (await getData('USERID')) || '';
      setUserId(userId);

      const usersSubscription: any = firebaseUser.subscribeUsers(
        (data: any) => {
          setOrUpdateUsers(data);
        },
      );

      const channelParticipationSubscription: any =
        channelManager.subscribeChannelParticipation(userId, participations => {
          setOrUpdateChannelParticipants(participations);
        });

      const channelsSubscription: any = channelManager.subscribeChannels(
        (data: any) => {
          setOrUpdateChannelsSubscribe(data);
          const messageCountSubscription = channelManager.channelMessageStatus(
            userId,
            (messageCount: any) => {
              setChannelCount(messageCount);
            },
          );
        },
      );

      return () => {
        usersSubscription.unsubscribe(); // Adjust this based on how you unsubscribe from Firebase
        channelParticipationSubscription.unsubscribe();
        channelsSubscription.unsubscribe();
      };
    };

    getUsers();
  }, []);

  const getName = (data: any) => {
    // console.log('Channel names - ', data.name);
    if (data && data.name) {
      return data.name;
    }
  };

  const getMessage = (data: any) => {
    if (data.blockedBy === users?.id) {
      return 'You have blocked this contacts';
    }
    if (data.isExit) {
      return 'You have Exit the Group';
    }
    if (data?.lastMessage) {
      if (data?.lastMessage?.startsWith('http')) {
        return 'sent a file';
      } else {
        return data?.lastMessage;

        // let findData = channelParticipantSubscribe.find(
        //   ele => ele.channel === data?.channelID,
        // );

        // if (findData?.publicKey) {
        //   let sharedKeyResult = sharedKeyAlgorthim(
        //     findData?.publicKey,
        //     findData?.privateKey,
        //   );

        //   return decrypt(data?.lastMessage, sharedKeyResult.toString());
        // } else {
        //   return data?.lastMessage;
        // }
      }
    } else {
      return '';
    }
  };

  const onPressMenu = async (data: string) => {
    if (data === CHAT_DETAILS_CONFIGURE.LOG_OUT) {
      await clearAll();
      dispatch(resetChat());
      resetChatAlldata();
      navigation.navigate(SCREEN_NAMES.LOGIN);
    } else if (data === CHAT_DETAILS_CONFIGURE.NEW_BRAOD_CAST) {
      navigation.navigate(SCREEN_NAMES.ADD_NEW_BROAD_CAST);
    } else if (data === CHAT_DETAILS_CONFIGURE.NEW_GROUP) {
      navigation.navigate(SCREEN_NAMES.ADD_NEW_GROUP);
    }

    setMenuVisible(!menuVisible);
  };

  const requestforPerMissions = async () => {
    if (IS_ANDROID) {
      let result = await requestPerMissions();
      if (result) {
        let fileList = await readFileName();
        let fileListInternal = await readInternalFileName();
        dispatch(setInternalFileList(fileListInternal));
        dispatch(setFileList(fileList));
      } else {
        return Alert.alert(
          'Permission Required',
          'Please allow both required permissions to access local files.',
          [{text: 'Allow', onPress: () => Linking.openSettings()}],
        );
      }
    } else {
      let fileList = await readFileName();
      let fileListInternal = await readInternalFileName();
      dispatch(setInternalFileList(fileListInternal));
      dispatch(setFileList(fileList));
    }
  };

  const getStored = async () => {
    let name: string | null = await getData('NAME');
    let email: string | null = await getData('EMAIL');
    let userId: string | null = await getData('USERID');
    let users: IUser = {
      name: name,
      id: userId,
      userID: userId,
      email: email,
    };

    let result = await getAllUserList(email);
    dispatch(setUserList([...result]));
    dispatch(setUser(users));
  };

  useEffect(() => {
    hydrateChannelsIfNeeded(
      usersSubscribe,
      channelsSubscribe,
      channelParticipantSubscribe,
    );
  }, [usersSubscribe, channelsSubscribe, channelParticipantSubscribe]);

  const hydrateChannelsIfNeeded = async (
    userData: {data: any},
    channelsUnsubscribe: any,
    channelParticipantUnsubscribe: any,
  ) => {
    try {
      const userID = (await getData('USERID')) || '';
      const allUsers = userData?.data;
      let channels = channelsUnsubscribe;
      let participations = channelParticipantUnsubscribe;
      if (!channels || !allUsers || !participations) {
        return;
      }
      const myChannels = channels.filter((channel: {id: any}) =>
        participations.find(
          (participation: {channel: any}) =>
            participation.channel == channel.id,
        ),
      );

      const participantIDsByChannelHash: any = {};

      var channelParticipantPromises = myChannels.map(
        (channel: {isDelete: boolean; id: any; is_broadCast: boolean}) => {
          if (channel.isDelete !== true) {
            return new Promise<void>((resolve, _reject) => {
              channelManager.fetchChannelParticipantIDs(
                channel,
                participantIDs => {
                  participantIDsByChannelHash[channel.id] = participantIDs;

                  resolve();
                },
              );
            });
          }
        },
      );

      Promise.all(channelParticipantPromises).then(_values => {
        var hydratedChannel: any[] = [];
        myChannels.forEach(
          (channel: {
            id: string | number;
            is_broadCast: any;
            is_group: any;
          }) => {
            if (channel.is_group) {
              let findChannelData = channelParticipantSubscribe.find(
                (ele: {channel: string | number}) => ele.channel === channel.id,
              );
              if (findChannelData) {
                hydratedChannel.push({
                  ...findChannelData,
                  ...channel,
                });
              } else {
                hydratedChannel.push(channel);
              }
              // hydratedChannel.push(channel)
            } else {
              const participantIDs = participantIDsByChannelHash[channel.id];
              if (participantIDs) {
                const finalParticipantIDs = participantIDs.filter((id: any) => {
                  return id != userID;
                });
                if (finalParticipantIDs && finalParticipantIDs?.length > 0) {
                  var hydratedParticipants: any[] = [];
                  let broadCastUserChannel: any[] = [];
                  if (channel.is_broadCast === true) {
                    // console.log('channel Name--', channel);
                    let nameList: any = [];
                    finalParticipantIDs.forEach((ele: any) => {
                      if (allUsers) {
                        const user = allUsers.find(
                          (user: {id: any}) => user.id == ele?.broadCastUserId,
                        );
                        nameList.push(user?.name);
                        broadCastUserChannel.push({
                          ...user,
                          name: user?.name,
                          channelID: ele.channelID,
                          userId: ele?.broadCastUserId,
                        });
                      }
                    });

                    if (nameList.length !== 0) {
                      hydratedChannel.push({
                        ...channel,
                        name: channel?.name
                          ? channel?.name + ' BroadCast'
                          : '' + ' BroadCast',
                        // name: nameList.join(',') + ' BroadCast',
                        broadCastUserChannels: broadCastUserChannel,
                      });
                    }
                  } else if (channel.is_group) {
                    let findChannelData = channelParticipantSubscribe.find(
                      (ele: {channel: string | number}) =>
                        ele.channel === channel.id,
                    );
                    if (findChannelData) {
                      hydratedChannel.push({
                        ...findChannelData,
                        ...channel,
                      });
                    } else {
                      hydratedChannel.push(channel);
                    }
                  } else {
                    finalParticipantIDs.forEach((userID: any) => {
                      if (allUsers) {
                        const user = allUsers.find(
                          (user: {id: any}) => user.id == userID,
                        );
                        if (user) {
                          hydratedParticipants.push(user);
                        }
                      }
                    });
                    hydratedChannel.push({
                      ...channel,
                      ...hydratedParticipants[0],
                    });
                  }
                }
              }
            }
          },
        );

        updateChannelsStore(hydratedChannel);
      });
    } catch (e) {
      showLog('hydratedChannelErrorrr===>', e);
    }
  };
  const updateChannelsStore = async (hydratedChannel: any[]) => {
    const channels = hydratedChannel;
    if (channels) {
      const sortedChannels = channels.sort(function (a: any, b: any) {
        if (!a.lastMessageDate) {
          return 1;
        }
        if (!b.lastMessageDate) {
          return -1;
        }
        a = dayDate(a.lastMessageDate);
        b = dayDate(b.lastMessageDate);
        return a > b ? -1 : a < b ? 1 : 0;
      });
      // let result=await channelsWithNoBannedUsers(sortedChannels)

      dispatch(setChatList(sortedChannels));
    }
  };

  const onFriendItemPress = (friend: any) => {
    console.log('Friend Data--', JSON.stringify(friend));
    if (searchValue !== '') {
      setShowTextInput(false);
      setSearchValue('');
    }
    const id1: any = userId;
    const id2 = friend.id || friend.userID || friend.userId;
    if (id1 == id2) {
      return;
    }
    const channel = {
      id:
        friend.is_broadCast || friend.is_group
          ? friend.id
          : id1 < id2
          ? id1 + id2
          : id2 + id1,
      name: friend.name,
      participants: [friend],
    };

    dispatch(setChatChanneDetails(channel));
    navigation.navigate(SCREEN_NAMES.CHAT);
  };
  const listEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 200,
        }}>
        <Text style={{color: theme.colors.text, fontFamily: theme.fonts.regular}}>
          No chat found
        </Text>
      </View>
    );
  };
  const searchText = (txt: any) => {
    setSearchValue(txt);
    let userFilter = chatList.filter((ele: {name: any}) => {
      if (
        ele.name.search(txt.toUpperCase()) !== -1 ||
        ele.name.toUpperCase().search(txt.toUpperCase()) !== -1
      ) {
        return ele;
      }
    });
    setChanneFilter(userFilter);
  };

  const onLaunchCamera = (type: string) => {
    if (type === 'photo') {
      ImagePicker.openCamera({
        mediaType: type,
      }).then((image: any) => {
        let images = image;
        let source = images.path;
        if (source) {
          let splitSource = source.split('/');
          images.fileName = splitSource[splitSource.length - 1];
        }
        images.source = image.path;

        navigation.navigate(SCREEN_NAMES.PLAYER_LIST, {
          fromNavigation: FROM_NAVIGATION.BULK_DOCUMENT_SEND,
          mediaDetails: image,
        });
      });
    } else {
      launchCamera({
        mediaType: type,
        quality: 0.1,
      }).then((image: any) => {
        let images = {
          ...image?.assets[0],
        };
        if (images) {
          images.source = images.uri;
          images.mime = images.type;
          images.fileName = images.fileName;
        }

        navigation.navigate(SCREEN_NAMES.PLAYER_LIST, {
          fromNavigation: FROM_NAVIGATION.BULK_DOCUMENT_SEND,
          mediaDetails: images,
        });
      });
    }
  };

  return (
    <PageContainer>
      <KeyboardAvoidingView style={[styles.container]}>
        <HeaderFour
          searchValue={searchValue}
          searchPressBack={() => {
            setShowTextInput(!showTextInput);
            searchText('');
          }}
          searchCamera={
            () => cameraActionSheetRef.current.show()
            // onLaunchCamera()
          }
          showTextInput={showTextInput}
          searchText={txt => searchText(txt)}
          searchPress={() => {
            setShowTextInput(!showTextInput);
          }}
          title={users?.name}
          menuVisible={menuVisible}
          menuList={[
            CHAT_DETAILS_CONFIGURE.NEW_GROUP,
            CHAT_DETAILS_CONFIGURE.NEW_BRAOD_CAST,
            CHAT_DETAILS_CONFIGURE.LOG_OUT,
          ]}
          onPopUpShow={() => setMenuVisible(!menuVisible)}
          onPressMenu={data => {
            onPressMenu(data);
          }}
          onPressDeleteMessage={function (): void {
            throw new Error('Function not implemented.');
          }}
          onPress={function (): void {
            throw new Error('Function not implemented.');
          }}></HeaderFour>
        <FlatList
          data={channelFilter}
          keyboardShouldPersistTaps="always"
          ListEmptyComponent={listEmptyComponent}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={{height: 80}}
                // onLongPress={()=>Alert.alert("loangPress")}
                onPress={() => onFriendItemPress(item)}>
                <Grid style={{maxHeight: 80}}>
                  <Col
                    style={{
                      width: 80,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{
                        width: 65,
                        height: 65,
                        borderRadius: 65,
                      }}
                      source={require('../../../Assets/Images/user.png')}
                      resizeMode="cover"
                    />
                  </Col>
                  <Col style={{marginLeft: 10}}>
                    <Row style={{alignItems: 'center'}}>
                      <Col>
                        <Text
                          style={{
                            fontFamily: theme.fonts.bold,
                            fontSize: theme.typography.subSubTitle,
                            color:theme.colors.text,
                          }}>
                          {getName(item)}
                        </Text>
                      </Col>
                      <Col style={{alignItems: 'flex-end', paddingEnd: 10}}>
                        <Text
                          style={{
                            color: theme.colors.secondaryText,
                            fontSize:theme.typography.label,
                            fontFamily: theme.fonts.regular,
                          }}>
                          {dayFormatwithUnix(item.lastMessageDate, 'HH,MM A')}
                        </Text>
                      </Col>
                    </Row>
                    <Row style={{marginTop: -5}}>
                      <View style={{flex: 0.8}}>
                        <Text
                          style={{
                            color: theme.colors.secondaryText,
                            fontSize: theme.typography.label,
                            fontFamily: theme.fonts.regular,
                          }}>
                          {getMessage(item)}
                        </Text>
                      </View>
                      <View style={{flex: 0.2}}>
                        {item.isExit !== true &&
                        item.blockedBy !== CHAT_OPTIONS.BOTH &&
                        item.blockedBy != users?.id &&
                        messageChannelCount?.[item.channelID] ? (
                          <View
                            style={{alignItems: 'flex-end', marginRight: 10}}>
                            <View
                              style={{
                                height: 20,
                                width: 20,
                                borderRadius: 20,
                                backgroundColor: 'red',
                              }}>
                              <Text
                                style={{
                                  alignItems: 'center',
                                  color: theme.colors.white,
                                  textAlign: 'center',
                                }}>
                                {messageChannelCount?.[item.channelID]}
                              </Text>
                            </View>
                          </View>
                        ) : null}
                        {item.mutedBy === userId ||
                        item.mutedBy === CHAT_OPTIONS.BOTH ? (
                          <VectorIcon name={'volume-mute'} size={20} type='Ionicons' color={theme.colors.text} />
                        ) : (
                          <></>
                        )}
                      </View>
                    </Row>
                  </Col>
                </Grid>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
        <ActionSheet
          ref={cameraActionSheetRef}
          title={'Photo Upload'}
          options={['photo', 'video', 'Cancel']}
          onPress={(optionIndex: any) => {
            if (optionIndex === 0) {
              onLaunchCamera('photo');
            } else if (optionIndex === 1) {
              onLaunchCamera('video');
            }
          }}
        />
        <ContactsFloatingIcon
          contactOnNavigation={async () => {
            //  let keyobject=await diffieHellManAlgorthim()

            // diffieHellManAlgorthim()
            // groupChatSimulation();
            // groupEncryption()
            navigation.navigate(SCREEN_NAMES.PLAYER_LIST);

            // navigation.navigate(SCREEN_NAMES.GROUP_NAME_CHANGE)

            // navigation.navigate(SCREEN_NAMES.MESSAGE_INFO)

            // navigation.navigate(SCREEN_NAMES.ADD_NEW_GROUP_PERMISSIONS)
            // navigation.navigate(SCREEN_NAMES.GROUP_INFO)
            // navigation.navigate(SCREEN_NAMES.ADD_NEW_GROUP_PROFILE)
          }}></ContactsFloatingIcon>
      </KeyboardAvoidingView>
      </PageContainer>
  );
};

export default ChatList;
