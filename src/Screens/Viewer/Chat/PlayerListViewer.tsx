import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';


import {SCREEN_NAMES} from '../../../Constant/ScreenName';

import dynamicStyles from './styles';
import { PageContainer, useAssets,HeaderFive ,ChatUserList,chatStyles} from 'react-native-dex-moblibs';

interface IPlayerListViewer {
  users: any;
  onFriendItemPress: (item: any) => void;
  navigstionBack: () => void;
  searchPress: () => void;
  searchText: (txt: string) => void;
  showTextInput: boolean;
  searchPressBack: () => void;
  selectedUser: any;
  fromNavigation: string;
  selctedName: string;
  chatList: any;
  onSend: () => void;
  user: any;
}

const PlayerListViewer: React.FC<IPlayerListViewer> = props => {
  const {
    users,
    onFriendItemPress,
    navigstionBack,
    searchPress,
    showTextInput,
    searchText,
    searchPressBack,
    fromNavigation,
    selectedUser,
    selctedName,
    onSend,
    chatList,
    user,
  } = props;

  const styles = chatStyles();
  const bottomStyles = dynamicStyles(null);

  const {images}=useAssets()

  return (
    <PageContainer>
    <KeyboardAvoidingView style={[styles.container]}>
      <HeaderFive
        title={'Select Contact'}
        subTitle={users.length + ' contacts'}
        showTextInput={showTextInput}
        searchPressBack={() => searchPressBack()}
        searchText={txt => searchText(txt)}
        onPress={() => navigstionBack()}
        searchPress={() => searchPress()}
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
        fromNavigation={fromNavigation || SCREEN_NAMES.PLAYER_LIST}
        data={users}
        EmptyListMesage={'No Users Founds'}
        selectedUser={selectedUser}
        userId={user?.id}
        chatList={chatList}
        onFriendItemPress={data => onFriendItemPress(data)}
      />

      {selectedUser.length !== 0 && (
        <View style={bottomStyles.TypeMessageInput}>
          <Text
            style={{
              width: '85%',
              padding: 10,
              justifyContent: 'center',
              fontFamily: theme.fonts.regular,
            }}>
            {selctedName}
          </Text>

          <View
            style={{
              alignItems: 'center',
              width: '15%',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={onSend}
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

export default PlayerListViewer;


