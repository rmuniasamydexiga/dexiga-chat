import React from 'react';
import {View, Text,  FlatList, Image, TouchableOpacity,Alert, ImageBackground, SafeAreaView} from 'react-native';
import { FONTS } from '../../../Constant/Fonts';
import { font_size } from '../../../chat-services/Helpers';
import HeaderFive from '../../../Components/Header/HeaderFive';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { MESSAGE_TYPE, WIDTH } from '../../../Constant/Constant';
import { getFileUrlForInternal, getFileUrlForInternalReceiver } from '../../../chat-services/MediaHelper';
import { PageContainer, useStylesheet,SpinnerModal, VectorIcon } from 'react-native-dex-moblibs';

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
  groupUserActionSheetRef:any
  onGroupSettingsActionDone:()=>void
  navigatePermissions:()=>void
  channel:any
  selectedUser:any
  isExit:boolean
  navigateExitGroup:()=>void

  groupParticpantsList:any
  groupUserDetails:any
  documentList:any
  mediaList:any
  navigateMediaList:()=>void,
  isLoading:boolean
  
}

const BroadCastInfoViewer: React.FC<IPlayerListViewer>=(props) => {
const {theme}=useStylesheet()

  const {

    navigationGoBack,
    groupUserActionSheetRef,
    onGroupSettingsActionDone,
    onFriendItemPress,
    navigatePermissions,
  
    navigateExitGroup,
    navigateMediaList,
    channel,
    groupParticpantsList,
    users,
    isExit,
    selectedUser,
    groupUserDetails,
    documentList,
    mediaList,
    isLoading
}=props
  const getName=(data:any)=>{
    let name="name"
    if(data&&data.name){
        if(users.id===data.user){
            name="You"
        }else{
        name= data.name
        }
    }
    return name
  }
 
 

  return (
    <PageContainer>
          <HeaderFive 
        title={channel?.name}
        isHideSearch={true}
        subTitle={`BroadCast List ${groupParticpantsList.length} recipients`}
        isHideDot={true}
        onPress={() => navigationGoBack()}
        menuVisible={false} menuList={[]} onPressMenu={function (data: string): void {
          throw new Error('Function not implemented.');
        } }
        onPressDeleteMessage={function (): void {
          throw new Error('Function not implemented.');
        } } searchPress={function (): void {
          throw new Error('Function not implemented.');
        } } showTextInput={false} searchText={function (txt: string): void {
          throw new Error('Function not implemented.');
        } } searchPressBack={function (): void {
          throw new Error('Function not implemented.');
        } } onPressmenuVisible={function (): void {
          throw new Error('Function not implemented.');
        } }      ></HeaderFive>
     {mediaList.length+documentList.length!==0&&<View style={{margin:10,backgroundColor:theme.colors.background,borderColor:'grey',borderRadius:10}}>
  <TouchableOpacity style={{ flexDirection:'row',height:30}} onPress={()=>navigateMediaList()}>
  <View style={{flex:0.9,justifyContent:'center'}} >
  <Text style={{fontFamily:theme.fonts.regular,marginLeft:10}}>Media and documents</Text>
  </View>
  <View style={{flex:0.1,justifyContent:'center'}}>
    <View style={{flexDirection:'row'}}>
    <Text>{mediaList.length+documentList.length}</Text>
    <VectorIcon size={18} name={"right"} color={theme.colors.white}/>
    </View>
    </View>
    </TouchableOpacity>
    <SpinnerModal
            content={'Loading....'}
            visible={isLoading}
            // overlayColor={theme.colors.secondary}
            />
    <FlatList
      horizontal={true}
        data={mediaList}
        renderItem={({ item, index }) => {
          return (
            item.messageType!==MESSAGE_TYPE.DOCUMENT&&
            <ImageBackground
            source={{ uri: item.senderID!==users?.id?getFileUrlForInternalReceiver(item):getFileUrlForInternal(item)}}

            
            style={{height:70,width:WIDTH/5,margin:10}}>
            </ImageBackground>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
</View>}

<View style={{flex:1,backgroundColor:theme.colors.background,margin:10,borderRadius:10}}>
  <Text style={{margin:10,fontSize:font_size(16),fontFamily:theme.fonts.bold}}>{`${groupParticpantsList.length} recipients`}</Text>
  <FlatList
        data={
       
          [{name:'Edit recipients'},...groupParticpantsList]
    

        }
        renderItem={({ item, index }) => {
          return (item.isExit?<></>:
            <TouchableOpacity
            style={{ height: 80 }}
            disabled={item.user===groupUserDetails?.user&&item.isAdmin===true}
            onPress={() => onFriendItemPress(item)}
          >
            <Grid style={{ maxHeight: 80 }}>
              <Col
                style={{ width: 80, alignItems: "center", justifyContent: "center" }}
              >
                 <Image
      style={{
        width: 65,
        height: 65,
        borderRadius: 65,
      }}
      source={require("../../../Assets/Images/user.png")
      }
      resizeMode="cover"
    />
              </Col>
              <Col style={{ marginLeft: 10 }}>
                <Row style={{ alignItems: "center" }}>
                  <Col>
                    <Text
                      style={{ fontFamily:theme.fonts.bold, fontSize: 16, color: theme.colors.text }}
                    >
                      {getName(item)}
                    </Text>
                    {item.isAdmin&&<Text style={{ fontFamily:theme.fonts.bold, fontSize: 12, color:'green'}}>Admin</Text>}
                  </Col>
                   
              
                </Row>
              
              </Col>
            </Grid>
 
          </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
      </View>
   
      <View style={{height:60,flexDirection:'row',backgroundColor:theme.colors.background,margin:10,borderRadius:10}}>
      <View style={{flex:0.2,justifyContent:'center',marginLeft:10}}>
    <VectorIcon size={30} color={'red'} name={"delete"} type='MaterialIcons'/>
    </View>
  <TouchableOpacity style={{flex:0.8,justifyContent:'center'}} onPress={()=>navigateExitGroup()}>
  <Text style={{fontFamily:theme.fonts.bold,marginLeft:10,color:'red',fontSize:20}}>{'Delete BroadCast'}</Text>
  </TouchableOpacity>

</View>

</PageContainer>
);
};

export default BroadCastInfoViewer;

