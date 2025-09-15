import React, {useEffect, useRef, useState} from 'react';
import {GROUP_PERMISSIONS} from '../../../Constant/Constant';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectChannelGroupParticipants,
  selectDocumentList,
  selectMediaList,
  selectUser,
  selectedChannelDetails,
  setChatChanneDetails,
  setParticipantsList,
  setPermssions,
} from '../../../redux/chatSlice';
import GroupInfoViewer from '../../Viewer/NewGroup/GroupInfoViewer';
import {SCREEN_NAMES} from '../../../Constant/ScreenName';
import {
  blockChat,
  makeAdmin,
  onLeaveGroup,
  persistChannelParticipations,
  updateBroadCast,
} from '../../../chat-firebase/channel';
import {channelManager} from '../../../chat-firebase';
import {useAuth} from '../../../Router/Context/Auth';
import BroadCastInfoViewer from '../../Viewer/Newbroadcast/BroadCastInfoViewer';
import {BackHandler} from 'react-native';
import IndividualChatInfoViewer from '../../Viewer/Chat/IndividualChatInfoViewer';
import {showLog} from '../../../chat-services/common';

interface Props {
  user: any;
}
interface User {
  name: string;
  email: string;
}

const IndividualChatInfoController: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const channel = useSelector(selectedChannelDetails);
  const users = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [selectedUser, SetSelectedUser] = useState({});
  const mediaList = useSelector(selectMediaList);
  const documentList = useSelector(selectDocumentList);

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

    setIsLoading(true);
  };
  const navigateBlockChat = async (data: string | undefined) => {
    let result = await blockChat(channel, users?.id, data);
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
    <IndividualChatInfoViewer
      channel={channel}
      mediaList={mediaList}
      documentList={documentList}
      groupParticpantsList={
        channel?.participants?.[0]?.broadCastUserChannels || []
      }
      users={users}
      selecteandUnselect={(data: any) => null}
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
        }
      }}
      navigationMediaInfoPress={data =>
        navigation.navigate(SCREEN_NAMES.MEDIA_VIEWER, {data: data})
      }
      onGroupSettingsActionDone={() =>
        showLog('onGroupSettingsActionDoneonGroupSettingsActionDone', '')
      }
      navigateBlockChat={(data: string | undefined) => navigateBlockChat(data)}
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

export default IndividualChatInfoController;
