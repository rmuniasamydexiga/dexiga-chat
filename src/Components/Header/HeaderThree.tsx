


import React,{FC} from "react";
import { View,TouchableOpacity, ImageBackground } from 'react-native'
import {  verticalScale } from "../../Constant/Metrics";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { useStylesheet } from "react-native-dex-moblibs";




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
    const {theme}=useStylesheet() 

    return(
        <ImageBackground
        source={require('../../Assets/Images/background.jpg')}
         style={{ height: verticalScale(70), flexDirection:'row', alignItems:'center', backgroundColor: theme.colors.background, elevation: 3}}>
            <View style={{flex:0.15, justifyContent: 'center'}}>
                <TouchableOpacity style={{ alignItems:'center',width:'100%', height:'70%', justifyContent:'center'}}
                    onPress={() => props.onPress()}>
                  <FontAwesome name='angle-left' size={40} color={theme.colors.white}></FontAwesome>
                </TouchableOpacity>
			</View>
		
            <View style={{flex:0.35, justifyContent: 'center'}}>

</View>
		
          
               <TouchableOpacity style={{flex:0.15,flexDirection:'row-reverse'}} onPress={()=>props.onPressDeleteMessage()}>
               <MaterialIcons  name='delete' size={30} color={theme.colors.white}></MaterialIcons>
            </TouchableOpacity>
            {props.outBond?<TouchableOpacity style={{flex:0.15,flexDirection:'row-reverse'}} onPress={()=>props.onPressMenu("info")}>
               <Feather  name='info' size={30} color={theme.colors.white}></Feather>
            </TouchableOpacity>:<View style={{flex:0.15,flexDirection:'row-reverse'}} />}
            <TouchableOpacity style={{flex:0.15,flexDirection:'row-reverse'}} disabled={!props?.showCopyButton} onPress={()=>props.onPressMenu("copy")}>
            {props?.showCopyButton&&<MaterialCommunityIcons  name='content-copy' size={30} color={theme.colors.white}></MaterialCommunityIcons>}

            </TouchableOpacity>
          

        </ImageBackground>
    )
}

export default HeaderThree
