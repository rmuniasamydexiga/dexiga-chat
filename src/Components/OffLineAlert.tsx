import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS, IS_IOS} from '../Constant/Constant';
import {FONTS} from '../Constant/Fonts';
import {GetTheme} from '../Constant/Colors';
import SelectButton from './Buttons/SelectButton';

const {height, width} = Dimensions.get('window');
const OffLineAlert = props => {
  const colors = GetTheme();
  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderRadius: 0,
        width: width,
        height: height,
        elevation: 5,
      }}>
      <View style={{flex: 0.5}}></View>
      <View
        style={{
          flexDirection: 'row',
          flex: 0.5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MaterialIcons
          size={25}
          name={'wifi-off'}
          color={colors.text}
          style={{marginLeft: 20}}></MaterialIcons>
        <Text
          style={{
            fontSize: 18,
            fontFamily: FONTS.OpenSans_Bold,
            textAlign: 'center',
            alignSelf: 'center',
            color: colors.text,
            marginLeft: 10,
          }}>
          {'No internet connection'}
        </Text>
      </View>
      <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
        <SelectButton
          Text={'Try Again'}
          Width={220}
          ButtonColor={colors.headerTheme}
          onPress={() => null}
          textColor={colors.WhiteAndBlack}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    width: width / 1.2,
    height: height / 4.32,
    elevation: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border_theme,
  },
  content: {
    height: 'auto',
    justifyContent: 'center',
  },
  contentView: {
    flex: 1,
    alignItems: 'center',
    margin: 15,
  },
  message: {
    marginTop: 5,
    color: 'black',
    fontSize: 14,
    fontFamily: FONTS.DMSansRegular,
  },
  buttonView: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 5,
  },
  buttons: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary_theme,
    borderRadius: 5,
  },
  cancelButtonStyle: {
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.border_theme,
    borderRadius: 5,
  },
});

export default OffLineAlert;
