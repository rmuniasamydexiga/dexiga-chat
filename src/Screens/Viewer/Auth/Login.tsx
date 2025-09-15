import React, {FC} from 'react';
import {View, Text, TextInput, Dimensions} from 'react-native';
import {GetTheme} from '../../../Constant/Colors';
import {FONTS} from '../../../Constant/Fonts';
import {USER_TYPE} from '../../../Constant/Constant';
import RadioButton from '../../../Components/Buttons/RadioButton';
import {useNavigation} from '@react-navigation/native';
import authStyles from '../../Style/LoginStyle';
import Spinner from '../../../Components/Loader/Spinner';
import { Button, PageContainer, wp } from 'react-native-dex-moblibs';

interface props {
  selectedOption: string;
  setOption: (option: string) => void;
  valueValidation: (value: string, type: string) => void;
  loginFun: () => void;
  isLoading: boolean;
  loginErrors: any;
  userInputs: any;
}

const Login: FC<props> = props => {
  const navigation = useNavigation<any>();
  const styles = authStyles();
  const Theme = GetTheme();
  // const styles = StyleSheet.create({
  //     TextInputStyle: { width: scale(280), height: verticalScale(46), borderColor: Theme.InputBorder, borderWidth: 1, borderRadius: 4, padding: 10 },
  // })
  const {loginErrors} = props;

  const options = [
    {key: 1, value: USER_TYPE.HOST},
    {key: 2, value: USER_TYPE.PLAYER},
  ];

  const RenderComponent = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholderTextColor={Theme.text}
          placeholder="Enter the email"
          value={props?.userInputs?.email}
          style={[
            styles.input,
            {marginTop: 50, fontFamily: FONTS.OpenSans_Regular},
          ]}
          // value={name}
          onChangeText={text => props.valueValidation(text, 'EMAIL')}
        />
        {loginErrors?.email && (
          <Text style={[styles.error, {color: 'red'}]}>
            {loginErrors?.email}
          </Text>
        )}

        <TextInput
          placeholderTextColor={Theme.text}
          secureTextEntry={true}
          value={props?.userInputs?.password}
          placeholder="Enter Password"
          style={[
            styles.input,
            {marginTop: 20, fontFamily: FONTS.OpenSans_Regular},
          ]}
          //value={email}
          onChangeText={text => props.valueValidation(text, 'PASSWORD')}
        />
        {loginErrors?.password && (
          <Text style={[styles.error, {color: 'red'}]}>
            {loginErrors?.password}
          </Text>
        )}

        <View
          style={{
            flex: 0.5,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            {options.map(ele => (
              <RadioButton
                key={ele.key}
                label={ele.value}
                selected={props.selectedOption === ele.value}
                onSelect={() => props.setOption(ele.value)}
              />
            ))}
          </View>
          <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
         
               <Button
                              title={'SUBMIT'}
                              style={{ width: 220}}
                              onPress={()=>props.loginFun()}
                            />
          </View>
        </View>
        <View style={{flex: 1, alignItems: 'center', marginTop: 50}}>
          <Text
            style={{
              alignSelf: 'center',

              fontSize: 20,
              textDecorationLine: 'underline',
              fontFamily: FONTS.OpenSans_Medium,
              color: Theme.text,
            }}
            onPress={() => {
              navigation.navigate('SignUp');
            }}>
            SignUp
          </Text>
        </View>
      </View>
    );
  };

  return (
    <PageContainer style={{flex: 1, backgroundColor: Theme.BackgroundColor}}>
      {RenderComponent()}
      {props.isLoading && (
        <Spinner
          textContent={'Loading....'}
          visible={props.isLoading}
          overlayColor={Theme.headerTheme}
        />
      )}
    </PageContainer>
  );
};

export default Login;
