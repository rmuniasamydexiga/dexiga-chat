import { StyleSheet, Dimensions } from 'react-native';
import { useStylesheet } from 'react-native-dex-moblibs';



const chatStyles = () => {

const { theme } = useStylesheet();

 return StyleSheet.create({
    container: {
        flex: 1,
      },
      header: {
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        color: 'purple',
        fontSize: theme.typography.superText,
        fontFamily: theme.fonts.bold
       
      },
      userItem: {
        width: Dimensions.get('window').width - 50,
        alignSelf: 'center',
        marginTop: 20,
        flexDirection: 'row',
        height: 60,
        borderWidth: 0.5,
        borderRadius: 10,
        paddingLeft: 20,
        alignItems: 'center',
      },
      userIcon: {
        width: 40,
        height: 40,
      },
      name: { color: 'black', marginLeft: 20, fontSize: theme.typography.superText},
  });
};

export default chatStyles;
