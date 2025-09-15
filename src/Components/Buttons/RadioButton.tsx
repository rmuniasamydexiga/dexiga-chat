import { FC } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { useStylesheet } from "react-native-dex-moblibs";



interface props {
    selected: boolean
    label?: string
    onSelect:() => void
}

const RadioButton: FC<props> = (props) =>{

    const {theme} = useStylesheet()
    const styles = StyleSheet.create({
      radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
      },
      radioButtonCircle: {
        height: 20,
        width: 20,
        borderRadius: 20/2,
        borderWidth: 1,
        borderColor: theme?.colors.text,
        alignItems: 'center',
        justifyContent: 'center',
      },
      selectedRadioButtonInnerCircle: {
        height: 10,
        width: 10,
        borderRadius: 10/2,
        backgroundColor: theme?.colors.primary
      },
      radioButtonLabel: {
        color:theme?.colors.text,
        fontFamily:theme.fonts.regular,
        marginLeft: 10,
      },
    });

    return (
      <TouchableOpacity style={styles.radioButton} onPress={props.onSelect}>
        <View style={styles.radioButtonCircle}>
          {props.selected ? <View style={styles.selectedRadioButtonInnerCircle} /> : null}
        </View>
        <Text style={styles.radioButtonLabel}>{props.label}</Text>
      </TouchableOpacity>
    );
  };
  

export default RadioButton