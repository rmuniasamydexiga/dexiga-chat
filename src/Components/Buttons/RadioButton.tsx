import { FC } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { GetTheme } from "../../Constant/Colors";
import { FONTS } from "../../Constant/Fonts";



interface props {
    selected: boolean
    label?: string
    onSelect:() => void
}

const RadioButton: FC<props> = (props) =>{

    const Theme = GetTheme()
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
        borderColor: Theme.text,
        alignItems: 'center',
        justifyContent: 'center',
      },
      selectedRadioButtonInnerCircle: {
        height: 10,
        width: 10,
        borderRadius: 10/2,
        backgroundColor: Theme.headerTheme,
      },
      radioButtonLabel: {
        color:Theme.text,
        fontFamily:FONTS.OpenSans_Regular,
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