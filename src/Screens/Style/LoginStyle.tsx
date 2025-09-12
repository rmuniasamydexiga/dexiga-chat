import { StyleSheet } from 'react-native';

import { GetTheme } from '../../Constant/Colors';
import { FONTS } from '../../Constant/Fonts';



const authStyles = () => {
  const  theme= GetTheme()


 return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:theme.background
    },
    title: {
      fontSize: 30,
      color: theme.text,
      alignSelf: 'center',
      marginTop: 100,
      fontWeight: '600',
    },
    input: {
      width: '90%',
      height: 50,
      color:theme.text,
      borderWidth: 0.5,
      fontFamily:FONTS.OpenSans_Regular,
      borderColor:theme.text,
      borderRadius: 10,
      alignSelf: 'center',
      paddingLeft: 20,
    },
    error: {
      fontFamily:FONTS.OpenSans_Regular,   
      marginTop:10,
      paddingLeft: 20,
    },
    btn: {
      width: '90%',
      height: 50,
      borderRadius: 10,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
      backgroundColor: theme.headerTheme
    },
    btnText: {
      color: 'white',
      fontSize: 20,
    },
    orLogin: {
      alignSelf: 'center',
      marginTop: 50,
      fontSize: 20,
      
      textDecorationLine: 'underline',
      fontFamily:FONTS.OpenSans_Medium,
      color: 'black',
    },
  });
};

export default authStyles;
