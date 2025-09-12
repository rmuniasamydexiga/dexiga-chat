import { Text, View } from "react-native"
import { FONTS } from "../../Constant/Fonts"
import { GetTheme } from "../../Constant/Colors"



const ListEmptyComponent = (props: { message: string }) => {
    const colors=GetTheme()
    return (
        <View style={{flex:1,alignItems:'center',alignSelf:'center',marginTop:200}}>
           <Text style={{color:colors.text,fontFamily:FONTS.OpenSans_Regular}}>{props?.message}</Text>
        </View>
    )
  }

  export default ListEmptyComponent