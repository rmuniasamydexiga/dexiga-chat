
import React,{FC} from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native'

import { COLORS, GetTheme } from "../../Constant/Colors";
import { FONT_SIZE } from "../../Constant/FontSize";
import { FONTS } from "../../Constant/Fonts";
import {  verticalScale, moderateScale } from "../../Constant/Metrics";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { FlatList } from "react-native";
import { WIDTH } from "../../Constant/Constant";






interface props {
    title: string,
    onPress:() => void;
    menuVisible:boolean
    menuList:any[]
    subTitle:string
    onPressMenu:(data:string)=>void
    onPressDeleteMessage:()=>void
    isMediaHeader:boolean
    activeIndex:number
    navigationTab:(indexValue: any)=>void
}

const HeaderSeven: FC<props> = (props) => {
    const Theme = GetTheme()
    const {isMediaHeader,activeIndex,navigationTab}=props
    const styles = StyleSheet.create({
        HeaderText:{fontSize: moderateScale(FONT_SIZE.font_20), fontFamily:FONTS.OpenSans_Bold, color: Theme.BlackAndWhite, textAlignVertical:'center', marginBottom: '2%'}
    })

    return(
        <ImageBackground
        source={require('../../Assets/Images/background.jpg')}
        style={{ height: verticalScale(isMediaHeader?120:60),backgroundColor: Theme.headerTheme, elevation: 3}}>
                      <View style={{flex:0.1}}></View>

            <View style={{flex:isMediaHeader?0.6:0.9,flexDirection:'row'}}>
            <View style={{flex:0.15, justifyContent: isMediaHeader?'flex-start': 'center'}}>
                <TouchableOpacity style={{ alignItems:'center',width:'100%', height:'70%', justifyContent:isMediaHeader?'flex-start':'center'}}
                    onPress={() => props.onPress()}>
                  <FontAwesome name='angle-left' size={40} color={Theme.WHITE}></FontAwesome>
                </TouchableOpacity>
			</View>
                <View style={{flex:0.7,alignSelf:isMediaHeader?'flex-start':'center',marginLeft:10}}>
          <Text style={{fontSize:16,fontWeight:'700',color:COLORS.White,marginTop:isMediaHeader?10:0}}>{props.title}</Text>

          </View>
          <View style={{flex:0.25,flexDirection:'row'}}>
            <View style={{flex:0.5,alignSelf:'center'}}>
       
            </View>
           
          
          </View>
</View>
{isMediaHeader&&
<View style={{flex:0.3}}>
<FlatList
        data={['Media','Docs']}
        horizontal={true}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity style={{width:WIDTH/2.2, borderBottomColor:Theme.lightBlue,borderBottomWidth:activeIndex===index?5:0,marginRight:10}} onPress={()=>navigationTab(index)}>
<Text style={{fontSize:14,fontFamily:FONTS.OpenSans_Bold,color:'#ffffff',textAlign:'center'}}>{item}</Text>
            </TouchableOpacity>
          )
      
        }}
        keyExtractor={(item, index) => index.toString()}
      />
</View>
}
        </ImageBackground>
    )
}

export default HeaderSeven
