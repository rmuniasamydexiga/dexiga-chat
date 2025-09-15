import React, {FC} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';

import {FONT_SIZE} from '../../Constant/FontSize';
 import {verticalScale, moderateScale} from '../../Constant/Metrics';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import { useStylesheet } from 'react-native-dex-moblibs';

interface props {
  title: string;
  onPress: () => void;
  isShowDownLoad: boolean;
  menuVisible: boolean;
  onPressCorner: (data: string) => void;
}

const HeaderTwo: FC<props> = props => {
  const {theme}=useStylesheet()
  const styles = StyleSheet.create({
    HeaderText: {
      fontSize: moderateScale(FONT_SIZE.font_20),
      fontFamily: theme.fonts.bold,
      color: theme.colors.white,
      textAlignVertical: 'center',
      marginBottom: '2%',
    },
  });

  return (
    <ImageBackground
      source={require('../../Assets/Images/background.jpg')}
      style={{height: verticalScale(70)}}>
      <View style={{flex: 0.1}}></View>
      <View
        style={{
          flex: 0.9,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.white,
          elevation: 3,
        }}>
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
              color={theme.colors.text}></FontAwesome>
          </TouchableOpacity>
        </View>

        <View
          style={{flex: 0.65, alignItems: 'flex-start', marginRight: '12%'}}>
          <Text style={styles.HeaderText}>{props.title}</Text>
        </View>
        {props.isShowDownLoad && (
          <TouchableOpacity
            style={{flex: 0.15, flexDirection: 'row-reverse'}}
            onPress={() => props.onPressCorner('True')}>
            <Octicons
              name="download"
              size={30}
              color={theme.colors.white}></Octicons>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

export default HeaderTwo;
