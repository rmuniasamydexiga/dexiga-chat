import React from "react";
import { View} from 'react-native'
import { scale, verticalScale} from "../../Constant/Metrics";
import Skeleton from "./SkeletonLoaderComponent";


export const NewsListLoader = () => {
    return(
        <View style={{ height: verticalScale(95), justifyContent:'space-evenly', alignItems:'center', flexDirection:'row', marginHorizontal: '6%', marginVertical: '2%',}}>
            <View style={{flex: 0.3, width: '100%'}}>
                <Skeleton height={verticalScale(85)} width={scale(85)} borderRadius={10} loopSpeed={1000}/>
            </View>
            <View style={{flex: 0.7, height: '100%', justifyContent:'space-evenly'}}>
                <Skeleton height={verticalScale(25)} width={scale(80)} borderRadius={10} loopSpeed={1000}/>
                <Skeleton height={verticalScale(35)} width={scale(200)} borderRadius={10} loopSpeed={1000}/>
            </View>
        </View>
    )
}

export const AlertListLoader = () => {
    return(
        <View style={{ height: verticalScale(80), justifyContent:'space-evenly', alignItems:'center', flexDirection:'row', marginHorizontal: '4%', marginVertical: '2%'}}>
            <View style={{flex: 0.24, width: '100%', alignItems:'center', justifyContent:'center'}}>
                <Skeleton height={65} width={65} borderRadius={130/2} loopSpeed={1000}/>
            </View>
            <View style={{flex: 0.76, height: '100%', justifyContent:'space-evenly'}}>
                <Skeleton height={verticalScale(32)} width={scale(230)} borderRadius={8} loopSpeed={1000}/>
                <Skeleton height={verticalScale(22)} width={scale(80)} borderRadius={8} loopSpeed={1000}/>
            </View>
        </View>
    )
}
