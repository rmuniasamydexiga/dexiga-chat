import React, {FC} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';

import {COLORS, GetTheme} from '../../Constant/Colors';
import {FONT_SIZE} from '../../Constant/FontSize';
import {FONTS} from '../../Constant/Fonts';
import {verticalScale, moderateScale} from '../../Constant/Metrics';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';

interface props {
  title: string;
  onPress: () => void;
  isShowDownLoad: boolean;
  menuVisible: boolean;
  onPressCorner: (data: string) => void;
}

const HeaderTwo: FC<props> = props => {
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
          backgroundColor: Theme.WhiteAndBlack,
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
              color={Theme.text}></FontAwesome>
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
              color={COLORS.Primary}></Octicons>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

export default HeaderTwo;
