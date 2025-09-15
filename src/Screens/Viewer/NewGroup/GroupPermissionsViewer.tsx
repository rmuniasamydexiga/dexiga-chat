import React from 'react';
import { View, Text, FlatList,Switch, SafeAreaView} from 'react-native';
import {  HEIGHT } from '../../../Constant/Constant';
import HeaderSeven from '../../../Components/Header/HeaderSeven';
import { FONTS } from '../../../Constant/Fonts';
import { font_size } from '../../../chat-services/Helpers';
import { PageContainer, useStylesheet, VectorIcon } from 'react-native-dex-moblibs';

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
const {theme}=useStylesheet()

  const {groupPermissionData,selectedPermission,selecteandUnselect,navigationGoBack}=props
 
 
  const PermissionComponet=({item}:any)=>{

  return  <View style={{flexDirection:'row',flex:1}}>
    <View style={{flexDirection:'row',flex:0.15,alignItems:'center',justifyContent:'center',backgroundColor:theme.colors.background}}>
       <VectorIcon name={item.icon} color={theme.colors.text} size={30} type='Entypo'></VectorIcon>
    </View>
    <View style={{flexDirection:'row',flex:0.65,alignItems:'center'}}>
        <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{fontFamily:theme.fonts.bold,color:theme.colors.text,fontSize:font_size(16)}}>{item.title}</Text>
        <Text style={{fontFamily:theme.fonts.regular,color:theme.colors.text}}>{item.descriptions}</Text>
</View>

    </View>
    <View style={{flexDirection:'row',flex:0.2}}>
        <Switch 
     trackColor={{false: '#767577', true: theme.colors.primary}}
     thumbColor={theme.colors.secondary}
     ios_backgroundColor={theme.colors.background}
     onValueChange={()=>selecteandUnselect(item.icon)}
     value={!!selectedPermission.find((ele: { type: any; is_select: boolean; })=>ele.type===item.icon&&ele.is_select===true)}
        />
    </View>


    </View>
  }
  return (
 <PageContainer>
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
  <Text style={{marginLeft:10,fontSize:font_size(16),fontFamily:theme.fonts.bold}}>Participant can :</Text>
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
<Text style={{marginLeft:10,fontSize:font_size(16),fontFamily:theme.fonts.bold}}>Admin can :</Text>

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
    
    </PageContainer>
  );
};

export default GroupPermissionsViewer;

