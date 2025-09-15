import React, {FC} from 'react';
import {View, Text, TextInput, Dimensions} from 'react-native';

import {USER_TYPE} from '../../../Constant/Constant';
import RadioButton from '../../../Components/Buttons/RadioButton';
import {useNavigation} from '@react-navigation/native';
import authStyles from '../../Style/LoginStyle';
import { Button, PageContainer, wp,SpinnerModal, useStylesheet } from 'react-native-dex-moblibs';

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
  const {theme}=useStylesheet()
 
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
          placeholderTextColor={theme.colors.text}
          placeholder="Enter the email"
          value={props?.userInputs?.email}
          style={[
            styles.input,
            {marginTop: 50, fontFamily: theme.fonts.regular},
          ]}
          // value={name}
          onChangeText={text => props.valueValidation(text, 'EMAIL')}
        />
        {loginErrors?.email && (
          <Text style={[styles.error, {color: theme.colors.error}]}>
            {loginErrors?.email}
          </Text>
        )}

        <TextInput
          placeholderTextColor={theme.colors.text}
          secureTextEntry={true}
          value={props?.userInputs?.password}
          placeholder="Enter Password"
          style={[
            styles.input,
            {marginTop: 20, fontFamily: theme.fonts.regular},
          ]}
          //value={email}
          onChangeText={text => props.valueValidation(text, 'PASSWORD')}
        />
        {loginErrors?.password && (
          <Text style={[styles.error, {color: theme.colors.error}]}>
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
              fontFamily: theme.fonts.bold,
              color: theme.colors.text,
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
    <PageContainer style={{flex: 1}}>
      {RenderComponent()}
      {props.isLoading && (
        <SpinnerModal
          content={'Loading....'}
          visible={props.isLoading}
        />
      )}
    </PageContainer>
  );
};

export default Login;
