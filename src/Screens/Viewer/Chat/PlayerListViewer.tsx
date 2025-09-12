import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import HeaderFive from '../../../Components/Header/HeaderFive';

import {GetTheme} from '../../../Constant/Colors';
import chatStyles from '../../Style/ChatListStyle';
import {FONTS} from '../../../Constant/Fonts';
import {getName} from '../../../Helper/common';
import ListComponent from '../../../Components/chat/ListComponents';
import {SCREEN_NAMES} from '../../../Constant/ScreenName';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TextInput} from 'react-native-gesture-handler';
import BottomInput from '../../../Components/chat/BottomInput';
import {FROM_NAVIGATION} from '../../../Constant/Constant';
import dynamicStyles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const Theme = GetTheme();

  const styles = chatStyles();
  const bottomStyles = dynamicStyles(null);

  const assets = {
    send: require('../../../Assets/Images/send.png'),
  };

  return (
    <SafeAreaView style={{flex:1}}>
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
      <ListComponent
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
              fontFamily: FONTS.OpenSans_Regular,
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
              <Image style={bottomStyles.inputIcon} source={assets.send} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PlayerListViewer;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'white',
//     flex: 1,
//   },
//   header: {
//     width: '100%',
//     height: 60,
//     backgroundColor: 'white',
//     elevation: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     color: 'purple',
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   userItem: {
//     width: Dimensions.get('window').width - 50,
//     alignSelf: 'center',
//     marginTop: 20,
//     flexDirection: 'row',
//     height: 60,
//     borderWidth: 0.5,
//     borderRadius: 10,
//     paddingLeft: 20,
//     alignItems: 'center',
//   },
//   userIcon: {
//     width: 40,
//     height: 40,
//   },
//   name: { color: 'black', marginLeft: 20, fontSize: 20 },
// });
