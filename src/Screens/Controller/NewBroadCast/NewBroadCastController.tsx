import React, {useEffect, useState} from 'react';

import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {SCREEN_NAMES} from '../../../Constant/ScreenName';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectChatList,
  selectUser,
  selectUserList,
  setChatChanneDetails,
} from '../../../redux/chatSlice';
import AddNewBroadCastViewer from '../../Viewer/Newbroadcast/Newbroadcast';
import {CHAT_DETAILS_CONFIGURE} from '../../../Constant/Constant';
import {createNewBroadCast} from '../../../chat-firebase/channel';
import {BackHandler, Keyboard} from 'react-native';
import {STORAGE} from '../../../chat-services/StorageHelper';

interface Props {
  user: any;
}
interface User {
  name: string;
  email: string;
}

const AddNewBroadCastController: React.FC = () => {
  const usersList = useSelector(selectUserList);

  const [userFilter, setUserFilter] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [broadcastName, setBroadcastName] = useState<string>('');
  const navigation = useNavigation<any>();
  const [selectedBroadCast, setSelectedBroadCast] = useState([]);
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const chatList = useSelector(selectChatList);
  const user = useSelector(selectUser);

  useEffect(() => {
    setSelectedBroadCast([]);
    setUserFilter(usersList);
  }, []);

  useEffect(() => {
    if (route?.params?.groupParticpantsList) {
      setSelectedBroadCast([...route?.params?.groupParticpantsList]);
    }
  }, [route]);

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

  const onFriendItemPress = (friend: any) => {
    let selectBroadCastList = selectedBroadCast;
    if (showTextInput) {
      searchText('');
    }
    if (!selectBroadCastList.find(ele => ele.userId === friend?.userId)) {
      selectBroadCastList.push(friend);
    } else {
      selectBroadCastList = selectedBroadCast.filter(ele => {
        return ele?.userId !== friend?.userId;
      });
    }

    setSelectedBroadCast([...selectBroadCastList]);
  };

  const removeSelectedContact = (friend: any) => {
    let selectBroadCastList = selectedBroadCast.filter(ele => {
      return ele?.userId !== friend?.userId;
    });

    setSelectedBroadCast([...selectBroadCastList]);
  };

  const createBroadCast = async () => {
    // selectedBroadCast
    console.log('Chanel', broadcastName);
    let result = await createNewBroadCast(
      selectedBroadCast,
      user?.userId || user?.userID || user?.id,
      broadcastName,
    );
    console.log('result', JSON.stringify(result));
    if (result.status) {
      let name = selectedBroadCast.map(ele => ele?.name);
      const channel = {
        id: result.data.id,
        is_broadCast: true,
        // name: name.join(',') + ' BroadCast',
        name: broadcastName + ' BroadCast',
        participants: [result.data],
      };

      dispatch(setChatChanneDetails(channel));
      navigation.navigate(SCREEN_NAMES.CHAT);
    }
  };

  const searchText = (txt: any) => {
    setSearchValue(txt);
    let userFilter = usersList.filter(ele => {
      if (
        ele.name.search(txt.toUpperCase()) !== -1 ||
        ele.name.toUpperCase().search(txt.toUpperCase()) !== -1
      ) {
        return ele;
      }
    });
    setUserFilter(userFilter);
  };
  return (
    <AddNewBroadCastViewer
      usersList={userFilter}
      chatList={chatList}
      searchValue={searchValue}
      user={user}
      searchPressBack={() => {
        setShowTextInput(!showTextInput);
        searchText('');
      }}
      showTextInput={showTextInput}
      searchText={txt => searchText(txt)}
      searchPress={() => {
        setShowTextInput(!showTextInput);
      }}
      groupParticpantsList={[]}
      fromNavigation={route?.params?.fromNavigation || null}
      title={
        route?.params?.fromNavigation === SCREEN_NAMES.BROADCAST_INFO
          ? 'Edit recipients'
          : CHAT_DETAILS_CONFIGURE.NEW_BRAOD_CAST
      }
      removeSelectedContact={(data: any) => removeSelectedContact(data)}
      contactOnNavigation={() => {
        if (route?.params?.fromNavigation === SCREEN_NAMES.BROADCAST_INFO) {
          navigation.navigate(SCREEN_NAMES.BROADCAST_INFO, {
            groupSletecedUser: selectedBroadCast,
          });
        } else {
          createBroadCast();
        }
      }}
      selectedBroadCast={selectedBroadCast}
      navigstionBack={() => navigation.goBack()}
      onFriendItemPress={(item: any) => onFriendItemPress(item)}
      setBroadcastName={txt => setBroadcastName(txt)}
    />
  );
};

export default AddNewBroadCastController;
