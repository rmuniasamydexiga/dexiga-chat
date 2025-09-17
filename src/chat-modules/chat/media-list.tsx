import {  Alert, Platform, PermissionsAndroid } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectDocumentList, selectMediaList, selectUser, selectedChannelDetails } from '../../redux/chatSlice';
import { Paths } from '../../chat-services/constant/ScreenName';
import { MESSAGE_TYPE } from '../../chat-services/constant/constant';
import { getFileUrlForInternal, getFileViewer } from '../../chat-services/MediaHelper';
import { View, Text,FlatList,TouchableOpacity, ImageBackground} from 'react-native';
import { dayDate, ListEmptyComponent, useStylesheet, VectorIcon, verticalScale,HeaderSeven,chatStyles } from 'react-native-dex-moblibs';
import { getName } from '../../chat-services/common';




  
const MediaListController: React.FC= () => {
const navigation=useNavigation()
const route=useRoute<any>()
const user=useSelector(selectUser)
const channel=useSelector(selectedChannelDetails)
const [activeTabIndex,setActiveTabIndex]=useState(0)
    const mediaList=useSelector(selectMediaList)  
    const documentList=useSelector(selectDocumentList)
 
  const styles =chatStyles()
const {theme}=useStylesheet()

const   navigationToMediaList=(data)=>{
        if(data.messageType===MESSAGE_TYPE.DOCUMENT){
          getFileViewer(data)
        }else{
        navigation.navigate(Paths.MediaViewer,{data:data})
        }
    }
   const goNavigationBack=()=>{
    navigation.goBack()
   }

     return (
    <View
      style={[
        styles.container
      ]}
    >
      <HeaderSeven
      title={getName(channel)} 
      subTitle={""}
      activeIndex={activeTabIndex}
      navigationTab={(data)=>setActiveTabIndex(data)}
      isMediaHeader={true}
      onPress={()=>navigation.goBack()} 
      menuVisible={false} menuList={[]} onPressMenu={function (data: string): void {
        throw new Error('Function not implemented.');
      } } 
      onPressDeleteMessage={function (): void {
        throw new Error('Function not implemented.');
      } }
      />
   {activeTabIndex===0?
    <FlatList
        data={mediaList}
        numColumns={3}
        ListEmptyComponent={()=>
            <ListEmptyComponent
            title={"No Media Found"} description={''} 
            type={'MaterialIcons'} 
            name={''} size={0}         
               />
        }

        renderItem={({ item, index }) => {
          return (
           <ImageBackground
           
           source={{ uri:getFileUrlForInternal(item)}}
            style={{height:verticalScale(120),width:WIDTH/3,margin:1}}>
                <TouchableOpacity style={{flex:1}} onPress={()=>navigationToMediaList(item)}>
                <View style={{flex:0.75}}/>
{item.messageType===MESSAGE_TYPE.VIDEO&&<View style={{flex:0.25,marginLeft:10}}>
    <VectorIcon name={'videocam'} color={theme.colors.white} size={18} type='Ionicons'/>
</View>}
</TouchableOpacity>
           </ImageBackground>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />:
  
      documentList.length!==0? documentList.map((item:any, index:any ) => {
        return (
            <>
            <TouchableOpacity style={{flexDirection:'row',margin:10,backgroundColor:theme.colors.borderColor,borderRadius:10}} onPress={()=>navigationToMediaList(item)}>
            <View style={{flex:0.2}}>
              <View style={{height:80,backgroundColor:theme.colors.background,borderRadius:10}}>
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
<Text style={{textAlign:'center', color:theme.colors.white}}>{item.fileName?item.fileName.split('.')[1]:''}</Text>
</View>
</View>
            </View>
            <View style={{flex:0.7}}>
            <Text style={{marginLeft:10}} numberOfLines={1}>{item.fileName}</Text>
            </View>
            <Text style={{ fontFamily:theme.fonts.regular,fontSize: theme.typography.label, alignSelf: 'flex-end', color: theme.colors.borderColor,marginTop:0 }}>
{item?.created ? dayDate(item?.created) : ''}
</Text>
            </TouchableOpacity>
   
</>
        );
        }):
        <ListEmptyComponent
            title={"No documents Found"} description={''} type={'MaterialIcons'} name={''} size={0}        />
    
}
    
    </View>
  );
};

export default MediaListController;


