import React, { FC, useEffect, useRef, useState } from "react";

import dynamicStyles from "../../Screens/Viewer/Chat/styles";
import { View } from "react-native";



interface props {
   
  
     item:any,
    outBound:boolean,
    onPress:() => void;
    onMessageLongPress:(item:any)=>void,
   
}

const AudioMediaThreadItem: FC<props> = (props) => {
    const {  item, outBound } = props;

  const styles = dynamicStyles(outBound);

  


  return (
    <View style={styles.audioMediaThreadItemContainer}>
  
    </View>
  )

}
export default  AudioMediaThreadItem