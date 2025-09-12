


import React,{FC} from "react";
import { View,TouchableOpacity, StyleSheet, ImageBackground } from 'react-native'

import { COLORS, GetTheme } from "../../Constant/Colors";
import { FONT_SIZE } from "../../Constant/FontSize";
import { FONTS } from "../../Constant/Fonts";
import {  verticalScale, moderateScale } from "../../Constant/Metrics";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";




interface props {
    title: string,
    onPress:() => void;
    menuVisible:boolean
    menuList:any[]
    onPressMenu:(data:string)=>void
    onPressDeleteMessage:()=>void
    outBond:boolean
    showCopyButton:boolean
}

const HeaderThree: FC<props> = (props) => {
    const Theme = GetTheme()
    const styles = StyleSheet.create({
        HeaderText:{fontSize: moderateScale(FONT_SIZE.font_20), fontFamily:FONTS.OpenSans_Bold, color: Theme.BlackAndWhite, textAlignVertical:'center', marginBottom: '2%'}
    })

    return(
        <ImageBackground
        source={require('../../Assets/Images/background.jpg')}
         style={{ height: verticalScale(70), flexDirection:'row', alignItems:'center', backgroundColor: Theme.headerTheme, elevation: 3}}>
            <View style={{flex:0.15, justifyContent: 'center'}}>
                <TouchableOpacity style={{ alignItems:'center',width:'100%', height:'70%', justifyContent:'center'}}
                    onPress={() => props.onPress()}>
            {/* <SvgXml xml={BACK_BUTTON} width={15} height={20}/> */}
                  <FontAwesome name='angle-left' size={40} color={COLORS.White}></FontAwesome>
                </TouchableOpacity>
			</View>
		
            <View style={{flex:0.35, justifyContent: 'center'}}>

</View>
		
          
               <TouchableOpacity style={{flex:0.15,flexDirection:'row-reverse'}} onPress={()=>props.onPressDeleteMessage()}>
               <MaterialIcons  name='delete' size={30} color={COLORS.White}></MaterialIcons>
            </TouchableOpacity>
            {props.outBond?<TouchableOpacity style={{flex:0.15,flexDirection:'row-reverse'}} onPress={()=>props.onPressMenu("info")}>
               <Feather  name='info' size={30} color={COLORS.White}></Feather>
            </TouchableOpacity>:<View style={{flex:0.15,flexDirection:'row-reverse'}} />}
            <TouchableOpacity style={{flex:0.15,flexDirection:'row-reverse'}} disabled={!props?.showCopyButton} onPress={()=>props.onPressMenu("copy")}>
            {props?.showCopyButton&&<MaterialCommunityIcons  name='content-copy' size={30} color={COLORS.White}></MaterialCommunityIcons>}
            
            </TouchableOpacity>
          

        </ImageBackground>
    )
}

export default HeaderThree
