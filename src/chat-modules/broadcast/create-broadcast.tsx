import React, {useEffect, useState} from 'react';

import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Paths} from '../../chat-services/constant/ScreenName';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectChatList,
  selectUser,
  selectUserList,
  setChatChanneDetails,
} from '../../redux/chatSlice';
import {CHAT_DETAILS_CONFIGURE} from '../../chat-services/constant/constant';
import {createNewBroadCast} from '../../chat-firebase/channel';
import {BackHandler} from 'react-native';
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
import {getName} from '../../chat-services/common';
import {ERROR_MESSAGE_CONTENT} from '../../chat-services/constant/constant';
interface User {
  name: string;
  email: string;
}

const AddNewBroadCastController: React.FC = () => {
  const usersList = useSelector(selectUserList);

  const [userFilter, setUserFilter] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [broadcastName, setBroadcastName] = useState<string>('');
  const navigation = useNavigation<any>();
  const [selectedBroadCast, setSelectedBroadCast] = useState([]);
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const chatList = useSelector(selectChatList);
  const user = useSelector(selectUser);
const {theme}=useStylesheet()
const {images}=useAssets()
  const styles = chatStyles();
  useEffect(() => {
    setSelectedBroadCast([]);
    setUserFilter(usersList);
  }, []);

  useEffect(() => {
    if (route?.params?.groupParticpantsList) {
      setSelectedBroadCast([...route?.params?.groupParticpantsList]);
    }
  }, [route]);
    const getUserIsBlocked = (friend: any, index: number) => {
    const id1: any = user?.id;
    const id2 = friend.userId;
    let id = id1 < id2 ? id1 + id2 : id2 + id1;

    let channelFindData = chatList.find(
      ele => ele?.channelID === id && ele?.blockedBy === id1,
    );

    return !!channelFindData;
  };

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.goBack();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  const onFriendItemPress = (friend: any) => {
    let selectBroadCastList = selectedBroadCast;
    if (showTextInput) {
      searchText('');
    }
    if (!selectBroadCastList.find(ele => ele.userId === friend?.userId)) {
      selectBroadCastList.push(friend);
    } else {
      selectBroadCastList = selectedBroadCast.filter(ele => {
        return ele?.userId !== friend?.userId;
      });
    }

    setSelectedBroadCast([...selectBroadCastList]);
  };

  const removeSelectedContact = (friend: any) => {
    let selectBroadCastList = selectedBroadCast.filter(ele => {
      return ele?.userId !== friend?.userId;
    });

    setSelectedBroadCast([...selectBroadCastList]);
  };

  const createBroadCast = async () => {
    // selectedBroadCast
    console.log('Chanel', broadcastName);
    let result = await createNewBroadCast(
      selectedBroadCast,
      user?.userId || user?.userID || user?.id,
      broadcastName,
    );
    console.log('result', JSON.stringify(result));
    if (result.status) {
      let name = selectedBroadCast.map(ele => ele?.name);
      const channel = {
        id: result.data.id,
        is_broadCast: true,
        // name: name.join(',') + ' BroadCast',
        name: broadcastName + ' BroadCast',
        participants: [result.data],
      };

      dispatch(setChatChanneDetails(channel));
      navigation.navigate(Paths.Chat);
    }
  };

  const searchText = (txt: any) => {
    setSearchValue(txt);
    let userFilter = usersList.filter(ele => {
      if (
        ele.name.search(txt.toUpperCase()) !== -1 ||
        ele.name.toUpperCase().search(txt.toUpperCase()) !== -1
      ) {
        return ele;
      }
    });
    setUserFilter(userFilter);
  };
  const title= route?.params?.fromNavigation === Paths.BroadcastInfo
          ? 'Edit recipients'
          : CHAT_DETAILS_CONFIGURE.NEW_BRAOD_CAST;
          let  groupParticpantsList: any[]=[]
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
            searchPressBack={() => {
                 setShowTextInput(!showTextInput);
        searchText('');
            }}
            searchText={txt => searchText(txt)}
            searchPress={() => {
                      setShowTextInput(!showTextInput);

            }}></HeaderSix>
  
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
                                   route?.params?.fromNavigation === Paths.BroadcastInfo
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
                {
        if (route?.params?.fromNavigation === Paths.BroadcastInfo) {
          navigation.navigate(Paths.BroadcastInfo, {
            groupSletecedUser: selectedBroadCast,
          });
        } else {
          createBroadCast();
        }
      }
               
                }></ContactsFloatingIcon>
            </>
          )}
        </KeyboardAvoidingView>
        </PageContainer>
    );
};

export default AddNewBroadCastController;
