import React from 'react'; 
import { View } from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';
import { GetTheme } from '../../Constant/Colors';

  

export const PopupMenu = (props: { visible: boolean | undefined; hideMenu: (arg0: string) => void; menuList: any[]; }) => {

const theme=GetTheme()
 
    return <View style={{ height: '2%', alignItems: 'center', justifyContent: 'center' }}>
    <Menu
    style={{backgroundColor:theme.background}}
      visible={props.visible}
     
    
      onRequestClose={()=>props.hideMenu('Menu item 1')}
    >
      {props.menuList.map(ele=>{
     return <MenuItem  textStyle={{color:theme.text}} onPress={()=>props.hideMenu(ele)}>{ele}</MenuItem>
      })}

    </Menu>
  </View>
}