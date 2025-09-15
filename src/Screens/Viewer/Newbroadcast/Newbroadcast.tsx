import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {Col, Grid, Row} from 'react-native-easy-grid';
import chatStyles from '../../Style/ChatListStyle';
import HeaderSix from '../../../Components/Header/HeaderSix';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {SCREEN_NAMES} from '../../../Constant/ScreenName';
import {getName} from '../../../chat-services/common';
import {ERROR_MESSAGE_CONTENT} from '../../../Constant/Constant';
import { PageContainer,ContactsFloatingIcon, useStylesheet } from 'react-native-dex-moblibs';
interface User {
  name: string;
  email: string;
}

interface IPlayerListViewer {
  user: any;
  selectedBroadCast: any[];
  onFriendItemPress: (item: any) => void;
  navigstionBack: () => void;
  contactOnNavigation: () => void;
  removeSelectedContact: (item: any) => void;
  title: string;
  searchValue: string;
  groupParticpantsList: any[];
  fromNavigation: string | null;
  showTextInput: boolean;
  searchPressBack: () => void;
  searchText: (txt: string) => void;
  searchPress: () => void;
  chatList: any[];
  usersList: any[];
  setBroadcastName: (txt: any) => void;
}

const AddNewBroadCastViewer: React.FC<IPlayerListViewer> = props => {
  const {
    user,
    usersList,
    onFriendItemPress,
    navigstionBack,
    selectedBroadCast,
    removeSelectedContact,
    title,
    groupParticpantsList,
    fromNavigation,
    showTextInput,
    searchPressBack,
    searchText,
    searchPress,
    searchValue,
    chatList,
    setBroadcastName,
  } = props;
const {theme}=useStylesheet()
  const styles = chatStyles();
  const getUserIsBlocked = (friend: any, index: number) => {
    const id1: any = user?.id;
    const id2 = friend.userId;
    let id = id1 < id2 ? id1 + id2 : id2 + id1;

    let channelFindData = chatList.find(
      ele => ele?.channelID === id && ele?.blockedBy === id1,
    );

    return !!channelFindData;
  };

  return (
    <PageContainer>
      <KeyboardAvoidingView style={[styles.container]}>
        <HeaderSix
          title={title}
          searchValue={searchValue}
          subTitle={
            title === 'Add Participants'
              ? title
              : selectedBroadCast.length +
                ' of ' +
                usersList?.length +
                ' Selected'
          }
          onPress={() => navigstionBack()}
          menuVisible={false}
          menuList={[]}
          onPressMenu={function (data: string): void {
            throw new Error('Function not implemented.');
          }}
          onPressDeleteMessage={function (): void {
            throw new Error('Function not implemented.');
          }}
          showTextInput={showTextInput}
          searchPressBack={() => searchPressBack()}
          searchText={txt => searchText(txt)}
          searchPress={() => searchPress()}></HeaderSix>

        {selectedBroadCast.length === 0 ? (
          <View style={{flex: 1}}>
           
            <FlatList
              data={usersList}
              keyboardShouldPersistTaps="always"
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={{height: 80}}
                    disabled={
                      !!groupParticpantsList?.find(
                        ele =>
                          ele?.user === item?.userId && ele?.isExit !== true,
                      )
                    }
                    onPress={() => onFriendItemPress(item)}>
                    <Grid style={{maxHeight: 80}}>
                      <Col
                        style={{
                          width: 80,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <ImageBackground
                          style={{
                            width: 65,
                            height: 65,
                            borderRadius: 65,
                          }}
                          source={require('../../../Assets/Images/user.png')}
                          resizeMode="cover">
                          {selectedBroadCast &&
                            selectedBroadCast.find(
                              ele => ele.userId === item.userId,
                            ) && (
                              <View
                                style={{alignSelf: 'flex-end', marginTop: 30}}>
                                <AntDesign
                                  style={{fontWeight: 'bold', fontSize: 30}}
                                  color={theme.colors.secondary}
                                  size={20}
                                  name="checkcircleo"></AntDesign>
                              </View>
                            )}
                        </ImageBackground>
                      </Col>

                      <Col style={{marginLeft: 10}}>
                        <Row style={{alignItems: 'center'}}>
                          <Col>
                            <Text
                              style={{
                                fontFamily: theme.fonts.regular,
                                fontSize: 16,
                                color: !!groupParticpantsList?.find(
                                  ele =>
                                    ele?.user === item?.userId &&
                                    ele?.isExit !== true,
                                )
                                  ? theme.colors.borderColor
                                  : theme.colors.text,
                              }}>
                              {getName(item)}
                            </Text>
                            {getUserIsBlocked(item, index) ? (
                              <Text
                                style={{
                                  fontFamily: theme.fonts.regular,
                                  fontSize: 10,
                                  color:theme.colors.borderColor,
                                }}>
                                {ERROR_MESSAGE_CONTENT.UN_BLOCK_CHAT}
                              </Text>
                            ) : (
                              !!groupParticpantsList?.find(
                                ele =>
                                  ele?.user === item?.userId &&
                                  ele?.isExit !== true,
                              ) && (
                                <Text
                                  style={{
                                    fontFamily: theme.fonts.regular,
                                    fontSize: 10,
                                    color:theme.colors.borderColor,
                                  }}>{`User Already Added to this ${
                                  fromNavigation === SCREEN_NAMES.BROADCAST_INFO
                                    ? 'BroadCast'
                                    : 'Group'
                                }`}</Text>
                              )
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Grid>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          <>
            <View style={{flex: 0.25}}>
              <View style={{marginTop: 10}}>
                <TextInput
                  // value={}
                  placeholderTextColor={theme.colors.text}
                  onChangeText={text => setBroadcastName(text)}
                  style={{
                    color: theme.colors.text,
                    paddingBottom: 10,
                    borderBottomWidth: 2,
                    borderColor: theme.colors.borderColor,
                    fontFamily: theme.fonts.regular,
                  }}
                  placeholder={'Enter the Broadcast Name'}></TextInput>
              </View>
              <FlatList
                horizontal
                data={selectedBroadCast}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={{height: 80}}
                      // onLongPress={()=>Alert.alert("loangPress")}
                      onPress={() => onFriendItemPress(item)}>
                      <Grid style={{maxHeight: 80}}>
                        <Col
                          onPress={() => removeSelectedContact(item)}
                          style={{
                            width: 60,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <ImageBackground
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 35,
                            }}
                            source={require('../../../Assets/Images/user.png')}
                            resizeMode="cover">
                            <View
                              style={{alignSelf: 'flex-end', marginTop: 15}}>
                              <AntDesign
                                style={{fontWeight: 'bold', fontSize: 15}}
                                color={'grey'}
                                name="closecircle"></AntDesign>
                            </View>
                          </ImageBackground>
                          <Text
                            style={{
                              fontFamily: theme.fonts.regular,
                              fontSize: 12,
                              color: theme.colors.text,
                            }}
                            numberOfLines={1}>
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
            <View style={{flex: 0.75}}>
              <FlatList
                data={usersList}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={{height: 80}}
                      disabled={
                        !!groupParticpantsList?.find(
                          ele => ele?.user === item?.userId,
                        )
                      }
                      // onLongPress={()=>Alert.alert("loangPress")}
                      onPress={() => onFriendItemPress(item)}>
                      <Grid style={{maxHeight: 80}}>
                        <Col
                          style={{
                            width: 80,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <ImageBackground
                            style={{
                              width: 65,
                              height: 65,
                              borderRadius: 65,
                            }}
                            source={require('../../../Assets/Images/user.png')}
                            resizeMode="cover">
                            {selectedBroadCast &&
                              selectedBroadCast.find(
                                ele => ele.userId === item.userId,
                              ) && (
                                <View
                                  style={{
                                    alignSelf: 'flex-end',
                                    marginTop: 30,
                                  }}>
                                  <AntDesign
                                    style={{fontWeight: 'bold', fontSize: 30}}
                                    color={theme.colors.secondary}
                                    size={20}
                                    name="checkcircleo"></AntDesign>
                                </View>
                              )}
                          </ImageBackground>
                        </Col>

                        <Col style={{marginLeft: 10}}>
                          <Row style={{alignItems: 'center'}}>
                            <Col>
                              <Text
                                style={{
                                  fontFamily: theme.fonts.regular,
                                  fontSize: 16,
                                  color: !!groupParticpantsList?.find(
                                    ele => ele?.user === item?.userId,
                                  )
                                    ? theme.colors.borderColor
                                    : theme.colors.text,
                                }}>
                                {getName(item)}
                              </Text>
                              {!!groupParticpantsList?.find(
                                ele => ele?.user === item?.userId,
                              ) && (
                                <Text
                                  style={{
                                    fontFamily: theme.fonts.regular,
                                    fontSize: 10,
                                    color: theme.colors.borderColor,
                                  }}>
                                  User Already Added to this Group
                                </Text>
                              )}
                            </Col>
                          </Row>
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
                props.contactOnNavigation()
              }></ContactsFloatingIcon>
          </>
        )}
      </KeyboardAvoidingView>
      </PageContainer>
  );
};

export default AddNewBroadCastViewer;
