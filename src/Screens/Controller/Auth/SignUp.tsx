import React, {useState} from 'react';
import {View, Text, TextInput, Alert} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import {SCREEN_NAMES} from '../../../Constant/ScreenName';
import authStyles from '../../Style/LoginStyle';
import {GetTheme} from '../../../Constant/Colors';
import SelectButton from '../../../Components/Buttons/SelectButton';
import {SNACKBAR_MESSAGE_LENGTH, USER_TYPE} from '../../../Constant/Constant';
import RadioButton from '../../../Components/Buttons/RadioButton';
import {signUpValidationSchema, validation} from '../../../Helper/validation';
import {
  showLog,
  snackBarMessage,
  validateMobileNumber,
} from '../../../Helper/common';
import Spinner from '../../../Components/Loader/Spinner';

interface ISignup {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  navigation: NavigationProp<ParamListBase>;
}

const Signup: React.FC<ISignup> = props => {
  const [name, setName] = useState<string>('');
  const [errors, setErrors] = useState<any>(null);
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>(USER_TYPE.HOST);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {navigation} = props;
  const styles = authStyles();
  const theme = GetTheme();
  const options = [
    {key: 1, value: USER_TYPE.HOST},
    {key: 2, value: USER_TYPE.PLAYER},
  ];

  const checkValidation = async (req: {
    name: string;
    userName: string;
    email: string;
    password: string;
    mobile: string;
    userId?: any;
    confirmPassword: string;
    userType: string;
  }) => {

    const userId: string = String(uuidv4());
    let request = {
      ...req,
      userId: userId,
    };

    let result = await validation(signUpValidationSchema, request);
    if (!result.status) {
      setErrors(result.error);
    }
  };
  const registerUser = async () => {
    try {
      const userId = uuidv4();
      const req = {
        name,
        userName: name,
        email,
        password,
        mobile,
        userId,
        confirmPassword,
        userType: selectedOption,
      };

      const result = await validation(signUpValidationSchema, req);
      if (!result.status) {
        setErrors(result.error);
        return;
      }

      setIsLoading(true);
      setErrors(null);

      const querySnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();

      if (!querySnapshot.empty) {
        setIsLoading(false);
        Alert.alert('Email Already Exist');
        return;
      }

      await firestore()
        .collection('users')
        .doc(userId)
        .set({
          name,
          userName: name,
          email,
          password,
          mobile,
          userId,
          userType: selectedOption,
        });

      setIsLoading(false);
      setTimeout(() => {
        snackBarMessage(
          'User Registered Successfully',
          SNACKBAR_MESSAGE_LENGTH.LONG,
        );
        navigation.navigate(SCREEN_NAMES.LOGIN);
      }, 1000);
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      showLog('SignUpError', errorMsg);
      setIsLoading(false);
    }
  };

  const validate = (): boolean => {
    let isValid = true;
    if (name === '') {
      isValid = false;
    }
    if (email === '') {
      isValid = false;
    }
    if (mobile === '') {
      isValid = false;
    }
    if (password === '') {
      isValid = false;
    }
    if (confirmPassword === '') {
      isValid = false;
    }
    if (confirmPassword !== password) {
      isValid = false;
    }
    return isValid;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholderTextColor={theme.text}
        placeholder="Enter Name"
        style={[styles.input, {marginTop: 50}]}
        value={name}
        onChangeText={(txt: string) => {
          setName(txt);
          if (errors) {
            checkValidation({
              name: txt,
              userName: txt,
              email: email,
              password: password,
              mobile: mobile,
              confirmPassword: confirmPassword,
              userType: selectedOption,
            });
          }
        }}
      />
      {errors?.name && (
        <Text style={[styles.error, {color: 'red'}]}>{errors?.name}</Text>
      )}

      <TextInput
        placeholderTextColor={theme.text}
        placeholder="Enter Email"
        style={[styles.input, {marginTop: 20}]}
        value={email}
        onChangeText={(txt: string) => {
          setEmail(txt);
          if (errors) {
            checkValidation({
              name: name,
              userName: name,
              email: txt,
              password: password,
              mobile: mobile,
              confirmPassword: confirmPassword,
              userType: selectedOption,
            });
          }
        }}
      />
      {errors?.email && (
        <Text style={[styles.error, {color: 'red'}]}>{errors?.email}</Text>
      )}
      <TextInput
        placeholderTextColor={theme.text}
        placeholder="Enter Mobile"
        keyboardType={'number-pad'}
        style={[styles.input, {marginTop: 20}]}
        value={mobile}
        onChangeText={(txt: string) => {
          setMobile(txt);

          if (errors) {
            checkValidation({
              name: name,
              userName: name,
              email: email,
              password: password,
              mobile: txt,
              confirmPassword: confirmPassword,
              userType: selectedOption,
            });
          }
        }}
      />
      {errors?.mobile && (
        <Text style={[styles.error, {color: 'red'}]}>{errors?.mobile}</Text>
      )}

      <TextInput
        placeholderTextColor={theme.text}
        placeholder="Enter Password"
        style={[styles.input, {marginTop: 20}]}
        value={password}
        onChangeText={(txt: string) => {
          setPassword(txt);
          if (errors) {
            checkValidation({
              name: name,
              userName: name,
              email: email,
              password: txt,
              mobile: mobile,
              confirmPassword: confirmPassword,
              userType: selectedOption,
            });
          }
        }}
      />
      {errors?.password && (
        <Text style={[styles.error, {color: 'red'}]}>{errors?.password}</Text>
      )}

      <TextInput
        placeholderTextColor={theme.text}
        placeholder="Enter Confirm Password"
        style={[styles.input, {marginTop: 20}]}
        value={confirmPassword}
        onChangeText={(txt: string) => {
          setConfirmPassword(txt);

          if (errors) {
            checkValidation({
              name: name,
              userName: name,
              email: email,
              password: password,
              mobile: mobile,
              confirmPassword: txt,
              userType: selectedOption,
            });
          }
        }}
      />
      {errors?.confirmPassword && (
        <Text style={[styles.error, {color: 'red'}]}>
          {errors?.confirmPassword}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginTop: 10,
        }}>
        {options.map(ele => (
          <RadioButton
            key={ele.key}
            label={ele.value}
            selected={selectedOption === ele.value}
            onSelect={() => setSelectedOption(ele.value)}
          />
        ))}
      </View>
      <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
        <SelectButton
          Text={'SUBMIT'}
          Width={220}
          onPress={() => {
            //  if (validate()) {
            registerUser();
            // } else {
            //   Alert.alert('Please Enter Correct Data');
            // }
          }}
          textColor={theme.white}
        />
      </View>
      <Spinner
        textContent={'Loading....'}
        visible={isLoading}
        overlayColor={theme.headerTheme}
      />

      <Text
        style={styles.orLogin}
        onPress={() => {
          navigation.goBack();
        }}>
        Or Login
      </Text>
    </View>
  );
};

export default Signup;
