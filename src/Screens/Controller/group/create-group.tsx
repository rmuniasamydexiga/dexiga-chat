import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {Paths} from '../../../Constant/ScreenName';
import {useDispatch, useSelector} from 'react-redux';
import {
  CHAT_DETAILS_CONFIGURE,
  ERROR_MESSAGE_CONTENT,
} from '../../../Constant/Constant';
import {STORAGE} from '../../../chat-services/StorageHelper';
import {
  selectChatList,
  selectUser,
  selectUserList,
} from '../../../redux/chatSlice';
import {Alert} from 'react-native';
import {checkPlayerBlockOrNot} from '../../../chat-services/common';
import { getData } from 'react-native-dex-moblibs';
import {HeaderSix, PageContainer,ContactsFloatingIcon, useStylesheet, VectorIcon, useAssets,chatStyles } from 'react-native-dex-moblibs';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import {Col, Grid, Row} from 'react-native-easy-grid';
import {getName} from '../../../chat-services/common';


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
  const [broadcastName, setBroadcastName] = useState<string>('');
const {theme}=useStylesheet()
const {images}=useAssets()
  const styles = chatStyles();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    setUserFilter(users);
  }, []);
  const getUserIsBlocked = (friend: any, index: number) => {
    const id1: any = user?.id;
    const id2 = friend.userId;
    let id = id1 < id2 ? id1 + id2 : id2 + id1;

    let channelFindData = chatList.find(
      ele => ele?.channelID === id && ele?.blockedBy === id1,
    );

    return !!channelFindData;
  };

  useEffect(() => {
    setSelectedBroadCast([]);

    getMode();
  }, [isFocused]);

  const getMode = async () => {
    let userId: string = (await getData(STORAGE.USERID)) || '';
    setUserId(userId);
  };

 
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
    if (route?.params?.formNavigation === Paths.GROUP_INFO) {
      let selectedBroadCasts = selectedBroadCast;
      setSelectedBroadCast([]);
      navigation.navigate(Paths.GROUP_INFO, {
        groupSletecedUser: selectedBroadCasts,
        users: users,
      });
    } else {
      navigation.navigate(Paths.ADD_NEW_GROUP_PROFILE, {
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
const groupParticpantsList=route?.params?.groupParticpantsList||null
  
    return (
      <PageContainer>
        <KeyboardAvoidingView style={[styles.container]}>
          <HeaderSix
            title={route?.params?.formNavigation === Paths.GROUP_INFO
          ? 'Add Participants'
          : CHAT_DETAILS_CONFIGURE.NEW_GROUP}
            searchValue={searchValue}
            subTitle={
              title === 'Add Participants'
                ? title
                : selectedBroadCast.length +
                  ' of ' +
                  userFilter?.length +
                  ' Selected'
            }
            onPress={() => navigation.goBack()}
            menuVisible={false}
            menuList={[]}
            onPressMenu={function (data: string): void {
              throw new Error('Function not implemented.');
            }}
            onPressDeleteMessage={function (): void {
              throw new Error('Function not implemented.');
            }}
            showTextInput={showTextInput}
            searchPressBack={() => {  setShowTextInput(!showTextInput)
        searchText('')}}
            searchText={txt => searchText(txt)}
            searchPress={() =>  setShowTextInput(!showTextInput)}></HeaderSix>
  
          {selectedBroadCast.length === 0 ? (
            <View style={{flex: 1}}>
             
              <FlatList
                data={userFilter}
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
                            source={images['chat-user']}
                            resizeMode="cover">
                            {selectedBroadCast &&
                              selectedBroadCast.find(
                                ele => ele.userId === item.userId,
                              ) && (
                                <View
                                  style={{alignSelf: 'flex-end', marginTop: 30}}>
                                
                                        <VectorIcon size={20} name={"checkcircleo"} color={theme.colors.secondary} type='AntDesign'/>
                                    
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
                                  fontSize: theme.typography.subSubTitle,
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
                                    fontSize: theme.typography.label,
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
                                      fontSize: theme.typography.label,
                                      color:theme.colors.borderColor,
                                    }}>{`User Already Added to this ${
                                    route?.params?.fromNavigation === Paths.BROADCAST_INFO
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
                              source={images['chat-user']}
                              resizeMode="cover">
                              <View
                                style={{alignSelf: 'flex-end', marginTop: 15}}>
                             
                                 <VectorIcon size={20} style={{fontWeight: 'bold', fontSize: theme.typography.subSubTitle}}
   name={"closecircle"} color={theme.colors.secondary} type='AntDesign'/>
  
  
                              </View>
                            </ImageBackground>
                            <Text
                              style={{
                                fontFamily: theme.fonts.regular,
                                fontSize:theme.typography.label,
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
                  data={userFilter}
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
                              source={images['chat-user']}
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
                                    <VectorIcon
                                        type="AntDesign"
                                      style={{fontFamily: theme.fonts.bold, fontSize:theme.typography.superText}}
                                      color={theme.colors.secondary}
                                      size={20}
                                      name="checkcircleo"></VectorIcon>
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
                                    fontSize:theme.typography.title,
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
                                      fontSize:theme.typography.label,
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
                 createNewGroup()
                }></ContactsFloatingIcon>
            </>
          )}
        </KeyboardAvoidingView>
        </PageContainer>
    );

 
};

export default AddNewGroupController;
