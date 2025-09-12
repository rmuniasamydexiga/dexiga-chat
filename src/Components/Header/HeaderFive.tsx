import React, {FC} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInput,
} from 'react-native';

import {COLORS, GetTheme} from '../../Constant/Colors';
import {FONT_SIZE} from '../../Constant/FontSize';
import {FONTS} from '../../Constant/Fonts';
import {verticalScale, moderateScale} from '../../Constant/Metrics';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {PopupMenu} from '../Menu/Menu';

interface props {
  title: string;
  subTitle: string;
  onPress: () => void;
  menuVisible: boolean;
  menuList: any[];
  onPressMenu: (data: string) => void;
  onPressDeleteMessage: () => void;
  searchPress: () => void;
  isHideDot: boolean;
  showTextInput: boolean;
  searchText: (txt: string) => void;
  searchPressBack: () => void;
  onPressmenuVisible: () => void;
  isHideSearch: boolean;
}

const HeaderFive: FC<props> = props => {
  const Theme = GetTheme();
  const styles = StyleSheet.create({
    HeaderText: {
      fontSize: moderateScale(FONT_SIZE.font_20),
      fontFamily: FONTS.OpenSans_Bold,
      color: Theme.BlackAndWhite,
      textAlignVertical: 'center',
      marginBottom: '2%',
    },
  });

  return props.showTextInput ? (
    <ImageBackground
      source={require('../../Assets/Images/background.jpg')}
      style={{
        height: verticalScale(75),
        backgroundColor: Theme.headerTheme,
        elevation: 3,
      }}>
      <View
        style={{
          height: 50,
          margin: 10,
          backgroundColor: Theme.background,
          borderWidth: 2,
          borderColor: Theme.text,
          borderRadius: 20,
          flexDirection: 'row',
        }}>
        <View style={{flex: 0.05}} />
        <TouchableOpacity
          style={{flex: 0.1}}
          onPress={() => props.searchPressBack()}>
          <FontAwesome
            name="angle-left"
            size={40}
            color={Theme.text}></FontAwesome>
        </TouchableOpacity>
        <TextInput
          placeholder="Enter the search"
          placeholderTextColor={Theme.text}
          style={{color: Theme.text}}
          autoFocus={true}
          onChangeText={txt => props.searchText(txt)}></TextInput>
      </View>
    </ImageBackground>
  ) : (
    <ImageBackground
      source={require('../../Assets/Images/background.jpg')}
      style={{
        height: verticalScale(75),
        backgroundColor: Theme.headerTheme,
        elevation: 3,
      }}>
      <View style={{flex: 0.25}}></View>
      <View style={{flex: 0.65, flexDirection: 'row'}}>
        <View style={{flex: 0.15, justifyContent: 'center'}}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              width: '100%',
              height: '70%',
              justifyContent: 'center',
            }}
            onPress={() => props.onPress()}>
            <FontAwesome
              name="angle-left"
              size={40}
              color={Theme.WHITE}></FontAwesome>
          </TouchableOpacity>
        </View>
        <View style={{flex: 0.7, alignSelf: 'center', marginLeft: 10}}>
          <Text style={{fontSize: 16, fontWeight: '700', color: COLORS.White}}>
            {props.title}
          </Text>
          <Text style={{fontSize: 12, fontWeight: '400', color: COLORS.White}}>
            {props.subTitle}
          </Text>
        </View>
        <View style={{flex: 0.25, flexDirection: 'row'}}>
          {props.isHideSearch ? (
            <></>
          ) : (
            <TouchableOpacity
              style={{flex: 0.5, alignSelf: 'center'}}
              onPress={() => props.searchPress()}>
              <Feather
                name="search"
                style={{margin: 10}}
                color={COLORS.White}
                size={20}></Feather>
            </TouchableOpacity>
          )}
          <View
            style={{
              flex: props.isHideSearch ? 1 : 0.5,
              alignSelf: 'center',
              alignItems: 'flex-end',
            }}>
            {props?.isHideDot ? (
              <></>
            ) : (
              <Entypo
                onPress={() => props.onPressmenuVisible()}
                name="dots-three-vertical"
                style={{margin: 10}}
                color={COLORS.White}
                size={20}></Entypo>
            )}
          </View>
          <PopupMenu
            visible={props.menuVisible}
            menuList={props.menuList}
            hideMenu={(data: string) => {
              props.onPressMenu(data);
            }}></PopupMenu>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HeaderFive;
