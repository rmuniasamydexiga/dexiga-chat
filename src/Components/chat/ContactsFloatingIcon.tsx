import React from "react";
import { ImageBackground, TouchableOpacity } from "react-native";
import  MaterialCommunityIcons  from "react-native-vector-icons/MaterialCommunityIcons";


export default function ContactsFloatingIcon(props:any) {


  return (
    <ImageBackground
    imageStyle={{ borderRadius: 60}}
    style={{
      position: "absolute",
      right: 20,
      bottom: 20,
     
      width: 60,
      height: 60,

      alignItems: "center",
      justifyContent: "center",
    }}
    source={require('../../Assets/Images/background.jpg')}
    >
    <TouchableOpacity
      onPress={() =>props.contactOnNavigation()}
    
    >
      <MaterialCommunityIcons
        name={props.name|| "android-messages"}
        size={30}
        color="white"
        style={{ transform: [{ scaleX: -1 }] }}
      />
    </TouchableOpacity>
    </ImageBackground>
  );
}
