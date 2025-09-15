


import React,{FC} from "react";
import { View,TouchableOpacity, ImageBackground } from 'react-native'
import {  verticalScale } from "../../../Constant/Metrics";
import { useStylesheet, VectorIcon } from "react-native-dex-moblibs";




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
        source={require('../../../Assets/Images/background.jpg')}
         style={{ height: verticalScale(70), flexDirection:'row', alignItems:'center', backgroundColor: theme.colors.background, elevation: 3}}>
            <View style={{flex:0.15, justifyContent: 'center'}}>
                <TouchableOpacity style={{ alignItems:'center',width:'100%', height:'70%', justifyContent:'center'}}
                    onPress={() => props.onPress()}>
                  <VectorIcon type="FontAwesome" name='angle-left' size={40} color={theme.colors.white}></VectorIcon>
                </TouchableOpacity>
			</View>
		
            <View style={{flex:0.35, justifyContent: 'center'}}>

</View>
		
          
               <TouchableOpacity style={{flex:0.15,flexDirection:'row-reverse'}} onPress={()=>props.onPressDeleteMessage()}>
               <VectorIcon  name='delete' size={30} color={theme.colors.white} type="MaterialIcons"></VectorIcon>
            </TouchableOpacity>
            {props.outBond?<TouchableOpacity style={{flex:0.15,flexDirection:'row-reverse'}} onPress={()=>props.onPressMenu("info")}>
               <VectorIcon  name='info' size={30} color={theme.colors.white} type="Feather"></VectorIcon>
            </TouchableOpacity>:<View style={{flex:0.15,flexDirection:'row-reverse'}} />}
            <TouchableOpacity style={{flex:0.15,flexDirection:'row-reverse'}} disabled={!props?.showCopyButton} onPress={()=>props.onPressMenu("copy")}>
            {props?.showCopyButton&&<VectorIcon  name='content-copy' size={30} color={theme.colors.white} type="MaterialCommunityIcons"></VectorIcon>}

            </TouchableOpacity>
          

        </ImageBackground>
    )
}

export default HeaderThree
