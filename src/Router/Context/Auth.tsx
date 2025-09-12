import React, { useContext, useState } from 'react';
import { setChatChanneDetails } from '../../Redux/chat/reducers';
import { useDispatch } from 'react-redux';



const AuthContext = React.createContext<any>({});


export const AuthProvider = (props:any) => {
  const [chatList, setChatList] = useState([]);
  const [channel, setChannel] = useState({})
  const [chatConversations, setChatConversations] = useState([])
  const [usersSubscribe,setUsersSubscribe]= useState()
  const [channelsSubscribe,setChannelsSubscribe]= useState()
  const [channelParticipantSubscribe,setChannelParticipantSubscribe]= useState()
const   [messageChannelCount,setMessageChannelCount]=useState({})
const dispatch=useDispatch()
    const resetChatAlldata = () => {

    setChatList([])
    setChannel({})
    setChatChanneDetails({})
    setChatConversations([])
    setMessageChannelCount({})
   
   
  }
  const setOrUpdateChatList = (chatList: any) => {
    setChatList(chatList)
  }
  const setChannelCount = (channelCount: any) => {
    setMessageChannelCount(channelCount)
  }
  
  const setOrUpdateChannel = (channel: any) => {
    dispatch(setChatChanneDetails(channel))

  }

  const setOrUpdateUsers= (data: any) => {
    setUsersSubscribe(data)
  }
  const setOrUpdateChannelsSubscribe= (data: any) => {
    setChannelsSubscribe(data)
  }
  const setOrUpdateChannelParticipants = (data: any) => {
    setChannelParticipantSubscribe(data)
  }
 
  return (
    <AuthContext.Provider
      value={{
        setChannelCount,
        resetChatAlldata,
        setOrUpdateChatList,
        setOrUpdateChannel,
        setOrUpdateUsers,
        setOrUpdateChannelsSubscribe,
        setOrUpdateChannelParticipants,
        messageChannelCount,
        chatList,
        channel,
        chatConversations,
        usersSubscribe,
        channelsSubscribe,
        channelParticipantSubscribe
        
      }}
      {...props}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
