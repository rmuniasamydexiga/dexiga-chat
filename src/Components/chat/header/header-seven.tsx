
import React,{FC} from "react";
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native'

import {  verticalScale } from "../../../Constant/Metrics";
import { FlatList } from "react-native";
import { WIDTH } from "../../../Constant/Constant";
import { useStylesheet, VectorIcon } from "react-native-dex-moblibs";






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
    const {theme}=useStylesheet()
    const {isMediaHeader,activeIndex,navigationTab}=props
   

    return(
        <ImageBackground
        source={require('../../../Assets/Images/background.jpg')}
        style={{ height: verticalScale(isMediaHeader?120:60),backgroundColor: theme.colors.background, elevation: 3}}>
                      <View style={{flex:0.1}}></View>

            <View style={{flex:isMediaHeader?0.6:0.9,flexDirection:'row'}}>
            <View style={{flex:0.15, justifyContent: isMediaHeader?'flex-start': 'center'}}>
                <TouchableOpacity style={{ alignItems:'center',width:'100%', height:'70%', justifyContent:isMediaHeader?'flex-start':'center'}}
                    onPress={() => props.onPress()}>
                  <VectorIcon name='angle-left' size={40} color={theme.colors.white} type="FontAwesome"></VectorIcon>
                </TouchableOpacity>
			</View>
                <View style={{flex:0.7,alignSelf:isMediaHeader?'flex-start':'center',marginLeft:10}}>
          <Text style={{fontSize:theme.typography.title,fontFamily:theme.fonts.bold,color:theme.colors.white,marginTop:isMediaHeader?10:0}}>{props.title}</Text>

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
            <TouchableOpacity style={{width:WIDTH/2.2, borderBottomColor:theme.colors.borderColor,borderBottomWidth:activeIndex===index?5:0,marginRight:10}} onPress={()=>navigationTab(index)}>
<Text style={{fontSize:theme.typography.subSubTitle,fontFamily:theme.fonts.bold,color:theme.colors.white,textAlign:'center'}}>{item}</Text>
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
