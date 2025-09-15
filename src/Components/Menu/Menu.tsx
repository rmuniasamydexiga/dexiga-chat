import React from 'react'; 
import { View } from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';
import { useStylesheet } from 'react-native-dex-moblibs';

  

export const PopupMenu = (props: { visible: boolean | undefined; hideMenu: (arg0: string) => void; menuList: any[]; }) => {

const {theme}=useStylesheet() 
    return <View style={{ height: '2%', alignItems: 'center', justifyContent: 'center' }}>
    <Menu
    style={{backgroundColor:theme.colors.background}}
      visible={props.visible}
     
    
      onRequestClose={()=>props.hideMenu('Menu item 1')}
    >
      {props.menuList.map(ele=>{
     return <MenuItem  textStyle={{color:theme.colors.text}} onPress={()=>props.hideMenu(ele)}>{ele}</MenuItem>
      })}

    </Menu>
  </View>
}