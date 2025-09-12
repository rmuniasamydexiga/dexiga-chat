import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {SCREEN_NAMES} from '../../../Constant/ScreenName';
import {useDispatch, useSelector} from 'react-redux';
import AddNewBroadCastViewer from '../../Viewer/Newbroadcast/Newbroadcast';
import {
  CHAT_DETAILS_CONFIGURE,
  ERROR_MESSAGE_CONTENT,
} from '../../../Constant/Constant';
import {STORAGE, getData} from '../../../Helper/StorageHelper';
import {
  selectChatList,
  selectUser,
  selectUserList,
} from '../../../Redux/chat/reducers';
import {Alert} from 'react-native';
import {checkPlayerBlockOrNot} from '../../../Helper/common';

interface Props {
  user: any;
}
interface User {
  name: string;
  email: string;
}

const AddNewGroupController: React.FC = () => {
  const users = useSelector(selectUserList);
  const navigation = useNavigation<any>();
  const [userFilter, setUserFilter] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const route = useRoute<any>();
  const [selectedBroadCast, setSelectedBroadCast] = useState([]);
  const [userId, setUserId] = useState<String | null>(null);
  const chatList = useSelector(selectChatList);
  const user = useSelector(selectUser);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    setUserFilter(users);
  }, []);

  useEffect(() => {
    setSelectedBroadCast([]);

    getMode();
  }, [isFocused]);

  const getMode = async () => {
    let userId: string = (await getData(STORAGE.USERID)) || '';
    setUserId(userId);
  };

  // const getUsers = async () => {
  // let   id = await getData(STORAGE.USERID)||''
  //   const email =await  getData(STORAGE.EMAIL)|| '';
  //   const tempData: User[] = [];
  //   firestore()
  //     .collection('users')
  //     .where('email', '!=', email)
  //     .get()
  //     .then((res: { docs: any[]; }) => {

  //       res.docs.forEach(item => {
  //         tempData.push(item.data() as User);
  //       });
  //       setUserFilter(tempData)

  //       setUsers(tempData);
  //     });
  // };
  const onFriendItemPress = (friend: any) => {
    let i = 1;
    if (
      checkPlayerBlockOrNot(chatList, userId, friend.userId) !==
      ERROR_MESSAGE_CONTENT.UN_BLOCK_CHAT
    ) {
      if (showTextInput) {
        searchText('');
      }

      let selectBroadCastList = selectedBroadCast;
      if (!selectBroadCastList.find(ele => ele.userId === friend?.userId)) {
        selectBroadCastList.push(friend);
      } else {
        selectBroadCastList = selectedBroadCast.filter(ele => {
          return ele?.userId !== friend?.userId;
        });
      }

      setSelectedBroadCast([...selectBroadCastList]);
    } else {
      Alert.alert('', ERROR_MESSAGE_CONTENT.UN_BLOCK_ARE_YOU, [
        {
          text: 'cancel',
          onPress: () => null,
        },
        {
          text: 'ok',
          onPress: () => null,
        },
      ]);
    }
  };

  const removeSelectedContact = (friend: any) => {
    let selectBroadCastList = selectedBroadCast.filter(ele => {
      return ele?.userId !== friend?.userId;
    });

    setSelectedBroadCast([...selectBroadCastList]);
  };

  const createNewGroup = () => {
    if (route?.params?.formNavigation === SCREEN_NAMES.GROUP_INFO) {
      let selectedBroadCasts = selectedBroadCast;
      setSelectedBroadCast([]);
      navigation.navigate(SCREEN_NAMES.GROUP_INFO, {
        groupSletecedUser: selectedBroadCasts,
        users: users,
      });
    } else {
      navigation.navigate(SCREEN_NAMES.ADD_NEW_GROUP_PROFILE, {
        groupSletecedUser: selectedBroadCast,
        users: users,
      });
    }
  };

  const searchText = (txt: any) => {
    setSearchValue(txt);
    let userFilter = users.filter(ele => {
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
      searchPressBack={() => {
        setShowTextInput(!showTextInput);
        searchText('');
      }}
      showTextInput={showTextInput}
      searchText={txt => searchText(txt)}
      searchPress={() => {
        setShowTextInput(!showTextInput);
      }}
      groupParticpantsList={route?.params?.groupParticpantsList || []}
      title={
        route?.params?.formNavigation === SCREEN_NAMES.GROUP_INFO
          ? 'Add Participants'
          : CHAT_DETAILS_CONFIGURE.NEW_GROUP
      }
      removeSelectedContact={(data: any) => removeSelectedContact(data)}
      contactOnNavigation={() => createNewGroup()}
      selectedBroadCast={selectedBroadCast}
      navigstionBack={() => navigation.goBack()}
      onFriendItemPress={(item: any) => onFriendItemPress(item)}
      user={user}
      fromNavigation={null}
    />
  );
};

export default AddNewGroupController;
