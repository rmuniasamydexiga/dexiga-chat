import React, {useState} from 'react';
import {View, Text, TextInput, Alert} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';

import {Paths} from '../../../chat-services/constant/ScreenName';
import authStyles from './LoginStyle';
import {SNACKBAR_MESSAGE_LENGTH, USER_TYPE} from '../../../chat-services/constant/constant';
import {signUpValidationSchema, validation} from '../../../chat-services/validation';
import {
  showLog,
  validateMobileNumber,
} from '../../../chat-services/common';
import { checkIfEmailExists, createUser } from '../../../chat-firebase/auth';
import { Button,PageContainer,RadioButton,snackBarMessage,SpinnerModal, useStylesheet } from 'react-native-dex-moblibs';

interface ISignup {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  navigation: NavigationProp<ParamListBase>;
}

const Signup: React.FC<ISignup> = props => {
  const [name, setName] = useState<string>('muniyaraj');
  const [errors, setErrors] = useState<any>(null);
  const [email, setEmail] = useState<string>('muni120@gmail.com');
  const [mobile, setMobile] = useState<string>('1234567890');
  const [password, setPassword] = useState<string>('Muni1@123');
  const [selectedOption, setSelectedOption] = useState<string>(USER_TYPE.PLAYER);
  const [confirmPassword, setConfirmPassword] = useState<string>('Muni1@123');
  const [isLoading, setIsLoading] = useState(false);

  const {navigation} = props;
  const styles = authStyles();
  const {theme} = useStylesheet()
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
      userId: userId,
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

    // ✅ Check if email exists
    const emailExists = await checkIfEmailExists(email);
    console.log('Email exists:', JSON.stringify(req));
    if (emailExists) {
      setIsLoading(false);
      Alert.alert('Email Already Exist');
      return;
    }else{
          setIsLoading(false);

    }

    // ✅ Create user
   let res= await createUser(userId, {
      name,
      userName: name,
      email,
      password,
      mobile,
      userId,
      userType: selectedOption,
    });
    console.log("resresres==>",JSON.stringify(res))

    setTimeout(() => {
      snackBarMessage(
        'User Registered Successfully',
        SNACKBAR_MESSAGE_LENGTH.LONG,
      );
      navigation.navigate(Paths.LOGIN);
    }, 2000);
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
    <PageContainer style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholderTextColor={theme.colors.text}
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
        placeholderTextColor={theme.colors.text}
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
        placeholderTextColor={theme.colors.text}
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
        placeholderTextColor={theme.colors.text}
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
        placeholderTextColor={theme.colors.text}
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
           
                       <Button
                                      title={'SUBMIT'}
                                      style={{ width: 220}}
                                      onPress={()=>registerUser()}
                                    />
       
      </View>
      <SpinnerModal
        content={'Loading....'}
        visible={isLoading}
      />

      <Text
        style={styles.orLogin}
        onPress={() => {
          navigation.goBack();
        }}>
        Or Login
      </Text>
    </PageContainer>
  );
};

export default Signup;
