import React, {useEffect, useState} from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectChatList,
  selectDocumentList,
  selectMediaList,
  selectUser,
  selectedChannelDetails,
  setChatChanneDetails,
  setChatList,
} from '../../redux/chatSlice';
import {Paths} from '../../chat-services/constant/ScreenName';
import {deleteBraodCast, updateBroadCast} from '../../chat-firebase/channel';

import {HeaderFive, PageContainer, useStylesheet,SpinnerModal, VectorIcon, useAssets } from 'react-native-dex-moblibs';
import {View, Text,  FlatList, Image, TouchableOpacity, ImageBackground,BackHandler} from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import BroadCastInfoViewer from '../../Viewer/Newbroadcast/BroadCastInfoViewer';
import {showLog} from '../../chat-services/common';
import { MESSAGE_TYPE, WIDTH } from '../../chat-services/constant/constant';
import { getFileUrlForInternal, getFileUrlForInternalReceiver } from '../../chat-services/MediaHelper';


const BroadCastInfoController: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const channel = useSelector(selectedChannelDetails);
  const  groupParticpantsList=
        channel?.participants?.[0]?.broadCastUserChannels || []
      
  const users = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [selectedUser, SetSelectedUser] = useState({});
  const mediaList = useSelector(selectMediaList);
  const documentList = useSelector(selectDocumentList);
  const chatList = useSelector(selectChatList);
const {theme}=useStylesheet()
const {images}=useAssets()

  useEffect(() => {
    if (route?.params?.groupSletecedUser) {
      updateBroadCastUser(route?.params?.groupSletecedUser);
    }
  }, [route]);
  const updateBroadCastUser = async (groupSletecedUser: any) => {
    setIsLoading(true);
    let result = await updateBroadCast(
      groupSletecedUser,
      users?.id,
      channel?.id,
    );

    let tempChanel = {
      ...channel,
      participants: [
        {
          ...channel?.participants?.[0],
          broadCastUserChannels: result?.data?.broadCastUserChannels,
        },
      ],
    };

    dispatch(setChatChanneDetails(tempChanel));

    setIsLoading(false);
  };
  const navigateExitGroup = async () => {
    setIsLoading(true);
    let chatLists = chatList.filter(ele => ele.id !== channel.id);
    dispatch(setChatList(chatLists));
    let result = await deleteBraodCast(channel, users?.id, 'delete');

    setIsLoading(false);
    if (result) {
      navigation.navigate(Paths.ChatList);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.goBack();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );
  const groupUserDetails=undefined
   const  onFriendItemPress=(data: any) => {
        SetSelectedUser(data);
        if (data?.name === 'Edit recipients') {
          navigation.navigate(Paths.AddNewBroadCast, {
            fromNavigation: Paths.BroadcastInfo,
            groupParticpantsList:
              channel?.participants?.[0]?.broadCastUserChannels,
          });
        } else {
          const id1: any = users.userID;
          const id2 = data?.id;
          if (id1 == id2) {
            return;
          }

          const channel = {
            id: id1 < id2 ? id1 + id2 : id2 + id1,
            name: data?.name,
            participants: [selectedUser],
          };
          dispatch(setChatChanneDetails(channel));
          navigation.navigate(Paths.Chat);
        }
      }

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
        onPress={() => navigation.navigate(Paths.Chat)}
        menuVisible={false} menuList={[]} 
             ></HeaderFive>
     {mediaList.length+documentList.length!==0&&<View style={{margin:10,backgroundColor:theme.colors.background,borderColor:'grey',borderRadius:10}}>
  <TouchableOpacity style={{ flexDirection:'row',height:30}} onPress={()=>navigation.navigate(Paths.MediaList)}>
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
  <Text style={{margin:10,fontSize:theme.typography.subSubTitle,fontFamily:theme.fonts.bold}}>{`${groupParticpantsList.length} recipients`}</Text>
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
      source={images['chat-user']
      }
      resizeMode="cover"
    />
              </Col>
              <Col style={{ marginLeft: 10 }}>
                <Row style={{ alignItems: "center" }}>
                  <Col>
                    <Text
                      style={{ fontFamily:theme.fonts.bold, fontSize: theme.typography.subSubTitle, color: theme.colors.text }}
                    >
                      {getName(item)}
                    </Text>
                    {item.isAdmin&&<Text style={{ fontFamily:theme.fonts.bold, fontSize: theme.typography.label, color:theme.colors.success}}>Admin</Text>}
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
  <Text style={{fontFamily:theme.fonts.bold,marginLeft:10,color:theme.colors.error,fontSize:theme.typography.superText}}>{'Delete BroadCast'}</Text>
  </TouchableOpacity>

</View>

</PageContainer>
);

};

export default BroadCastInfoController;
