import React from 'react';
import { View, Text, FlatList,Switch, SafeAreaView} from 'react-native';
import { GetTheme } from '../../../Constant/Colors';
import {  HEIGHT } from '../../../Constant/Constant';
import HeaderSeven from '../../../Components/Header/HeaderSeven';
import Entypo from 'react-native-vector-icons/Entypo'
import { FONTS } from '../../../Constant/Fonts';
import { font_size } from '../../../Helper/Helpers';

interface User {
  name: string;
  email: string;
}

interface IPlayerListViewer {
  mode: string;
  users: any;
  selectedBroadCast:any[]
  onFriendItemPress:(item: any)=>void
  navigstionBack:()=>void
  contactOnNavigation:()=>void
  removeSelectedContact:(item:any)=>void
  title:string,
  groupSletecedUser:any
  groupPermissionData:any,
  selectedPermission:any
  selecteandUnselect:(data:string)=>void
  navigationGoBack:()=>void
}

const GroupPermissionsViewer: React.FC<IPlayerListViewer>=(props) => {
const theme=GetTheme()

  const {groupPermissionData,selectedPermission,selecteandUnselect,navigationGoBack}=props
 
 
  const PermissionComponet=({item}:any)=>{

  return  <View style={{flexDirection:'row',flex:1}}>
    <View style={{flexDirection:'row',flex:0.15,alignItems:'center',justifyContent:'center',backgroundColor:theme.background}}>
        <Entypo name={item.icon} color={theme.headerTheme} size={30}></Entypo>
    </View>
    <View style={{flexDirection:'row',flex:0.65,alignItems:'center'}}>
        <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{fontFamily:FONTS.OpenSans_Bold,color:theme.text,fontSize:font_size(16)}}>{item.title}</Text>
        <Text style={{fontFamily:FONTS.OpenSans_Regular,color:theme.text}}>{item.descriptions}</Text>
</View>

    </View>
    <View style={{flexDirection:'row',flex:0.2}}>
        <Switch 
     trackColor={{false: '#767577', true: theme.headerTheme}}
     thumbColor={theme.headerTheme}
    
     ios_backgroundColor={theme.background}
     onValueChange={()=>selecteandUnselect(item.icon)}
     value={!!selectedPermission.find((ele: { type: any; is_select: boolean; })=>ele.type===item.icon&&ele.is_select===true)}
        />
    </View>


    </View>
  }
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={{flex:1,backgroundColor:theme.background}}>
        <HeaderSeven title={'Group Permissions'} 
        onPress={()=>navigationGoBack()} 
          menuVisible={false}
           menuList={[]}
            subTitle={''} 
            onPressMenu={function (data: string): void {
              throw new Error('Function not implemented.');
          } } 
          onPressDeleteMessage={function (): void {
              throw new Error('Function not implemented.');
          } }></HeaderSeven>
  <Text style={{marginLeft:10,fontSize:font_size(16),fontFamily:FONTS.OpenSans_Bold}}>Participant can :</Text>
  <FlatList
  data={groupPermissionData.PARTICIPANTS}
  renderItem={({ item }) => {
    return <View style={{height:HEIGHT/8,margin:10}}>
  
       <PermissionComponet
       item={item}
       />
    </View>
  }}
/>
<Text style={{marginLeft:10,fontSize:font_size(16),fontFamily:FONTS.OpenSans_Bold}}>Admin can :</Text>

<FlatList
  data={groupPermissionData.ADMINS}
  renderItem={({ item }) => {
    return    <View style={{height:HEIGHT/10,margin:10}}>
  
    <PermissionComponet
    item={item}
    />
 </View>
  }}
/>
    
    </View>
    </SafeAreaView>
  );
};

export default GroupPermissionsViewer;

