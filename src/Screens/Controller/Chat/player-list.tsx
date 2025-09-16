import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {Paths} from '../../../Constant/ScreenName';
import {useDispatch, useSelector} from 'react-redux';
import {
  reSetBulkChatSendList,
  selectChatList,
  selectUser,
  selectUserList,
  selectedBulkChatSendList,
  setBulkChatSendList,
  setChatChanneDetails,
  setInternalFileList,
} from '../../../redux/chatSlice';
import {STORAGE} from '../../../chat-services/StorageHelper';

import {
  ERROR_MESSAGE_CONTENT,
  FROM_NAVIGATION,
  MAXIMUM_FILE_SIZE,
  MESSAGE_TYPE,
  SNACKBAR_MESSAGE_LENGTH,
} from '../../../Constant/Constant';
import {Alert, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View} from 'react-native';
import {directoryTOSaveFile, readInternalFileName} from '../../../chat-services/MediaHelper';
import {channelManager, firebaseStorage} from '../../../chat-firebase';
import {useAuth} from '../../../Router/Context/Auth';
import {
  checkPlayerBlockOrNot,
  getFileSizeLimit,
} from '../../../chat-services/common';
import Snackbar from 'react-native-snackbar';
import { chatStyles, ChatUserList, dynamicStyles, getData, HeaderFive, PageContainer, snackBarMessage, useAssets, useStylesheet } from 'react-native-dex-moblibs';


interface User {
  name: string;
  email: string;
}

const PlayerListController: React.FC = () => {
  const users = useSelector(selectUserList);
  const user = useSelector(selectUser);
  const chatList = useSelector(selectChatList);

  const navigation = useNavigation<any>();
  const [userId, setUserId] = useState<String | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [userFilter, setUserFilter] = useState<User[]>([]);
  const isFocused = useIsFocused();

  const bulkChatSendList = useSelector(selectedBulkChatSendList);
  const route = useRoute<any>();
  const dispatch = useDispatch();
    const styles = chatStyles();
    const bottomStyles = dynamicStyles(null);
    const {theme}=useStylesheet()
  
    const {images}=useAssets()

  useEffect(() => {
    // getUsers();
    setUserFilter(users);
  }, []);

  useEffect(() => {
    getMode();
  }, [isFocused]);

  const getMode = async () => {
    let userId = (await getData(STORAGE.USERID)) || null;
    setUserId(userId);
  };

  const searchText = (txt: any) => {
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
  const onFriendItemPress = (friend: any) => {
    const id1: any = userId;
    const id2 = friend.id || friend.userID || friend.userId;
    if (id1 == id2) {
      return;
    }
    if (
      checkPlayerBlockOrNot(chatList, userId, friend.userId) !==
      ERROR_MESSAGE_CONTENT.UN_BLOCK_CHAT
    ) {
      const channel = {
        id: id1 < id2 ? id1 + id2 : id2 + id1,
        name: friend.name,
        userId: id2,
        participants: [friend],
      };
      if (
        route?.params?.fromNavigation === FROM_NAVIGATION.BULK_DOCUMENT_SEND
      ) {
        let bulkChatList = bulkChatSendList;

        let findData = bulkChatList.find(
          (ele: {id: any}) => ele.id === channel.id,
        );

        let fileteData = bulkChatList.filter(
          (ele: {id: any}) => ele.id !== channel.id,
        );
        if (!findData) {
          if (bulkChatList.length < 6) {
            fileteData.push({...channel});
          } else {
            Alert.alert('You can send only 5 chats');
          }
        }
        dispatch(setBulkChatSendList(fileteData));
      } else {
        dispatch(setChatChanneDetails(channel));

        navigation.navigate(Paths.CHAT);
      }
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

  const getSelecteName = (chatList: any) => {
    let name: any = [];
    chatList.forEach(element => {
      name.push(element.name);
    });
    return name.join(',');
  };
  const sendMediaMessage = () => {
    let image = route?.params?.mediaDetails;
    let source = image?.source;
    directoryTOSaveFile(image);
    const filename =
      new Date() + '-' + source.substring(source.lastIndexOf('/') + 1);
    const uploadUri =
      Platform.OS === 'ios' ? source.replace('file://', '') : source;
    if (getFileSizeLimit(image.size)) {
      firebaseStorage.uploadFileWithProgressTracking(
        filename,
        uploadUri,
        async (snapshot: {bytesTransferred: number; totalBytes: number}) => {
          const uploadProgress1 =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        async (url: any, fileInfo: any) => {
          bulkChatSendList.forEach(
            (element: {id: any; participants: any[]}) => {
              channelManager.sendMessageForBulk(
                user,
                element,
                '',
                url,
                null,
                image.mime.startsWith('image') === true
                  ? MESSAGE_TYPE.IMAGE
                  : MESSAGE_TYPE.VIDEO,
                image.fileName,
                fileInfo,
              );
            },
          );

          dispatch(reSetBulkChatSendList([]));
          let readInternalFile = readInternalFileName();
          dispatch(setInternalFileList(readInternalFile));
        },
        (error: any) => {
          Alert.alert('Oops! An error has occured. Please try again.');
        },
      );
      navigation.navigate(Paths.CHAT_LIST);
    } else {
      snackBarMessage(
        'File Size is To High Please Upload' + ' ' + MAXIMUM_FILE_SIZE + ' Mb',
        SNACKBAR_MESSAGE_LENGTH.SHORT,
      );
    }
  };
  
    return (
      <PageContainer>
      <KeyboardAvoidingView style={[styles.container]}>
        <HeaderFive
          title={'Select Contact'}
          subTitle={userFilter.length + ' contacts'}
          showTextInput={showTextInput}
          searchPressBack={() => {
              setShowTextInput(!showTextInput);
        searchText('');
          }}
          searchText={txt => searchText(txt)}
          onPress={() => {
        navigation.goBack();
        return true;
          }}
          searchPress={() => {
                    setShowTextInput(!showTextInput);

          }}
          menuVisible={false}
          menuList={[]}
          isHideDot={true}
          onPressMenu={function (data: string): void {
            throw new Error('Function not implemented.');
          } }
          onPressDeleteMessage={function (): void {
            throw new Error('Function not implemented.');
          } } onPressmenuVisible={function (): void {
            throw new Error('Function not implemented.');
          } } isHideSearch={false}      />
        <ChatUserList
          fromNavigation={route?.params?.fromNavigation || Paths.PLAYER_LIST}
          data={userFilter}
          EmptyListMesage={'No Users Founds'}
          selectedUser={bulkChatSendList}
          userId={user?.id}
          chatList={chatList}
          onFriendItemPress={data => onFriendItemPress(data)}
        />
  
        {bulkChatSendList.length !== 0 && (
          <View style={bottomStyles.TypeMessageInput}>
            <Text
              style={{
                width: '85%',
                padding: 10,
                justifyContent: 'center',
                fontFamily: theme.fonts.regular,
              }}>
              {getSelecteName(bulkChatSendList)}
            </Text>
  
            <View
              style={{
                alignItems: 'center',
                width: '15%',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={()=>sendMediaMessage()}
                style={[bottomStyles.inputIconContainer]}>
                <Image style={bottomStyles.inputIcon} source={images.send} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
      </PageContainer>
    );
    

};

export default PlayerListController;
