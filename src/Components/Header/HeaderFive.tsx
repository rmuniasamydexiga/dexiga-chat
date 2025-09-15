import React, {FC} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInput,
} from 'react-native';

import {FONT_SIZE} from '../../Constant/FontSize';
 import {verticalScale, moderateScale} from '../../Constant/Metrics';
import {PopupMenu} from '../Menu/Menu';
import { useStylesheet, VectorIcon } from 'react-native-dex-moblibs';

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
  const {theme}=useStylesheet()
  const styles = StyleSheet.create({
    HeaderText: {
      fontSize: moderateScale(FONT_SIZE.font_20),
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
      textAlignVertical: 'center',
      marginBottom: '2%',
    },
  });

  return props.showTextInput ? (
    <ImageBackground
      source={require('../../Assets/Images/background.jpg')}
      style={{
        height: verticalScale(75),
        backgroundColor: theme.colors.background,
        elevation: 3,
      }}>
      <View
        style={{
          height: 50,
          margin: 10,
          backgroundColor: theme.colors.background,
          borderWidth: 2,
          borderColor: theme.colors.text,
          borderRadius: 20,
          flexDirection: 'row',
        }}>
        <View style={{flex: 0.05}} />
        <TouchableOpacity
          style={{flex: 0.1}}
          onPress={() => props.searchPressBack()}>
          <VectorIcon
            name="angle-left"
            size={40}
            type="FontAwesome"
            color={theme.colors.text}></VectorIcon>
        </TouchableOpacity>
        <TextInput
          placeholder="Enter the search"
          placeholderTextColor={theme.colors.text}
          style={{color: theme.colors.text}}
          autoFocus={true}
          onChangeText={txt => props.searchText(txt)}></TextInput>
      </View>
    </ImageBackground>
  ) : (
    <ImageBackground
      source={require('../../Assets/Images/background.jpg')}
      style={{
        height: verticalScale(75),
        backgroundColor: theme.colors.background,
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
              color={theme.colors.white}></FontAwesome>
          </TouchableOpacity>
        </View>
        <View style={{flex: 0.7, alignSelf: 'center', marginLeft: 10}}>
          <Text style={{fontSize: 16, fontWeight: '700', color: theme.colors.text}}>
            {props.title}
          </Text>
          <Text style={{fontSize: 12, fontWeight: '400', color: theme.colors.text}}>
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
              <VectorIcon
                name="search"
                style={{margin: 10}}
                color={theme.colors.text}
                size={20}
                type="Feather"></VectorIcon>
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
              <VectorIcon
                type="Entypo"
                onPress={() => props.onPressmenuVisible()}
                name="dots-three-vertical"
                style={{margin: 10}}
                color={theme.colors.white}
                size={20}></VectorIcon>
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
