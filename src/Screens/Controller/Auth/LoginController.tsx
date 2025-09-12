import React, {FC, useEffect, useState} from 'react';
import {Alert, BackHandler} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {SCREEN_NAMES} from '../../../Constant/ScreenName';
import Login from '../../Viewer/Auth/Login';
import firestore from '@react-native-firebase/firestore';
import {firebaseAuth} from '../../../firebase';
import {USER_TYPE} from '../../../Constant/Constant';
import {STORAGE, getData, setData} from '../../../Helper/StorageHelper';
import {setChatList, setUser, setUserList} from '../../../Redux/chat/reducers';
import {useDispatch} from 'react-redux';
import {signInValidationSchema, validation} from '../../../Helper/validation';
import {useAuth} from '../../../Router/Context/Auth';
import {channelManager, firebaseStorage, firebaseUser} from '../../../firebase';
import {dayDate} from '../../../Helper/DayHelper';
import {showLog} from '../../../Helper/common';
import {getAllUserList} from '../../../firebase/user';

const LoginController: FC = props => {
  const navigation: any = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const dispatch = useDispatch();
  const [userInputs, setUserInputs] = useState({
    // email: 'sruveena@gmail.com',
    // password: 'Sruveena@123',
    email: 'maanvi@gmail.com',
    password: 'Maani1#+678',
    userType: USER_TYPE.HOST,
  });

  const {
    setOrUpdateUsers,
    setOrUpdateChannelsSubscribe,
    setOrUpdateChannelParticipants,
    setChannelCount,
    channelParticipantSubscribe,
  } = useAuth();

  // const navigation=useNavigation()

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        BackHandler.exitApp();
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
    apiCall();
  }, []);
  const apiCall = async () => {
    let userId = await getData(STORAGE.USERID);

    if (userId) {
      firebaseAuth.fetchAndStorePushTokenIfPossible({
        id: userId,
        userID: userId,
      });
      navigation.navigate(SCREEN_NAMES.CHAT_LIST);
    }
  };
  const valueValidation = (value: any, type: string) => {
    if (type === 'EMAIL') {
      setUserInputs({
        ...userInputs,
        email: value,
      });
    } else {
      setUserInputs({
        ...userInputs,
        password: value,
      });
    }
    if (errors) {
      checkValidation();
    }
  };

  const checkValidation = async () => {
    let validationResult = await validation(signInValidationSchema, userInputs);
    if (validationResult.status) {
      setErrors(null);
    } else {
      setErrors(validationResult?.error);
    }
  };

  const loginFun = async () => {
    try {
      let validationResult = await validation(
        signInValidationSchema,
        userInputs,
      );
      if (validationResult.status) {
        setErrors(null);
        setIsLoading(true);
        firestore()
          .collection('users')
          .where('email', '==', userInputs.email)
          .get()
          .then(
            (res: {
              docs: {data: () => {(): any; new (): any; userId: string}}[];
            }) => {
              if (res.docs !== []) {
                firebaseAuth.fetchAndStorePushTokenIfPossible({
                  id: res.docs[0].data().userId,
                  userID: res.docs[0].data().userId,
                });
                if (res.docs[0].data().password === userInputs.password) {
                  setUserInputs({
                    email: '',
                    password: '',
                    userType: '',
                  });
                  if (res.docs[0].data().userType === userInputs.userType) {
                    let name: string | null = res.docs[0].data().name;
                    let email: string | null = res.docs[0].data().email;
                    let userId: string | null = res.docs[0].data().userId;
                    let users: any = {
                      name: name,
                      id: userId,
                      userID: userId,
                      email: email,
                    };
                    dispatch(setUser(users));
                    goToNext(
                      res.docs[0].data().name,
                      res.docs[0].data().email,
                      res.docs[0].data().userId,
                    );
                  } else {
                    Alert.alert('User not found');
                  }
                } else {
                  Alert.alert('Wrong Password');
                }
              } else {
                Alert.alert('User not found');
              }
            },
          )
          .catch((error: any) => {
            setIsLoading(false);

            Alert.alert('User not found');
          });
      } else {
        setErrors(validationResult?.error);
      }
    } catch (e) {
      Alert.alert('Error', (e as Error).message, [{text: 'OK'}]);
    }
    //navigation.navigate(SCREEN_NAMES.CHAT_LIST)
  };

  const goToNext = async (name: string, email: string, userId: string) => {
    await setData(STORAGE.NAME, name);
    await setData(STORAGE.EMAIL, email);
    await setData(STORAGE.USERID, userId);
    let result = await getAllUserList(email);
    dispatch(setUserList([...result]));
    await getUsers();
  };

  const getUsers = async () => {
    const userId: any = (await getData(STORAGE.USERID)) || null;
    const subscribeUsers = firebaseUser.subscribeUsersWithoutCallBack();
    const subscribeChannelParticipation =
      channelManager.subscribeChannelParticipationWithOutSnapShots(userId);
    const subscribeChannels =
      channelManager.subscribeChannelsWithOutSnapShots();
    const messageCount =
      channelManager.channelMessageStatusWithOutSnapShots(userId);

    Promise.all([
      subscribeUsers,
      subscribeChannelParticipation,
      subscribeChannels,
      messageCount,
    ])
      .then(([usersData, participations, channelsData, messageCount]) => {
        setOrUpdateUsers(usersData);
        setOrUpdateChannelParticipants(participations);
        setOrUpdateChannelsSubscribe(channelsData);
        setChannelCount(messageCount);
        hydrateChannelsIfNeeded(usersData, channelsData, participations);
      })
      .catch(error => {
        console.error('Error in Promise.all: ', error);
      });
  };
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
                        name: nameList.join(',') + ' BroadCast',
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
    let userId: string | null = (await getData(STORAGE.USERID)) || null;
    setIsLoading(false);

    if (userId) {
      navigation.navigate(SCREEN_NAMES.CHAT_LIST);
    } else {
      navigation.navigate(SCREEN_NAMES.LOGIN);
    }
  };

  return (
    <Login
      loginErrors={errors}
      selectedOption={userInputs.userType}
      userInputs={userInputs}
      valueValidation={(value, type) => valueValidation(value, type)}
      setOption={(option: string) => {
        if (errors) {
          checkValidation();
        }
        setUserInputs({
          ...userInputs,
          userType: option,
        });
      }}
      isLoading={isLoading}
      loginFun={() => loginFun()}
    />
  );
};

export default LoginController;
