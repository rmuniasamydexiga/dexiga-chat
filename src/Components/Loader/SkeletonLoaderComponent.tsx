import React, {FC} from "react";
import { View} from 'react-native'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


interface props {
    height: number,
    width: number,
    borderRadius: number,
    loopSpeed: number,

}


const Skeleton: FC<props> = (props) => {

   

    return (
     

        <View>
            <SkeletonPlaceholder speed={props.loopSpeed}>
                <View>
                    <SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item height={props.height} width={props.width} borderRadius={props.borderRadius} />
                    </SkeletonPlaceholder.Item>
                </View>
            </SkeletonPlaceholder>
        </View>
    )
}

export default Skeleton