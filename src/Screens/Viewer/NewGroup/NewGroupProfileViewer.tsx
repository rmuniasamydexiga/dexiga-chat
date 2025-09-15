import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import {GetTheme} from '../../../Constant/Colors';

import {WIDTH} from '../../../Constant/Constant';
import HeaderSeven from '../../../Components/Header/HeaderSeven';
import Feather from 'react-native-vector-icons/Feather';
import {FONTS} from '../../../Constant/Fonts';
import {getName} from '../../../chat-services/common';
import { PageContainer,ContactsFloatingIcon } from 'react-native-dex-moblibs';

interface User {
  name: string;
  email: string;
}

interface IPlayerListViewer {
  mode: string;
  users: any;
  selectedBroadCast: any[];
  onFriendItemPress: (item: any) => void;
  navigstionBack: () => void;
  contactOnNavigation: () => void;
  removeSelectedContact: (item: any) => void;
  title: string;
  groupSletecedUser: any;
  navigatePermissions: () => void;
  setgroupName: (data: any) => void;
  navigationGoback: () => void;
  groupName: string;
}

const NewGroupProfileViewer: React.FC<IPlayerListViewer> = props => {
  const theme = GetTheme();
  const {
    onFriendItemPress,
    removeSelectedContact,
    groupSletecedUser,
    groupName,
    contactOnNavigation,
    navigatePermissions,
    setgroupName,
    navigationGoback,
  } = props;

  return (
    <PageContainer>
        <HeaderSeven
          title={'New Group'}
          onPress={() => navigationGoback()}
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
                source={require('../../../Assets/Images/user.png')}
                resizeMode="cover"></ImageBackground>
            </View>
            <View style={{flex: 0.7, marginTop: 10}}>
              <TextInput
                value={groupName}
                placeholderTextColor={theme.text}
                onChangeText={text => setgroupName(text)}
                style={{
                  color: theme.text,
                  paddingBottom: 10,
                  borderBottomWidth: 2,
                  borderColor: theme.headerTheme,
                  fontFamily: FONTS.OpenSans_Regular,
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
            backgroundColor: theme.background,
          }}>
          <TouchableOpacity
            style={{flex: 1, marginLeft: 10, flexDirection: 'row'}}
            onPress={() => navigatePermissions()}>
            <View style={{flex: 0.9, justifyContent: 'center'}}>
              <Text
                style={{fontFamily: FONTS.OpenSans_Regular, color: theme.text}}>
                Group Permissions
              </Text>
            </View>
            <View style={{flex: 0.1, justifyContent: 'center'}}>
              <Feather size={18} color={theme.text} name={'settings'}></Feather>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{flex: 0.6}}>
          <Text
            style={{
              margin: 10,
              fontFamily: FONTS.OpenSans_Regular,
              color: theme.text,
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
                        source={require('../../../Assets/Images/user.png')}
                        resizeMode="cover"></ImageBackground>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: FONTS.OpenSans_Regular,
                          color: theme.text,
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
            contactOnNavigation()
          }></ContactsFloatingIcon>
      </PageContainer>
  );
};

export default NewGroupProfileViewer;
