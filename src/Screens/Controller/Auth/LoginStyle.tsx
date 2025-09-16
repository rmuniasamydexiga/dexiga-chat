import { StyleSheet } from 'react-native';
import { useStylesheet } from 'react-native-dex-moblibs';



const authStyles = () => {
const {theme}=useStylesheet()

 return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:theme.colors.background
    },
    title: {
      fontSize: 30,
      color: theme.colors.text,
      alignSelf: 'center',
      marginTop: 100,
    fontFamily:theme.fonts.bold
    },
    input: {
      width: '90%',
      height: 50,
      color:theme.colors.text,
      borderWidth: 0.5,
      fontFamily:theme.fonts.regular,
      borderColor:theme.colors.text,
      borderRadius: 10,
      alignSelf: 'center',
      paddingLeft: 20,
    },
    error: {
      fontFamily:theme.fonts.regular,
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
      backgroundColor: theme.colors.primary
    },
    btnText: {
      color:  theme.colors.text,
      fontSize: 20,
    },
    orLogin: {
      alignSelf: 'center',
      marginTop: 50,
      fontSize: 20,
      
      textDecorationLine: 'underline',
      fontFamily:theme.fonts.regular,
      color:  theme.colors.textInverse,
    },
  });
};

export default authStyles;
