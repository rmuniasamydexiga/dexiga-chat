

import React,{FC} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native'

import {  verticalScale } from "../../Constant/Metrics";
import { PopupMenu } from "../Menu/Menu";
import { useStylesheet, VectorIcon } from "react-native-dex-moblibs";


interface props {
    title: string,
    onPress:() => void;
    menuVisible:boolean
    menuList:any[]
    isTitleBtnDisable:boolean
    onPressMenu:(data:string)=>void
    navigationTitlePress:()=>void,
    outBond:boolean
}

const HeaderOne: FC<props> = (props) => {
    const {theme}=useStylesheet()
    const styles = StyleSheet.create({
        HeaderText:{fontSize: theme.typography.title, fontFamily:theme.fonts.bold, color: theme.colors.text, textAlignVertical:'center', marginBottom: '2%'}
    })

    return(
        <ImageBackground
        source={require('../../Assets/Images/background.jpg')}
        style={{ height: verticalScale(70), flexDirection:'row', alignItems:'center', backgroundColor: theme.colors.background, elevation: 3}}>
            <View style={{flex:0.15, justifyContent: 'center'}}>
                <TouchableOpacity style={{ alignItems:'center',width:'100%', height:'70%', justifyContent:'center'}}
                    onPress={() => props.onPress()}>
            {/* <SvgXml xml={BACK_BUTTON} width={15} height={20}/> */}
                  <VectorIcon name='angle-left' size={40} color={theme.colors.white} type="FontAwesome"></VectorIcon>
                </TouchableOpacity>
			</View>
			<View style={{flex: 0.15, alignItems:'flex-start'}}>
          		<Image source={require('../../Assets/Images/user.png')} style={{height:45, width:45, borderRadius: 45/2}} />
			</View>
			<TouchableOpacity disabled={props.isTitleBtnDisable===true} style={{flex:0.55,alignItems:'flex-start', marginRight:'12%'}} onPress={()=>props.navigationTitlePress()}>
				<Text style={styles.HeaderText} numberOfLines={2}>
					{props.title}
				</Text>
			</TouchableOpacity>
            <TouchableOpacity style={{flex:0.15,flexDirection:'row-reverse'}} onPress={()=>props.onPressMenu("pop")}>
            <VectorIcon name='dots-vertical' size={30} color={theme.colors.white} type="MaterialCommunityIcons"></VectorIcon>
            </TouchableOpacity>
          
<PopupMenu
visible={props.menuVisible}
menuList={props.menuList}
hideMenu={(data: string)=>{

  props.onPressMenu(data)
}}

></PopupMenu>
        </ImageBackground>
    )
}

export default HeaderOne
