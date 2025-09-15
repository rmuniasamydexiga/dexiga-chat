import {Platform, Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');
export const PLATFORM = Platform.OS;
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IPAD = Platform.OS === 'ios' && Platform.isPad;
export const HEIGHT = height;
export const WIDTH = width;
export const SCREEN_WIDTH = width;
export const OS_TYPE=IS_ANDROID?'android':'ios'
export const MEDIA_FORMAT={
  "android":{
   "audio":'.mp3',
   "image":'.jpg',
   "video":'.mp4'

  },
  "ios":{
    "audio":'.m4a',
    "image":'.jpg',
    "video":'.mov'
  }
}

export const MESSAGE_TYPE = {
  TEXT: 'text',
  VIDEO: 'video',
  AUDIO: 'audio',
  IMAGE: 'image',
  DOCUMENT: 'document',
  INFORMATION: 'information',
  DEFAULT:'default'
};
export const FILE_PATH={
  DEFAULT:'default',
  PICTURE_DIRECTORY:'picture_directory',
  

}
export const MESSAGE_STATUS = {
  SENT: '1',
  DELIVERY: '2',
  READ: '3',
};
export const CHANNEL_TYPE = {
  INDIVIDUAL_CHAT: '1',
  BROADCAST: '2',
  GROUP: '3',
};

export const MESSAGE_CONTENT = {
  LEFT: 'left',
  REMOVE: 'remove',
  ADD: 'add',
  CREATE_GROUP: 'Create the group',
  GROUP_NAME_CHAGE: 'change the group name',
};
export const ERROR_MESSAGE_CONTENT = {
  UN_BLOCK: 'Unblock to send a message',
  GROUP_EDIT_PERMISSION_ERROR: 'Only admins can edit this groupsinfo',
  UN_BLOCK_CHAT: 'Tab to Un block The Chat',
  UN_BLOCK_ARE_YOU: 'Are you sure un Block the chat',
};

export const CHAT_DETAILS_CONFIGURE = {
  BLOCK: 'block',
  UN_BLOCK: 'un_block',
  MUTE: 'mute',
  UN_MUTE: 'un_mute',
  CLEAR_CHAT: 'clear_chat',
  LOG_OUT: 'log_out',
  NEW_GROUP: 'New Group',
  NEW_BRAOD_CAST: 'New Broadcast',
  DELETE_BRAOD_CAST: 'delete Broadcast',
  DELETE_GROUP: 'delete Group',
  EXIT_GROUP: 'Exit Group',
  CHANGE_GROUP_NAME: 'change Group Name',
};

export const CHAT_OPTIONS = {
  BOTH: 'both',
  ALL: 'all',
};

export const USER_TYPE = {
  HOST: 'Host',
  PLAYER: 'Player',
};

export const GROUP_PERMISSIONS = {
  PARTICIPANTS: [
    {
      icon: 'edit',
      title: 'Edit group settings',
      descriptions:
        'This includes the name,icon,description,disappearing message timer,and keeping and unkeeping messages',
    },
    {icon: 'message', title: 'Send messages', descriptions: null},
    {
      icon: 'add-user',
      title: 'Add other participants',
      descriptions: null,
    },
  ],
  ADMINS: [
    {
      icon: 'user',
      title: 'Approve New participants',
      descriptions:
        'When turned on admins must approve anyone who wants to join the group',
    },
  ],
};

export const SELECTED_PERMISSION = [
  {
    type: 'edit',
    is_select: true,
  },
  {
    type: 'message',
    is_select: true,
  },
  {
    type: 'add-user',
    is_select: true,
  },
  {
    type: 'user',
    is_select: true,
  },
];

export const FROM_NAVIGATION = {
  BULK_DOCUMENT_SEND: 'BULK_DOCUMENT_SEND',
};

export const SNACKBAR_MESSAGE_LENGTH = {
  SHORT: 'SHORT',
  LONG: 'LONG',
};

export const MAXIMUM_FILE_SIZE = 30;
export const QUALITY = 1;
