import React, {useEffect, useRef, useState} from 'react';
import { MESSAGE_TYPE, WIDTH} from '../../../Constant/Constant';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {

  selectDocumentList,
  selectMediaList,
  selectUser,
  selectedChannelDetails,
  setChatChanneDetails,
} from '../../../redux/chatSlice';
import {Paths} from '../../../Constant/ScreenName';
import {
  blockChat,
  updateBroadCast,
} from '../../../chat-firebase/channel';
import {BackHandler} from 'react-native';
import {View, Text,  FlatList, TouchableOpacity, ImageBackground} from 'react-native';
import { HeaderSix, PageContainer, useStylesheet, VectorIcon } from 'react-native-dex-moblibs';
import { getFileUrlForInternal, getFileUrlForInternalReceiver } from '../../../chat-services/MediaHelper';



const IndividualChatInfoController: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const channel = useSelector(selectedChannelDetails);
  const users = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const mediaList = useSelector(selectMediaList);
  const documentList = useSelector(selectDocumentList);
const {theme}=useStylesheet()

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

    setIsLoading(true);
  };
  const navigateBlockChat = async (data: string | undefined) => {
    let result = await blockChat(channel, users?.id, data);
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

    return (
  <PageContainer>
            <HeaderSix 
        title={channel?.name} 
        subTitle={``}
        isHideDot={true}
        isHideSearch={true}
        onPress={()=>navigation.navigate(Paths.Chat)} 
        menuVisible={false} menuList={[]} onPressMenu={function (data: string): void {
          throw new Error('Function not implemented.');
        } } 
        onPressDeleteMessage={function (): void {
          throw new Error('Function not implemented.');
        } }
        />
       {mediaList.length+documentList.length!==0&&<View style={{margin:10,backgroundColor:theme.colors.background,borderColor:'grey',borderRadius:10}}>
    <TouchableOpacity style={{ flexDirection:'row',height:30}} onPress={()=>navigation.navigate(Paths.MediaList)}>
    <View style={{flex:0.9,justifyContent:'center'}} >
    <Text style={{fontFamily:theme.fonts.regular,marginLeft:10}}>Media and documents</Text>
    </View>
    <View style={{flex:0.1,justifyContent:'center'}}>
      <View style={{flexDirection:'row'}}>
      <Text>{mediaList.length+documentList.length}</Text>
      <VectorIcon size={18} name={"right"} color={theme.colors.text}/>
      </View>
      </View>
      </TouchableOpacity>
      <FlatList
        horizontal={true}
          data={mediaList}
          renderItem={({ item, index }) => {
            if (item.messageType !== MESSAGE_TYPE.DOCUMENT) {
              return (
                <ImageBackground
                  source={{ uri: item.senderID !== users?.id ? getFileUrlForInternalReceiver(item) : getFileUrlForInternal(item) }}
                  style={{ height: 70, width: WIDTH / 5, margin: 10 }}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={(data) =>         navigation.navigate(Paths.MediaViewer, {data: data})
} />
                </ImageBackground>
              );
            }
            return null;
          }}
          keyExtractor={(item, index) => index.toString()}
        />
  </View>}
  
  
     
        <View style={{height:60,flexDirection:'row',backgroundColor:theme.colors.background,margin:10,borderRadius:10}}>
        <View style={{flex:0.2,justifyContent:'center',marginLeft:10}}>
      <VectorIcon size={30} color={'red'} name={"block"} type='MaterialIcons'/>
      </View>
    <TouchableOpacity style={{flex:0.8,justifyContent:'center'}} onPress={()=>navigateBlockChat(channel?.participants?.[0]?.blockedBy===users.id?CHAT_DETAILS_CONFIGURE.UN_BLOCK:CHAT_DETAILS_CONFIGURE.BLOCK)}>
    <Text style={{fontFamily:theme.fonts.bold,marginLeft:10,color:theme.colors.error,fontSize:theme.typography.superText}}>{channel?.participants?.[0]?.blockedBy===users.id?`Unblock ${channel?.participants?.[0]?.name}`:`Block ${channel?.participants?.[0]?.name}`}</Text>
    </TouchableOpacity>
  
  </View>
      
     </PageContainer>
    );
};

export default IndividualChatInfoController;
