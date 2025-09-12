import { createSlice } from '@reduxjs/toolkit';
import { SELECTED_PERMISSION } from '../../Constant/Constant';


const chatSlice = createSlice({
  name: 'chat',
 
  initialState: {
    chatList: [],
    chatConversations: {},
    channelDetails:{},
    groupParticpantsList:[],
    user:{},
    userList:[],
    fileList:[],
    thread:[],
    mediaList:[],
    documentList:[],
    internalFileList:[],
    selectedGroupPermissions:SELECTED_PERMISSION,
    bulkChatSendList:[],
    audioDuration:0

  },
  reducers: {
    setChatList: (state, action) => {
      state.chatList = action.payload;
    },
    setUserList:(state, action)=>{
      state.userList= action.payload;
    },
    setAudioDuration:(state, action)=>{
      state.audioDuration = action.payload;
    },
    setBulkChatSendList:(state, action)=>{
      state.bulkChatSendList = action.payload;
    }, 
     reSetBulkChatSendList:(state, action)=>{
      state.bulkChatSendList = action.payload;
    },
    setThread:(state, action) => {
      state.thread = action.payload;
    },
    setMediaList:(state, action) => {
      state.mediaList = action.payload;
    },
    setDocumentList:(state, action) => {
      state.documentList = action.payload;
    },
    setChatChanneDetails: (state, action) => {
      state.channelDetails = action.payload;
    },
    setChatConversations: (state, action) => {
      state.chatConversations = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setFileList: (state, action) => {
      state.fileList = action.payload;
    },
    setInternalFileList: (state, action) => {
      state.internalFileList = action.payload;
    },
    
    resetPermissions:(state, action)=>{
      state.selectedGroupPermissions =SELECTED_PERMISSION
    },
    setPermssions:(state,action)=>{
      state.selectedGroupPermissions=action.payload
    },
    setParticipantsList:(state,action)=>{
      state.groupParticpantsList=action.payload
    },
   
    resetChat: (state) => {
      state.chatList = [];
      state.chatConversations = {};
      state.user={}
      state.userList=[]
      state.thread=[]
      state.mediaList=[]
      state.documentList=[]
      state.groupParticpantsList=[],
      state.internalFileList=[]
      state.bulkChatSendList=[]
      state.audioDuration=0
      state.selectedGroupPermissions=SELECTED_PERMISSION
    },
  }, 
});

  export const selectChatList = (state: { chat: { chatList: any[] }; }) => {
    return state.chat.chatList

  };
  export const selectUserList = (state: { chat: { userList: any[] }; }) => {
    return state.chat.userList

  };
  export const selectAudioDuration=(state:{chat:{audioDuration:number}})=>{
    return state.chat.audioDuration
  }
  export const selectedChannelDetails= (state: { chat: { channelDetails:any }; }) => {
    return state.chat.channelDetails
  };
  export const selectedBulkChatSendList= (state: { chat: { bulkChatSendList:any }; }) => {
    return state.chat.bulkChatSendList
  };
  
  export const selectThread= (state: { chat: { thread:any }; }) => {
    return state.chat.thread
  
  };
  export const selectUser= (state: { chat: { user:any }; }) => {
    return state.chat.user
  };
  export const selectMediaList= (state: { chat: { mediaList:any }; }) => {
    return state.chat.mediaList
  };
  export const selectDocumentList= (state: { chat: { documentList:any }; }) => {
    return state.chat.documentList
  };
  export const selectFlieList= (state: { chat: { fileList:any }; }) => {
    return state.chat.fileList
  };
  export const selectInternalFlieList= (state: { chat: { internalFileList:any }; }) => {
    return state.chat.internalFileList
  };

  export const selectGroupPermission=(state: { chat: { selectedGroupPermissions:any }; }) => {
    return state.chat.selectedGroupPermissions
  }
  export const selectChannelGroupParticipants= (state: { chat: { groupParticpantsList:any }; }) => {
    return state.chat.groupParticpantsList
  };

export const { setChatList, setChatChanneDetails,setChatConversations, resetChat,setUser,setFileList, setPermssions,resetPermissions,setParticipantsList,setInternalFileList ,setThread,setMediaList,setDocumentList,setBulkChatSendList,reSetBulkChatSendList,setUserList,setAudioDuration} = chatSlice.actions;

export default chatSlice.reducer;