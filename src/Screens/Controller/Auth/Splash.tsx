import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Paths} from '../../../Constant/ScreenName';

import SplashScreen from 'react-native-splash-screen';
import {STORAGE} from '../../../chat-services/StorageHelper';
import {setChatList, setUser, setUserList} from '../../../redux/chatSlice';
import {useDispatch} from 'react-redux';
import {channelManager, firebaseStorage, firebaseUser} from '../../../chat-firebase';
import {useAuth} from '../../../Router/Context/Auth';
import {showLog} from '../../../chat-services/common';
import {getAllUserList} from '../../../chat-firebase/user';
import { dayDate, getData, PageContainer } from 'react-native-dex-moblibs';
import { Dimensions, ImageBackground } from 'react-native';
const { height, width } = Dimensions.get('window');

const SplashScreenController: React.FC = () => {
  const navigation = useNavigation<any>();

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
  const dispatch = useDispatch();

  useEffect(() => {
    getUsers();
  }, []);

  const getStored = async () => {
    let name: string | null = (await getData(STORAGE.NAME)) || null;
    let email: string | null = (await getData(STORAGE.EMAIL)) || null;
    let userId: string | null = (await getData(STORAGE.USERID)) || null;
    let users: any = {
      name: name,
      id: userId,
      userID: userId,
      email: email,
    };
    let result = await getAllUserList(email);
    dispatch(setUserList([...result]));
    dispatch(setUser(users));
    return true;
  };

  // const getUsers = async () => {
  //  await  getStored()

  // };

  // const getUsers = async () => {
  //   getStored();
  //   const userId: any = (await getData(STORAGE.USERID)) || null;

  //   firebaseUser.subscribeUsers((data: any) => {
  //     setOrUpdateUsers(data);
  //   });

  //   channelManager.subscribeChannelParticipationWithOutSnapShots(
  //     userId,
  //     (participations: any) => {
  //       setOrUpdateChannelParticipants(participations);
  //     },
  //   );

  //   channelManager.subscribeChannelsWithOutSnapShots((data: any) => {
  //     setOrUpdateChannelsSubscribe(data);
  //     channelManager.channelMessageStatusWithOutSnapShots(
  //       userId,
  //       (messageCount: any) => {
  //         setChannelCount(messageCount);
  //       },
  //     );
  //   });

  //   if (userId) {
  //     navigation.navigate(SCREEN_NAMES.CHAT_LIST);
  //   } else {
  //     navigation.navigate(SCREEN_NAMES.LOGIN);
  //   }
  //   SplashScreen.hide();
  // };
  const getUsers = async () => {
    const userId: any = (await getData(STORAGE.USERID)) || null;
    getStored();

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
      let participations = channelParticipantUnsubscribe??[]; 
      if (!channels || !allUsers || !participations) {
        return;
      }
      console.log("participations",participations)
      const myChannels = channels.filter((channel: {id: any}) =>
        participations?.find(
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
              let findChannelData = channelParticipantSubscribe?.find(
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
                        const user = allUsers?.find(
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
                    let findChannelData = channelParticipantSubscribe?.find(
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
                        const user = allUsers?.find(
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
      showLog('hydratedChannelErrorrr===> splash', e.message);
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

    if (userId) {
      navigation.navigate(Paths.CHAT_LIST);
    } else {
      navigation.navigate(Paths.LOGIN);
    }
    SplashScreen.hide();
  };

  return <PageContainer/>
};

export default SplashScreenController;
