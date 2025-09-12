import React,{FC} from "react";
import {  Text, TouchableOpacity, ImageBackground } from 'react-native'

import { COLORS } from "../../Constant/Colors";
import { FONT_SIZE } from "../../Constant/FontSize";
import { FONTS } from "../../Constant/Fonts";
import { scale, verticalScale, moderateScale} from "../../Constant/Metrics";


interface props {
    ButtonColor?: string,
    Text?: string,
    Height?: number,
    Width?: number,
    Edit?: boolean,
    onPress:() => void;
    textColor?: string

}

const SelectButton: FC<props> = (props) => {

    return(
        <TouchableOpacity
        onPress={() => props.onPress()}
        >
        <ImageBackground
          imageStyle={{ borderRadius: 10}}

        source={require('../../Assets/Images/background.jpg')}
        style={{height: props.Height ? verticalScale(props.Height) :verticalScale(47), width: props.Width ? scale(props.Width) : scale(280),
            justifyContent:'space-evenly', alignItems:'center',flexDirection:'row',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
        
            shadowOpacity: 0.35,
            shadowRadius: 3.25,
            elevation: 5
           }}
          
        >
            <Text style={{fontSize: moderateScale(FONT_SIZE.font_16),fontFamily:FONTS.OpenSans_Bold, color: props.textColor ? props.textColor : COLORS.White }}>
                {props.Text}
            </Text>
    
        </ImageBackground>
        </TouchableOpacity>
    )
}

export default SelectButton