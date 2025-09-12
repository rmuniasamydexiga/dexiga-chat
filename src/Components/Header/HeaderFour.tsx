import React, {FC} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';

import {COLORS, GetTheme} from '../../Constant/Colors';
import {FONT_SIZE} from '../../Constant/FontSize';
import {FONTS} from '../../Constant/Fonts';
import {verticalScale, moderateScale} from '../../Constant/Metrics';

import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {PopupMenu} from '../Menu/Menu';
import {TextInput} from 'react-native-gesture-handler';
import {WIDTH} from '../../Constant/Constant';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface props {
  title: string;
  onPress: () => void;
  onPopUpShow: () => void;
  menuVisible: boolean;
  menuList: any[];
  onPressMenu: (data: string) => void;
  onPressDeleteMessage: () => void;
  showTextInput: boolean;
  searchValue: string;
  searchPress: () => void;
  searchPressBack: () => void;
  searchText: (txt: string) => void;
  searchCamera: () => void;
}

const HeaderFour: FC<props> = props => {
  const Theme = GetTheme();
  const isSearch = true;
  const styles = StyleSheet.create({
    HeaderText: {
      fontSize: moderateScale(FONT_SIZE.font_20),
      fontFamily: FONTS.OpenSans_Bold,
      color: Theme.BlackAndWhite,
      textAlignVertical: 'center',
      marginBottom: '2%',
    },
    searchSection: {
      height: 70,
      width: WIDTH,

      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    searchIcon: {
      padding: 10,
    },
    input: {
      flex: 1,
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 0,
      backgroundColor: '#fff',
      color: '#424242',
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
          value={props.searchValue || ''}
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
        height: verticalScale(100),
        backgroundColor: Theme.headerTheme,
        elevation: 3,
      }}>
      <View style={{flex: 0.1}} />
      <View style={{flex: 0.5, flexDirection: 'row'}}>
        <View style={{flex: 0.6}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: COLORS.White,
              margin: 8,
            }}>
            {'Dexiga Chat  ' + props.title}
          </Text>
        </View>
        <View style={{flex: 0.4, flexDirection: 'row'}}>
          <TouchableOpacity
            style={{flex: 0.3}}
            onPress={() => props?.searchCamera()}>
            <Entypo
              name="camera"
              style={{marginTop: 10}}
              color={COLORS.White}
              size={25}></Entypo>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 0.4}}
            onPress={() => props?.searchPress()}>
            <Feather
              name="search"
              style={{margin: 10}}
              color={COLORS.White}
              size={25}></Feather>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 0.3}}
            onPress={() => props.onPopUpShow()}>
            <Entypo
              name="dots-three-vertical"
              style={{margin: 10}}
              color={COLORS.White}
              size={25}></Entypo>
          </TouchableOpacity>

          <PopupMenu
            visible={props.menuVisible}
            menuList={props.menuList}
            hideMenu={(data: string) => {
              props.onPressMenu(data);
            }}></PopupMenu>
        </View>
      </View>
      <View style={{flex: 0.5, flexDirection: 'row'}}>
        <View
          style={{
            flex: 0.4,
            borderBottomColor: COLORS.White,
            borderBottomWidth: 3,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: COLORS.White,
              margin: 8,
            }}>
            Chat
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HeaderFour;
