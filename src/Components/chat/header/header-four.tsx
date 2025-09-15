import React, {FC} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

 import {verticalScale} from '../../../Constant/Metrics';

import {PopupMenu} from '../../Menu/Menu';
import {TextInput} from 'react-native-gesture-handler';
import { useStylesheet, VectorIcon } from 'react-native-dex-moblibs';

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
  const {theme}=useStylesheet()
  const isSearch = true;

  return props.showTextInput ? (
    <ImageBackground
      source={require('../../../Assets/Images/background.jpg')}
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
            type='FontAwesome'
            color={theme.colors.text}></VectorIcon>
        </TouchableOpacity>
        <TextInput
          value={props.searchValue || ''}
          placeholder="Enter the search"
          placeholderTextColor={theme.colors.text}
          style={{color: theme.colors.text}}
          autoFocus={true}
          onChangeText={txt => props.searchText(txt)}></TextInput>
      </View>
    </ImageBackground>
  ) : (
    <ImageBackground
      source={require('../../../Assets/Images/background.jpg')}
      style={{
        height: verticalScale(100),
        backgroundColor: theme.colors.background,
        elevation: 3,
      }}>
      <View style={{flex: 0.1}} />
      <View style={{flex: 0.5, flexDirection: 'row'}}>
        <View style={{flex: 0.6}}>
          <Text
            style={{
              fontSize: theme.typography.subSubTitle,
              fontFamily: theme.fonts.bold,
              color: theme.colors.white,
              margin: 8,
            }}>
            {'Dexiga Chat  ' + props.title}
          </Text>
        </View>
        <View style={{flex: 0.4, flexDirection: 'row'}}>
          <TouchableOpacity
            style={{flex: 0.3}}
            onPress={() => props?.searchCamera()}>
            <VectorIcon
              name="camera"
              style={{marginTop: 10}}
              color={theme.colors.white}
              type="Feather"
              
              size={25}></VectorIcon>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 0.4}}
            onPress={() => props?.searchPress()}>
            <VectorIcon
              name="search"
              style={{margin: 10}}
              color={theme.colors.white}
              size={25}
              type="Feather"></VectorIcon>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 0.3}}
            onPress={() => props.onPopUpShow()}>
            <VectorIcon
              name="dots-three-vertical"
              style={{margin: 10}}
              color={theme.colors.white}
              size={25}
              type="Entypo"></VectorIcon>
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
            borderBottomColor: theme.colors.borderColor,
            borderBottomWidth: 3,
          }}>
          <Text
            style={{
              fontSize: theme.typography.subSubTitle,
              fontFamily: theme.fonts.bold,
              color: theme.colors.white,
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
