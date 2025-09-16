import {Alert} from 'react-native';
import React, {useEffect, useState} from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';

import {SCREEN_NAMES} from '../../../Constant/ScreenName';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectGroupPermission,
  selectUser,
  setChatChanneDetails,
} from '../../../redux/chatSlice';
import {
  broadcastPushNotificationsforGroup,
  creatNewGroup,
} from '../../../chat-firebase/channel';
import {STORAGE} from '../../../chat-services/StorageHelper';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';

import {WIDTH} from '../../../Constant/Constant';

import {getName} from '../../../chat-services/common';
import { HeaderSeven,PageContainer,ContactsFloatingIcon, VectorIcon, useStylesheet, useAssets, getData } from 'react-native-dex-moblibs';

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
  const {images}=useAssets()
const {theme}=useStylesheet()
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
      <PageContainer>
          <HeaderSeven
            title={'New Group'}
            onPress={() => navigation.goBack()}
            menuVisible={false}
            menuList={[]}
            subTitle={''}
            onPressMenu={function (data: string): void {
              throw new Error('Function not implemented.');
            }}
            onPressDeleteMessage={function (): void {
              throw new Error('Function not implemented.');
            }}></HeaderSeven>
          <View style={{flex: 0.15, margin: 10}}>
            <TouchableOpacity style={{flexDirection: 'row'}}>
              <View style={{flex: 0.15}}>
                <ImageBackground
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 45,
                  }}
                  source={images['chat-user']}
                  resizeMode="cover"></ImageBackground>
              </View>
              <View style={{flex: 0.7, marginTop: 10}}>
                <TextInput
                  value={groupName}
                  placeholderTextColor={theme.colors.text}
                  onChangeText={text => setGroupName(text)}
                  style={{
                    color: theme.colors.text,
                    paddingBottom: 10,
                    borderBottomWidth: 2,
                    borderColor: theme.colors.borderColor,
                    fontFamily: theme.fonts.regular,
                  }}
                  placeholder={'Enter the Group Name'}></TextInput>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 0.1,
              margin: 5,
              borderRadius: 2,
              elevation: 0.5,
              backgroundColor: theme.colors.background,
            }}>
            <TouchableOpacity
              style={{flex: 1, marginLeft: 10, flexDirection: 'row'}}
              onPress={() => navigation.navigate(SCREEN_NAMES.ADD_NEW_GROUP_PERMISSIONS)}>
              <View style={{flex: 0.9, justifyContent: 'center'}}>
                <Text
                  style={{fontFamily: theme.fonts.regular, color: theme.colors.text}}>
                  Group Permissions
                </Text>
              </View>
              <View style={{flex: 0.1, justifyContent: 'center'}}>
                <VectorIcon name={'settings'} color={theme.colors.text} size={18} type='Feather'></VectorIcon>
                </View>
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.6}}>
            <Text
              style={{
                margin: 10,
                fontFamily: theme.fonts.regular,
                color: theme.colors.text,
              }}>{`Particpant : ${groupSletecedUser.length}`}</Text>
            <FlatList
              numColumns={4}
              data={groupSletecedUser}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={{height: 80}}
                    // onLongPress={()=>Alert.alert("loangPress")}
                    // onPress={() => onFriendItemPress(item)}
                  >
                    <Grid style={{maxHeight: 80}}>
                      <Col
                        // onPress={()=>removeSelectedContact(item)}
                        style={{
                          width: WIDTH / 4,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <ImageBackground
                          style={{
                            width: 55,
                            height: 55,
                            borderRadius: 55,
                          }}
                          source={images['chat-user']}
                          resizeMode="cover"></ImageBackground>
                        <Text
                          style={{
                            fontSize: theme.typography.label,
                            fontFamily: theme.fonts.regular,
                            color: theme.colors.text,
                          }}
                          numberOfLines={2}>
                          {getName(item)}
                        </Text>
                      </Col>
                    </Grid>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <ContactsFloatingIcon
            name="arrow-right-thin"
            contactOnNavigation={() =>
              // saveFIle()
            createGroup()
            }></ContactsFloatingIcon>
        </PageContainer>
    );

 

};

export default AddNewGroupProfileController;
