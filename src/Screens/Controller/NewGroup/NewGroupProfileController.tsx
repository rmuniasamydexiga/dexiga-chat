import {Alert} from 'react-native';
import React, {useEffect, useState} from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';

import {SCREEN_NAMES} from '../../../Constant/ScreenName';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectGroupPermission,
  selectUser,
  setChatChanneDetails,
} from '../../../Redux/chat/reducers';
import NewGroupProfileViewer from '../../Viewer/NewGroup/NewGroupProfileViewer';
import {
  broadcastPushNotificationsforGroup,
  creatNewGroup,
} from '../../../firebase/channel';
import {STORAGE, getData} from '../../../Helper/StorageHelper';

interface Props {
  user: any;
}
interface User {
  name: string;
  email: string;
}

const AddNewGroupProfileController: React.FC = () => {
  const route = useRoute<any>();
  const [groupName, setGroupName] = useState('');
  const [groupSletecedUser, setGroupSletecedUser] = useState([]);
  const selectPermission = useSelector(selectGroupPermission);
  const navigation = useNavigation<any>();
  const users = route?.params?.users;
  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const createGroup = async () => {
    if (groupName?.trim() === '') {
      Alert.alert('Kindly Enter Group Name');
    } else {
      let userId: any = await getData(STORAGE.USERID);

      let result = await creatNewGroup(
        groupSletecedUser,
        userId,
        groupName,
        selectPermission,
        user,
      );

      if (result.status) {
        broadcastPushNotificationsforGroup(
          `${user.name} Create a New Group to You ${groupName}`,
          null,
          groupSletecedUser,
          {name: groupName},
          users,
        );
        const channel = {
          id: result?.data?.id,
          name: groupName,
          participants: [result?.data],
        };
        dispatch(setChatChanneDetails(channel));
        navigation.navigate(SCREEN_NAMES.CHAT);
      }
    }
  };
  useEffect(() => {
    if (route?.params?.groupSletecedUser) {
      setGroupSletecedUser(route?.params?.groupSletecedUser);
    }
  }, [route]);

  return (
    <NewGroupProfileViewer
      groupSletecedUser={groupSletecedUser}
      groupName={groupName}
      navigationGoback={() => navigation.goBack()}
      setgroupName={data => setGroupName(data)}
      contactOnNavigation={() => createGroup()}
      navigatePermissions={() =>
        navigation.navigate(SCREEN_NAMES.ADD_NEW_GROUP_PERMISSIONS)
      }
    />
  );
};

export default AddNewGroupProfileController;
