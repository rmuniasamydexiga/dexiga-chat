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

import {WIDTH} from '../../../Constant/Constant';
import HeaderSeven from '../../../Components/Header/HeaderSeven';

import {getName} from '../../../chat-services/common';
import { PageContainer,ContactsFloatingIcon, VectorIcon, useStylesheet } from 'react-native-dex-moblibs';

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
  const {theme}=useStylesheet()
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
                placeholderTextColor={theme.colors.text}
                onChangeText={text => setgroupName(text)}
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
            onPress={() => navigatePermissions()}>
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
                        source={require('../../../Assets/Images/user.png')}
                        resizeMode="cover"></ImageBackground>
                      <Text
                        style={{
                          fontSize: 12,
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
            contactOnNavigation()
          }></ContactsFloatingIcon>
      </PageContainer>
  );
};

export default NewGroupProfileViewer;
