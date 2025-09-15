import React from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Col, Grid, Row} from 'react-native-easy-grid';
import {dayFormatwithUnix} from '../../chat-services/DayHelper';
 import {CHAT_OPTIONS} from '../../Constant/Constant';
import {checkPlayerBlockOrNot, getMessage, getName} from '../../chat-services/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SCREEN_NAMES} from '../../Constant/ScreenName';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ListEmptyComponent, useStylesheet } from 'react-native-dex-moblibs';

const ListComponent = (props: {
  data: any;
  userId: string;
  selectedUser: any[];
  fromNavigation: string;
  onFriendItemPress: (data: any) => void;
  EmptyListMesage: string;
  chatList: any;
}) => {
  const {
    data,
    userId,
    onFriendItemPress,
    fromNavigation,
    selectedUser,
    EmptyListMesage,
    chatList,
  } = props;
  const {theme} = useStylesheet();
  const colors = theme.colors;
  return (
    <FlatList
      data={data}
      keyboardShouldPersistTaps="always"
      ListEmptyComponent={
        <ListEmptyComponent title={EmptyListMesage || 'No Chat Found'} description={''} type={'MaterialIcons'} name={''} size={0} />
      }
      renderItem={({item, index}) => {
        return (
          <TouchableOpacity
            style={{height: 80}}
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
                  source={require('../../Assets/Images/user.png')}
                  resizeMode="cover">
                  {selectedUser &&
                    selectedUser.find(
                      (ele: {userId: any}) => ele.userId === item.userId,
                    ) && (
                      <View style={{alignSelf: 'flex-end', marginTop: 30}}>
                        <AntDesign
                          style={{fontWeight: 'bold', fontSize: 30}}
                          color={colors.headerTheme}
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
                        fontFamily: theme.fonts.bold,
                        fontSize: 16,
                        color: colors.text,
                      }}>
                      {getName(item)}
                    </Text>
                  </Col>
                  {fromNavigation === SCREEN_NAMES.CHAT_LIST ? (
                    <Col style={{alignItems: 'flex-end', paddingEnd: 10}}>
                      <Text
                        style={{
                          color: colors.secondaryText,
                          fontSize: 11,
                          fontFamily: theme.fonts.regular,
                        }}>
                        {dayFormatwithUnix(item.lastMessageDate, 'HH,MM A')}
                      </Text>
                    </Col>
                  ) : (
                    <></>
                  )}
                </Row>
                {fromNavigation === SCREEN_NAMES.CHAT_LIST ? (
                  <Row style={{marginTop: -5}}>
                    <View style={{flex: 0.8}}>
                      <Text
                        style={{
                          color: colors.secondaryText,
                          fontSize: 13,
                          fontFamily: theme.fonts.regular,
                        }}>
                        {getMessage(item.lastMessage)}
                      </Text>
                    </View>
                    <View style={{flex: 0.2}}>
                      {item.mutedBy === userId ||
                      item.mutedBy === CHAT_OPTIONS.BOTH ? (
                        <Ionicons name={'volume-mute'} size={20} />
                      ) : (
                        <></>
                      )}
                    </View>
                  </Row>
                ) : (
                  <Row style={{marginTop: -5}}>
                    <View style={{flex: 0.8}}>
                      <Text
                        style={{
                          color: colors.secondaryText,
                          fontSize: 13,
                          fontFamily: theme.fonts.regular,
                        }}>
                        {checkPlayerBlockOrNot(chatList, userId, item.userId)}
                      </Text>
                    </View>
                  </Row>
                )}
              </Col>
            </Grid>
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default ListComponent;
