import React, {useEffect, useState} from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectChatList,
  selectDocumentList,
  selectMediaList,
  selectUser,
  selectedChannelDetails,
  setChatChanneDetails,
  setChatList,
} from '../../../redux/chatSlice';
import {SCREEN_NAMES} from '../../../Constant/ScreenName';
import {deleteBraodCast, updateBroadCast} from '../../../chat-firebase/channel';

import BroadCastInfoViewer from '../../Viewer/Newbroadcast/BroadCastInfoViewer';
import {BackHandler} from 'react-native';
import {showLog} from '../../../chat-services/common';

interface Props {
  user: any;
}
interface User {
  name: string;
  email: string;
}

const BroadCastInfoController: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const channel = useSelector(selectedChannelDetails);
  const users = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [selectedUser, SetSelectedUser] = useState({});
  const mediaList = useSelector(selectMediaList);
  const documentList = useSelector(selectDocumentList);
  const chatList = useSelector(selectChatList);

  useEffect(() => {
    if (route?.params?.groupSletecedUser) {
      updateBroadCastUser(route?.params?.groupSletecedUser);
    }
  }, [route]);
  const updateBroadCastUser = async (groupSletecedUser: any) => {
    setIsLoading(true);
    let result = await updateBroadCast(
      groupSletecedUser,
      users?.id,
      channel?.id,
    );

    let tempChanel = {
      ...channel,
      participants: [
        {
          ...channel?.participants?.[0],
          broadCastUserChannels: result?.data?.broadCastUserChannels,
        },
      ],
    };

    dispatch(setChatChanneDetails(tempChanel));

    setIsLoading(false);
  };
  const navigateExitGroup = async () => {
    setIsLoading(true);
    let chatLists = chatList.filter(ele => ele.id !== channel.id);
    dispatch(setChatList(chatLists));
    let result = await deleteBraodCast(channel, users?.id, 'delete');

    setIsLoading(false);
    if (result) {
      navigation.navigate(SCREEN_NAMES.CHAT_LIST);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.goBack();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  return (
    <BroadCastInfoViewer
      channel={channel}
      mediaList={mediaList}
      documentList={documentList}
      isLoading={isLoading}
      groupParticpantsList={
        channel?.participants?.[0]?.broadCastUserChannels || []
      }
      users={users}
      selecteandUnselect={(data: any) => {}}
      navigationGoBack={() => navigation.navigate(SCREEN_NAMES.CHAT)}
      navigateMediaList={() => navigation.navigate(SCREEN_NAMES.MEDIA_LIST)}
      onFriendItemPress={(data: any) => {
        SetSelectedUser(data);
        if (data?.name === 'Edit recipients') {
          navigation.navigate(SCREEN_NAMES.ADD_NEW_BROAD_CAST, {
            fromNavigation: SCREEN_NAMES.BROADCAST_INFO,
            groupParticpantsList:
              channel?.participants?.[0]?.broadCastUserChannels,
          });
        } else {
          const id1: any = users.userID;
          const id2 = data?.id;
          if (id1 == id2) {
            return;
          }

          const channel = {
            id: id1 < id2 ? id1 + id2 : id2 + id1,
            name: data?.name,
            participants: [selectedUser],
          };
          dispatch(setChatChanneDetails(channel));
          navigation.navigate(SCREEN_NAMES.CHAT);
        }
      }}
      onGroupSettingsActionDone={() =>
        showLog('function broadCastInfoContoller', 'Not implemented')
      }
      navigateExitGroup={() => navigateExitGroup()}
      mode={''}
      selectedBroadCast={[]}
      navigstionBack={function (): void {
        throw new Error('Function not implemented.');
      }}
      contactOnNavigation={function (): void {
        throw new Error('Function not implemented.');
      }}
      removeSelectedContact={function (item: any): void {
        throw new Error('Function not implemented.');
      }}
      title={''}
      groupSletecedUser={undefined}
      groupPermissionData={undefined}
      selectedPermission={undefined}
      groupUserActionSheetRef={undefined}
      navigatePermissions={function (): void {
        throw new Error('Function not implemented.');
      }}
      selectedUser={undefined}
      isExit={false}
      groupUserDetails={undefined}
    />
  );
};

export default BroadCastInfoController;
