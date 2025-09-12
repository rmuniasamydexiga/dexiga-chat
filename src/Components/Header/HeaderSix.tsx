
import React,{FC} from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput, Alert } from 'react-native'

import { COLORS, GetTheme } from "../../Constant/Colors";
import { FONT_SIZE } from "../../Constant/FontSize";
import { FONTS } from "../../Constant/Fonts";
import {  verticalScale, moderateScale } from "../../Constant/Metrics";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from "react-native-vector-icons/Feather";






interface props {
    title: string,
    onPress:() => void;
    menuVisible:boolean
    menuList:any[]
    subTitle:string
    onPressMenu:(data:string)=>void
    onPressDeleteMessage:()=>void
    isHideSearch:boolean
    searchText:(txt:string)=>void
    searchPressBack:()=>void
    searchPress:()=>void
    showTextInput:boolean,
    searchValue:string
}

const HeaderSix: FC<props> = (props) => {
    const Theme = GetTheme()
    const styles = StyleSheet.create({
        HeaderText:{fontSize: moderateScale(FONT_SIZE.font_20), fontFamily:FONTS.OpenSans_Bold, color: Theme.BlackAndWhite, textAlignVertical:'center', marginBottom: '2%'}
    })

    return(
      props.showTextInput?
      <ImageBackground
      source={require('../../Assets/Images/background.jpg')} style={{ height: verticalScale(75),backgroundColor: Theme.headerTheme, elevation: 3}}>
       <View style={{height:50,margin:10,backgroundColor:Theme.background,borderWidth:2,borderColor:Theme.text, borderRadius:20,flexDirection:'row'}}>
      <View style={{flex:0.05}}/>
      <TouchableOpacity style={{flex:0.1}} onPress={()=>props.searchPressBack()}>
      <FontAwesome name='angle-left' size={40} color={Theme.text}></FontAwesome>
      </TouchableOpacity>
      <TextInput
      value={props.searchValue||''}
      placeholder="Enther the search"
      placeholderTextColor={Theme.text}
      style={{color:Theme.text}}
      autoFocus={true}
      onChangeText={(txt)=>props.searchText(txt)}
      ></TextInput>
     </View>
     </ImageBackground>:
      <ImageBackground
      source={require('../../Assets/Images/background.jpg')}
         style={{ height: verticalScale(60),backgroundColor: Theme.headerTheme, elevation: 3}}>
                   <View style={{flex:0.25}}></View>

            <View style={{flex:0.65,flexDirection:'row'}}>
            <View style={{flex:0.15, justifyContent: 'center'}}>
                <TouchableOpacity style={{ alignItems:'center',width:'100%', height:'70%', justifyContent:'center',marginTop:-10}}
                 onPress={() => props.onPress()}
                    >
            {/* <SvgXml xml={BACK_BUTTON} width={15} height={20}/> */}
                  <FontAwesome name='angle-left' size={35} color={Theme.WHITE}></FontAwesome>
                </TouchableOpacity>
			</View>
                <View style={{flex:0.7,alignSelf:'center',marginLeft:10,marginTop:props.subTitle===""?12:0}}>
          <Text style={{fontSize:16,fontWeight:'700',color:COLORS.White}}>{props.title}</Text>
          <Text style={{fontSize:12,fontWeight:'400',color:COLORS.White}}>{props.subTitle}</Text>

          </View>
          <View style={{flex:0.25,flexDirection:'row'}}>
        
         
            <View style={{flex:0.4,alignSelf:'center'}}>
            {/* <Feather name="search" style={{margin:10}} color={COLORS.White} size={20}></Feather> */}
            </View>
            {/* <View style={{flex:0.5,alignSelf:'center'}}>
            <Entypo name="dots-three-vertical" style={{margin:10}} color={COLORS.White} size={20}></Entypo>
            </View> */}
            {!props?.isHideSearch&&
              <TouchableOpacity style={{flex:0.5,alignSelf:'center'}} onPress={()=>props.searchPress()}>
            <Feather name="search" style={{}} color={COLORS.White} size={20}></Feather>
            </TouchableOpacity>
}
            
          </View>
</View>

        </ImageBackground>


    )
}

export default HeaderSix
