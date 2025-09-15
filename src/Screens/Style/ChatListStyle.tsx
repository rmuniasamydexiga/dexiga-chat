import { StyleSheet, Dimensions } from 'react-native';




const chatStyles = () => {


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
        fontSize: 20,
        fontWeight: '600',
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
      name: { color: 'black', marginLeft: 20, fontSize: 20 },
  });
};

export default chatStyles;
