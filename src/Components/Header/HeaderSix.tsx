
import React,{FC} from "react";
import { View, Text, TouchableOpacity, ImageBackground, TextInput } from 'react-native'

import {  verticalScale } from "../../Constant/Metrics";
import { useStylesheet, VectorIcon } from "react-native-dex-moblibs";






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
    const {theme}=useStylesheet()
  

    return(
      props.showTextInput?
      <ImageBackground
      source={require('../../Assets/Images/background.jpg')} style={{ height: verticalScale(75),backgroundColor: theme.colors.background, elevation: 3}}>
       <View style={{height:50,margin:10,backgroundColor:theme.colors.background,borderWidth:2,borderColor:theme.colors.text, borderRadius:20,flexDirection:'row'}}>
      <View style={{flex:0.05}}/>
      <TouchableOpacity style={{flex:0.1}} onPress={()=>props.searchPressBack()}>
      <VectorIcon name='angle-left' size={40} color={theme.colors.text} type="FontAwesome"></VectorIcon>
      </TouchableOpacity>
      <TextInput
      value={props.searchValue||''}
      placeholder="Enther the search"
      placeholderTextColor={theme.colors.text}
      style={{color:theme.colors.text}}
      autoFocus={true}
      onChangeText={(txt)=>props.searchText(txt)}
      ></TextInput>
     </View>
     </ImageBackground>:
      <ImageBackground
      source={require('../../Assets/Images/background.jpg')}
         style={{ height: verticalScale(60),backgroundColor: theme.colors.background, elevation: 3}}>
                   <View style={{flex:0.25}}></View>

            <View style={{flex:0.65,flexDirection:'row'}}>
            <View style={{flex:0.15, justifyContent: 'center'}}>
                <TouchableOpacity style={{ alignItems:'center',width:'100%', height:'70%', justifyContent:'center',marginTop:-10}}
                 onPress={() => props.onPress()}
                    >
            {/* <SvgXml xml={BACK_BUTTON} width={15} height={20}/> */}
                  <VectorIcon type="FontAwesome" name='angle-left' size={35} color={theme.colors.white}></VectorIcon>
                </TouchableOpacity>
			</View>
                <View style={{flex:0.7,alignSelf:'center',marginLeft:10,marginTop:props.subTitle===""?12:0}}>
          <Text style={{fontSize:theme.typography.subSubTitle,fontFamily:theme.fonts.bold,color:theme.colors.white}}>{props.title}</Text>
          <Text style={{fontSize:theme.typography.label,fontFamily:theme.fonts.regular,color:theme.colors.white}}>{props.subTitle}</Text>

          </View>
          <View style={{flex:0.25,flexDirection:'row'}}>
        
         
            <View style={{flex:0.4,alignSelf:'center'}}>
            </View>
          
            {!props?.isHideSearch&&
              <TouchableOpacity style={{flex:0.5,alignSelf:'center'}} onPress={()=>props.searchPress()}>
            <VectorIcon name="search" style={{}} color={theme.colors.white} size={20} type="Feather"></VectorIcon>
            </TouchableOpacity>
}
            
          </View>
</View>

        </ImageBackground>


    )
}

export default HeaderSix
