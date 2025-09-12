import { v4 as uuidv4 } from 'uuid';
import firestore, {
  FirebaseFirestoreTypes,
  firebase,
} from '@react-native-firebase/firestore';
import {
  CHANNEL_TYPE,
  CHAT_DETAILS_CONFIGURE,
  CHAT_OPTIONS,
  ERROR_MESSAGE_CONTENT,
  MESSAGE_CONTENT,
  MESSAGE_STATUS,
  MESSAGE_TYPE,
} from '../Constant/Constant';
import {IUser} from '../Interfaces/Chat';
import {notificationManager} from '.';
import {indiviualPushNotifications} from '../Screens/Controller/Chat/Helper/NotificationHelper';

import {showLog} from '../Helper/common';

const channelsRef = firestore().collection('channels');
const messageInfoRef = firestore().collection('messageInfo');

interface ref {
  ref: delee;
}
interface delee {
  delete: () => void;
}
interface DocumentSnapshot {
  doc: ref;
}
const channelPaticipationRef = firestore().collection('channel_participation');

export const subscribeChannelParticipation = async (
  userId: any,
  callback: any,
) => {
  channelPaticipationRef
    .where('user', '==', userId)
    .onSnapshot(querySnapshot => {
      const participations = querySnapshot?.docs?.map(doc => doc.data());
      callback(participations);
    });
};

export const channelMessageStatus = async (userId: any, callback: any) => {
  messageInfoRef
    .where('receiverId', '==', userId)
    .where('messageStatus', '==', '1')
    .onSnapshot(querySnapshot => {
      const messageCounts: any = {};
      querySnapshot.docs.map(doc => {
        const data = doc?.data();
        if (data) {
          const channel = data.channel;
          if (messageCounts[channel]) {
            messageCounts[channel]++;
          } else {
            messageCounts[channel] = 1;
          }
        }
      });
      callback(messageCounts);
    });
};

export const subscribeChannels = async (callback: any) => {
  channelsRef.onSnapshot((snapshot: {docs: any[]}) =>
    callback(snapshot.docs.map((doc: {data: () => any}) => doc?.data())),
  );
};

export const channelMessageStatusWithOutSnapShots = async (userId: any) => {
  try {
    const querySnapshot = await messageInfoRef
      .where('receiverId', '==', userId)
      .where('messageStatus', '==', '1')
      .get();

    const messageCounts: any = {};

    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const channel = data.channel;

      if (messageCounts[channel]) {
        messageCounts[channel]++;
      } else {
        messageCounts[channel] = 1;
      }
    });

    return messageCounts;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
};
export const subscribeChannelParticipationWithOutSnapShots = async (
  userId: any,
) => {
  try {
    const querySnapshot = await channelPaticipationRef
      .where('user', '==', userId)
      .get();

    const participations = querySnapshot?.docs?.map(doc => doc.data());
    return participations;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
};

export const subscribeChannelsWithOutSnapShots = async () => {
  try {
    const querySnapshot = await channelsRef.get();

    const channels = querySnapshot.docs.map((doc: {data: () => any}) =>
      doc.data(),
    );
    return channels;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
};

export const fetchChannelParticipantUsers = async (
  channel: {id: any},
  callback: {(participantIDs: any): void; (arg0: any[]): void},
) => {
  channelPaticipationRef
    .where('channel', '==', channel.id)
    .get()
    .then((snapshot: {docs: any[]}) => {
      callback(
        snapshot.docs.map(
          (doc: {data: () => {(): any; new (): any; user: any}}) => doc.data(),
        ),
      );
    })
    .catch((error: any) => {
      callback([]);
    });
};

export const fetchChannelParticipantIDs = async (
  channel: {id: any; is_broadCast: boolean},
  callback: {(participantIDs: any): void; (arg0: any[]): void},
) => {
  if (channel.is_broadCast) {
    channelsRef
      .doc(channel.id)
      .collection('participant')
      .get()
      .then(snapshot => {
        const data = snapshot.docs.map(doc => doc.data());
        callback(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        callback([]); // Optionally handle the error here
      });
  } else {
    channelPaticipationRef
      .where('channel', '==', channel.id)
      .get()
      .then((snapshot: {docs: any[]}) => {
        callback(
          snapshot.docs.map(
            (doc: {data: () => {(): any; new (): any; user: any}}) =>
              doc.data().user,
          ),
        );
      })
      .catch((error: any) => {
        callback([]);
      });
  }
};

export const fetchBroadCastuserDetails = async (
  channel: {id: any},
  callback: {(participantIDs: any): void; (arg0: any[]): void},
) => {
  channelsRef
    .doc(channel.id)
    .collection('participant')
    .get()
    .then(snapshot => {
      const data = snapshot.docs.map(doc => doc.data());
      callback(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      callback([]); // Optionally handle the error here
    });
};

export const subscribeThreadSnapshot = (
  channel: {id: string | undefined},
  callback: {
    (querySnapshot: any[]): void;
    complete?: (() => void) | undefined;
    error?: ((error: Error) => void) | undefined;
    next?:
      | ((
          snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
        ) => void)
      | undefined;
  },
) => {
  return channelsRef
    .doc(channel.id)
    .collection('thread')
    .orderBy('created', 'desc')
    .onSnapshot(callback);
};
export const subscribeChanelSnapshot = (
  channel: {id: string | undefined},
  callback: {
    (querySnapshot: any[]): void;
    complete?: (() => void) | undefined;
    error?: ((error: Error) => void) | undefined;
    next?:
      | ((
          snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
        ) => void)
      | undefined;
  },
) => {
  return channelsRef.doc(channel.id).onSnapshot(callback);
};

export const subscribeChanelParticipantSnapshot = (
  channel: {id: string | undefined},
  user: any,
  callback: {
    (querySnapshot: any[]): void;
    complete?: (() => void) | undefined;
    error?: ((error: Error) => void) | undefined;
    next?:
      | ((
          snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
        ) => void)
      | undefined;
  },
) => {
  return channelPaticipationRef
    .where('channel', '==', channel.id)
    .where('user', '==', user?.id)
    .onSnapshot(callback);
};

export const sendMessage = async (
  sender:
    | {
        firstName?: any;
        fullname?: any;
        userID?: any;
        profilePictureURL?: any;
        name: any;
      }
    | undefined,
  channel: {id: any; participants: any[]},
  message: string | any[],
  downloadURL: any,
  inReplyToItem: null,
  messageType: string,
  fileName: string,
  fileInfo: any,
) => {
  try {
    let participants = channel?.participants?.[0];

    if (
      sender?.userID === participants?.blockedBy ||
      participants?.blockedBy === CHAT_OPTIONS.BOTH
    ) {
      return {
        status: false,
        message: ERROR_MESSAGE_CONTENT.UN_BLOCK,
      };
    }
    const {userID, profilePictureURL} = sender;
    const timestamp = currentTimestamp();
    let data: any = {
      content: message,
      created: fileInfo?.created || timestamp,
      recipientFirstName: '',
      recipientID: '',
      recipientLastName: '',
      recipientProfilePictureURL: '',
      senderFirstName:
        sender?.firstName || sender?.fullname || sender?.name || '',
      senderID: userID,
      senderLastName: '',
      senderProfilePictureURL: profilePictureURL || '',
      url: downloadURL,
      inReplyToItem: inReplyToItem,
      messageType: messageType,
      fileName: fileName || '',
      isBlocked: participants?.isBlocked || false,
      blockedBy: participants?.blockedBy || null,
      isAudio: messageType === MESSAGE_TYPE.AUDIO,
    };
    if (messageType !== MESSAGE_TYPE.TEXT) {
      data.fileSize = fileInfo?.size || '';
    }

    if (messageType === MESSAGE_TYPE.AUDIO) {
      data.duration = fileInfo.recordTime || '';
    }
    const channelID = channel.id;
    let messageResult: any = await channelsRef
      .doc(channelID)
      .collection('thread')
      .add({...data});
    await channelsRef.doc(channelID).update({
      lastMessage: message && message.length > 0 ? message : downloadURL,
      lastMessageDate: timestamp,
      blockedBy: participants?.blockedBy || null,
    });
    let threadData = {};
    if (messageResult?._documentPath?._parts[0]) {
      threadData = {
        messageStatus: MESSAGE_STATUS.SENT,
        senderId: userID,
        receiverId: participants?.userId || null,
        channel: messageResult?._documentPath?._parts[1],
        messageId: messageResult?._documentPath?._parts[3],
        channelType: participants?.is_group
          ? CHANNEL_TYPE.GROUP
          : participants?.is_broadcast
          ? CHANNEL_TYPE.BROADCAST
          : CHANNEL_TYPE.INDIVIDUAL_CHAT,
      };
      if (
        participants?.is_group !== true &&
        participants.is_broadCast !== true
      ) {
        messageInfoRef.add(threadData);
      }
      return {success: true, data: threadData};
    }
  } catch (error) {
    console.error('error', error);
    return {success: false, error: error, data: []};
  }
};
export const sendInfoMessage = async (
  user: any,
  channel: any,
  message: any,
  selcetedUser: any | null,
) => {
  try {
    let request: any = {
      content: message,
      created: currentTimestamp(),
      senderFirstName: user.name || '',
      senderID: user?.id,
      actionId: selcetedUser?.id || user?.id,
      messageType: MESSAGE_TYPE.INFORMATION,
    };
    let messageResult: any = await channelsRef
      .doc(channel.id)
      .collection('thread')
      .add({...request});
    await channelsRef.doc(channel.id).update({
      lastMessage: request.content,
      lastMessageDate: currentTimestamp(),
    });
  } catch (error) {
    console.error('error', error);
    return {success: false, error: error, data: []};
  }
};

export const addmessageInfo = async (reqData: any) => {
  messageInfoRef.add(reqData);
};
export const sendMessageForBroadCast = async (
  sender:
    | {
        firstName?: any;
        fullname?: any;
        userID?: any;
        profilePictureURL?: any;
        name: any;
      }
    | undefined,
  channel: {id: any; participants: any[]},
  message: string | any[],
  downloadURL: any,
  inReplyToItem: null,
  messageType: string,
  fileName: string,
  broadCastMessageData: any,
  fileInfo: any,
) => {
  try {
    let participants = channel?.participants?.[0];
    if (
      sender?.userID === participants?.blockedBy ||
      participants?.blockedBy === CHAT_OPTIONS.BOTH
    ) {
      return {
        status: false,
        message: ERROR_MESSAGE_CONTENT.UN_BLOCK,
      };
    }
    const {userID, profilePictureURL} = sender;
    const timestamp = currentTimestamp();
    let data: any = {
      content: message,
      created: timestamp,
      recipientFirstName: '',
      recipientID: '',
      recipientLastName: '',
      recipientProfilePictureURL: '',
      senderFirstName:
        sender?.firstName || sender?.fullname || sender?.name || '',
      senderID: userID,
      senderLastName: '',
      senderProfilePictureURL: profilePictureURL || '',
      url: downloadURL,
      inReplyToItem: inReplyToItem,
      messageType: messageType,
      fileName: fileName || '',
      isBlocked: participants?.isBlocked || false,
      blockedBy: participants?.blockedBy || null,
      isAudio: messageType === MESSAGE_TYPE.AUDIO,
    };
    if (messageType !== MESSAGE_TYPE.TEXT) {
      data.fileSize = fileInfo?.size || '';
    }

    if (messageType === MESSAGE_TYPE.AUDIO) {
      data.duration = fileInfo.recordTime || '';
    }
    const channelID = channel.id;
    let res = await firestore().collection('channels').doc(channelID).get();
    if (res.exists) {
      await channelsRef
        .doc(channelID)
        .collection('thread')
        .doc(broadCastMessageData?.messageId)
        .set({...data});
      await channelsRef.doc(channelID).update({
        lastMessage: message && message.length > 0 ? message : downloadURL,
        lastMessageDate: timestamp,
      });
    } else {
      const channelData = {
        creator_id: userID,
        creatorID: userID,
        id: channelID,
        channelID,
        // name: name || '',
        lastMessageDate: currentTimestamp(),
        // dayjs().valueOf()

        // firestore.FieldValue.serverTimestamp()
      };
      await firestore().collection('channels').doc(channelID).set(channelData);
      await persistChannelParticipations(
        [{userId: userID}, {userID: channel?.userId}],
        channelID,
        false,
      );
      // await channelsRef.doc(channelID).collection('thread').add({ ...data });
      await channelsRef
        .doc(channelID)
        .collection('thread')
        .doc(broadCastMessageData?.messageId)
        .set({...data});
      await channelsRef.doc(channelID).update({
        lastMessage: message && message.length > 0 ? message : downloadURL,
        lastMessageDate: timestamp,
      });
    }

    return {success: true};
  } catch (error) {
    console.error('error', error);
    return {success: false, error: error};
  }
};
export const sendMessageForBulk = async (
  sender:
    | {
        firstName?: any;
        fullname?: any;
        userID?: any;
        profilePictureURL?: any;
        name: any;
      }
    | undefined,
  channel: {id: any; participants: any[]},
  message: string | any[],
  downloadURL: any,
  inReplyToItem: null,
  messageType: string,
  fileName: string,
  fileInfo: any,
) => {
  try {
    let participants = channel?.participants?.[0];
    if (
      sender?.userID === participants?.blockedBy ||
      participants?.blockedBy === CHAT_OPTIONS.BOTH
    ) {
      return {
        status: false,
        message: ERROR_MESSAGE_CONTENT.UN_BLOCK,
      };
    }
    const {userID, profilePictureURL} = sender;
    const timestamp = currentTimestamp();
    let data: any = {
      content: message,
      created: timestamp,
      recipientFirstName: '',
      recipientID: '',
      recipientLastName: '',
      recipientProfilePictureURL: '',
      senderFirstName:
        sender?.firstName || sender?.fullname || sender?.name || '',
      senderID: userID,
      senderLastName: '',
      senderProfilePictureURL: profilePictureURL || '',
      url: downloadURL,
      inReplyToItem: inReplyToItem,
      messageType: messageType,
      fileName: fileName || '',
      isBlocked: participants?.isBlocked || false,
      blockedBy: participants?.blockedBy || null,
      isAudio: messageType === MESSAGE_TYPE.AUDIO,
    };
    if (messageType !== MESSAGE_TYPE.TEXT) {
      data.fileSize = fileInfo?.size || '';
    }

    if (messageType === MESSAGE_TYPE.AUDIO) {
      data.duration = fileInfo.recordTime || '';
    }

    const channelID = channel.id;
    let res = await firestore().collection('channels').doc(channelID).get();
    if (res.exists) {
      let response = await channelsRef
        .doc(channelID)
        .collection('thread')
        .add({...data});
      indiviualPushNotifications(
        channel,
        sender,
        message,
        downloadURL,
        response,
      );

      await channelsRef.doc(channelID).update({
        lastMessage: message && message.length > 0 ? message : downloadURL,
        lastMessageDate: timestamp,
      });
    } else {
      const channelData = {
        creator_id: userID,
        creatorID: userID,
        id: channelID,
        channelID,
        // name: name || '',
        lastMessageDate: currentTimestamp(),
        // dayjs().valueOf()

        // firestore.FieldValue.serverTimestamp()
      };

      await firestore().collection('channels').doc(channelID).set(channelData);
      await persistChannelParticipations(
        [{userId: userID}, {userID: channel?.userId}],
        channelID,
        false,
      );

      // await channelsRef.doc(channelID).collection('thread').add({ ...data });
      let response = await channelsRef
        .doc(channelID)
        .collection('thread')
        .add({...data});
      indiviualPushNotifications(
        channel,
        sender,
        message,
        downloadURL,
        response,
      );

      await channelsRef.doc(channelID).update({
        lastMessage: message && message.length > 0 ? message : downloadURL,
        lastMessageDate: timestamp,
      });
    }

    return {success: true};
  } catch (error) {
    console.error('error', error);
    return {success: false, error: error};
  }
};
export const blockChat = async (channel: any, userId: string, type: string) => {
  try {
    let channelParticipants = channel?.participants?.[0];
    let blockedBy = channelParticipants?.blockedBy || null;
    let isBlocked = true;
    if (type === CHAT_DETAILS_CONFIGURE.BLOCK) {
      if (channelParticipants.blockedBy) {
        if (
          channelParticipants.blockedBy !== null &&
          channelParticipants.blockedBy !== userId
        ) {
          blockedBy = CHAT_OPTIONS.BOTH;
          isBlocked = true;
        }
        if (
          channelParticipants.blockedBy !== null &&
          channelParticipants.blockedBy !== userId
        ) {
          blockedBy = CHAT_OPTIONS.BOTH;
          isBlocked = true;
        }
      } else {
        blockedBy = userId;
        isBlocked = true;
      }
    } else if (type === CHAT_DETAILS_CONFIGURE.UN_BLOCK) {
      if (channelParticipants.blockedBy == userId) {
        blockedBy = null;
        isBlocked = false;
      } else if (channelParticipants.blockedBy == CHAT_OPTIONS.BOTH) {
        blockedBy = channelParticipants.userId;
        isBlocked = true;
      }
    }
    await channelsRef.doc(channel?.id).update({
      blockedBy: blockedBy,
      isBlocked: isBlocked,
    });
    return {
      status: true,
      data: {
        blockedBy: blockedBy,
        isBlocked: isBlocked,
      },
    };
  } catch (e) {
    return {
      status: false,
    };
  }
};
export const muteChat = async (channel: any, userId: string, type: string) => {
  let channelParticipants = channel?.participants?.[0];
  let mutedBy = channelParticipants?.mutedBy || null;
  let isMute = true;

  if (type === CHAT_DETAILS_CONFIGURE.MUTE) {
    if (channelParticipants.mutedBy) {
      if (
        channelParticipants.mutedBy !== null &&
        channelParticipants.mutedBy !== userId
      ) {
        mutedBy = CHAT_OPTIONS.BOTH;
        isMute = true;
      }
    } else {
      mutedBy = userId;
      isMute = true;
    }
    // if(channelParticipants.mutedBy!==null&&channelParticipants.mutedBy!==userId){
    //   mutedBy=CHAT_OPTIONS.BOTH
    //   isMute=true
    // }
  } else if (type === CHAT_DETAILS_CONFIGURE.UN_MUTE) {
    if (channelParticipants.mutedBy == userId) {
      mutedBy = null;
      isMute = false;
    } else if (channelParticipants.mutedBy == CHAT_OPTIONS.BOTH) {
      mutedBy = channelParticipants.userId;
      isMute = true;
    }
  }
  await channelsRef.doc(channel?.id).update({
    mutedBy: mutedBy,
    isMute: isMute,
  });
};
export const deleteBraodCast = async (
  channel: any,
  userId: string,
  type: string,
) => {
  try {
    await channelsRef.doc(channel?.id).update({
      mutedBy: userId,
      isDelete: true,
    });
    return true;
  } catch (e) {
    return false;
  }
};
export const deleteChat = async (
  channelID: string,
  message: any,
  userId: string | null,
  isGroup: boolean,
) => {
  message.forEach(
    async (ele: {isDeleted: any; id: string | undefined; deletedBy: any}) => {
      let newData = null;
      if (ele.isDeleted) {
        if (isGroup) {
          let deletedBy = ele.deletedBy.split('~');
          deletedBy.push(userId);

          newData = {
            isDeleted: true,
            deletedBy: deletedBy.join('~'),
            // ... other fields you want to update
          };
        } else {
          newData = {
            isDeleted: true,
            deletedBy: CHAT_OPTIONS.BOTH,
            // ... other fields you want to update
          };
        }
      } else {
        newData = {
          isDeleted: true,
          deletedBy: userId,
          // ... other fields you want to update
        };
      }

      channelsRef.doc(channelID).collection('thread').doc(ele.id).delete();

      // .update(newData);
    },
  );
  return {status: true};
};

export const createChannel = (
  creator: {id: any; userID: any; is_broadCast: any} | undefined,
  otherParticipants: string | any[],
  name: any,
) => {
  try {
    return new Promise(async resolve => {
      if (
        (otherParticipants &&
          otherParticipants[0] &&
          otherParticipants[0]?.is_broadCast === true) ||
        (otherParticipants &&
          otherParticipants[0] &&
          otherParticipants[0]?.is_group === true)
      ) {
        resolve({success: true, channel: otherParticipants[0]});
      } else {
        let channelID = uuidv4();
;
        const id1 = creator?.id || creator?.userID;
        if (otherParticipants && otherParticipants.length == 1) {
          const id2 =
            otherParticipants[0].id ||
            otherParticipants[0].userID ||
            otherParticipants[0].userId;
          if (id1 == id2) {
            resolve({success: false});
            return;
          }
          channelID = id1 < id2 ? id1 + id2 : id2 + id1;
        }
        const channelData = {
          creator_id: id1,
          creatorID: id1,
          id: channelID,
          channelID,
          // name: name || '',
          lastMessageDate: currentTimestamp(),
          // dayjs().valueOf()
          // firestore.FieldValue.serverTimestamp()
        };

        let res = await firestore().collection('channels').doc(channelID).get();

        if (res.exists) {
          const documentData = res.data();
          resolve({success: true, channel: channelData});
        } else {
          await firestore()
            .collection('channels')
            .doc(channelID)
            .set(channelData);
          await persistChannelParticipations(
            [...otherParticipants, creator],
            channelID,
            false,
          );
          resolve({success: true, channel: channelData});
        }
      }
    });
  } catch (e) {
    showLog('Error', e);
  }
};

export const creatNewBroadCast = async (
  dataArray: any,
  userId: string | null,
  channelName: string,
) => {
  let channelID = String( uuidv4());
  console.log('Channel name ih', channelName);
  const channelData = {
    creator_id: userId,
    creatorID: userId,
    id: channelID,
    channelID,
    is_broadCast: true,
    lastMessageDate: currentTimestamp(),
    name: channelName,
    //  dayjs().valueOf()
  };
  let broadCastList: any = [];
  let broadCastUserList: any = [];

  persistChannelParticipations([{userId: userId}], channelID, false);
  await channelsRef.doc(channelID).set(channelData);
  const createThreadPromises = dataArray.map(async (data: any) => {
    const id1: any = userId;
    let id = null;
    const id2 = data.userId;
    if (id1 == id2) {
      return;
    } else {
      id = id1 < id2 ? id1 + id2 : id2 + id1;
    }
    if (id) {
      broadCastList.push({channelID: id, userId: id2});
      broadCastUserList.push({
        channelID: id,
        userId: id2,
        name: data.name,
        // name: channelName,
      });
      await channelsRef
        .doc(channelID)
        .collection('participant')
        .add({channelID: id, broadCastUserId: id2});
    }
  });
  await Promise.all(createThreadPromises);
  return {
    status: true,
    data: {
      ...channelData,
      broadCastUserChannels: broadCastUserList,
    },
  };
};
export const updateBroadCast = async (
  dataArray: any,
  userId: string | null,
  channelID: any,
) => {
  let broadCastList: any = [];
  let broadCastUserList: any = [];
  const participantCollectionRef = channelsRef
    .doc(channelID)
    .collection('participant');
  const querySnapshot = await participantCollectionRef.get();
  querySnapshot.forEach(doc => {
    participantCollectionRef.doc(doc.id).delete();
  });

  const createThreadPromises = dataArray.map(async (data: any) => {
    const id1: any = userId;
    let id = null;
    const id2 = data.userId;
    if (id1 == id2) {
      return;
    } else {
      id = id1 < id2 ? id1 + id2 : id2 + id1;
    }
    if (id) {
      broadCastUserList.push({
        name: data?.name,
        channelID: id,
        userId: id2,
      });
      broadCastList.push({channelID: id, userId: id2});
      await channelsRef
        .doc(channelID)
        .collection('participant')
        .add({channelID: id, broadCastUserId: id2});
    }
  });
  await Promise.all(createThreadPromises);
  return {
    status: true,
    data: {
      broadCastUserChannels: broadCastUserList,
    },
  };
};
const selectOption = (selectPermission: any[], data: string) => {
  let result = false;
  if (selectPermission) {
    let findData = selectPermission.find(ele => ele.type === data);
    if (findData) {
      result = findData.is_select;
    }
  }
  return result;
};
export const creatNewGroup = async (
  dataArray: any,
  userId: string | null,
  groupName: string,
  selectPermission: any,
  user: any,
) => {
  let channelID = String( uuidv4());
  const channelData = {
    creator_id: userId,
    creatorID: userId,
    id: channelID,
    name: groupName || '',
    channelID,
    is_group: true,
    is_edit: selectOption(selectPermission, 'edit'),
    is_message: selectOption(selectPermission, 'message'),
    is_user_add: selectOption(selectPermission, 'add-user'),
    is_user_approved: selectOption(selectPermission, 'user'),
    lastMessageDate: currentTimestamp(),
    // dayjs().valueOf()
  };

  persistChannelParticipations(
    [...dataArray, {userId: userId, isAdmin: true}],
    channelID,
    true,
  );
  await channelsRef.doc(channelID).set(channelData);
  const threadDetails = {
    content: `${MESSAGE_CONTENT.CREATE_GROUP}`,
    created: currentTimestamp(),
    senderFirstName: user.name || '',
    senderID: userId,

    messageType: MESSAGE_TYPE.INFORMATION,
  };
  channelsRef
    .doc(channelID)
    .collection('thread')
    .add({
      ...threadDetails,
    });
  dataArray.forEach((ele: {userId: any; userID: any}) => {
    const threadDetails = {
      content: `${MESSAGE_CONTENT.ADD}`,
      created: currentTimestamp(),
      senderFirstName: user.name || '',
      senderID: userId,
      actionId: ele.userId || ele.userID,
      messageType: MESSAGE_TYPE.INFORMATION,
    };
    channelsRef
      .doc(channelID)
      .collection('thread')
      .add({
        ...threadDetails,
      });
  });

  return {
    status: true,
    data: {
      ...channelData,
    },
  };
};
export const persistChannelParticipations = (
  users: any[],
  channelID: string | number[],
  isGroup: boolean,
) => {
  return new Promise(async resolve => {
    const db = firestore();
    let batch = db.batch();

    // let helmanAlgorthim: any = {};
    // if (!isGroup) {
    //   helmanAlgorthim = await diffieHellManAlgorthim();
    // }

    // users.forEach(
    //   (user: {
    //     userId: any;
    //     userID: any;
    //     isAdmin: boolean | undefined | null;
    //   }) => {
    //     let ref = channelPaticipationRef.doc();
    //     if (user.isAdmin) {
    //       batch.set(ref, {
    //         channel: channelID,
    //         user: user.userId || user.userID,
    //         isAdmin: user.isAdmin,
    //       });
    //     } else {
    //       batch.set(ref, {
    //         channel: channelID,
    //         user: user.userId || user.userID,
    //       });
    //     }
    //   },
    // );
    users.forEach(
      async (
        user: {userId: any; userID: any; isAdmin: boolean | undefined | null},
        index,
      ) => {
        // if (isGroup) {
        //   helmanAlgorthim = await generateKeyPair();
        // }
        let ref = channelPaticipationRef.doc();

        if (user.isAdmin) {
          if (!isGroup) {
            batch.set(ref, {
              channel: channelID,
              user: user.userId || user.userID,
              isAdmin: user.isAdmin,
              // publicKey:
              //   index === 0
              //     ? helmanAlgorthim?.publicKeyB
              //     : helmanAlgorthim.publicKeyA,
              // privateKey:
              //   index === 0
              //     ? helmanAlgorthim.privateKeyA
              //     : helmanAlgorthim.privateKeyB,
            });
          } else {
            batch.set(ref, {
              channel: channelID,
              user: user.userId || user.userID,
              isAdmin: user.isAdmin,
              // publicKey: helmanAlgorthim.publicKey,
              // privateKey: helmanAlgorthim.privateKey,
            });
          }
        } else {
          if (!isGroup) {
            batch.set(ref, {
              channel: channelID,
              user: user.userId || user.userID,
              // publicKey:
              //   index === 0
              //     ? helmanAlgorthim?.publicKeyB
              //     : helmanAlgorthim.publicKeyA,
              // privateKey:
              //   index === 0
              //     ? helmanAlgorthim.privateKeyA
              //     : helmanAlgorthim.privateKeyB,
            });
          } else {
            batch.set(ref, {
              channel: channelID,
              user: user.userId || user.userID,
              // publicKey: helmanAlgorthim.publicKey,
              // privateKey: helmanAlgorthim.privateKey,
            });
          }
        }
      },
    );

    // users.forEach(
    //   async (
    //     user: {userId: any; userID: any; isAdmin: boolean | undefined | null},
    //     index,
    //   ) => {
    //     if (isGroup) {
    //       helmanAlgorthim = await generateKeyPair();
    //     }
    //     let ref = channelPaticipationRef.doc();
    //     if (user.isAdmin) {
    //       if (!isGroup) {
    //         batch.set(ref, {
    //           channel: channelID,
    //           user: user.userId || user.userID,
    //           isAdmin: user.isAdmin,
    //           publicKey:
    //             index === 0
    //               ? helmanAlgorthim?.publicKeyB
    //               : helmanAlgorthim.publicKeyA,
    //           privateKey:
    //             index === 0
    //               ? helmanAlgorthim.privateKeyA
    //               : helmanAlgorthim.privateKeyB,
    //         });
    //       } else {
    //         batch.set(ref, {
    //           channel: channelID,
    //           user: user.userId || user.userID,
    //           isAdmin: user.isAdmin,
    //           publicKey: helmanAlgorthim.publicKey,
    //           privateKey: helmanAlgorthim.privateKey,
    //         });
    //       }
    //     } else {
    //       if (!isGroup) {
    //         batch.set(ref, {
    //           channel: channelID,
    //           user: user.userId || user.userID,
    //           publicKey:
    //             index === 0
    //               ? helmanAlgorthim?.publicKeyB
    //               : helmanAlgorthim.publicKeyA,
    //           privateKey:
    //             index === 0
    //               ? helmanAlgorthim.privateKeyA
    //               : helmanAlgorthim.privateKeyB,
    //         });
    //       } else {
    //         batch.set(ref, {
    //           channel: channelID,
    //           user: user.userId || user.userID,
    //           publicKey: helmanAlgorthim.publicKey,
    //           privateKey: helmanAlgorthim.privateKey,
    //         });
    //       }
    //     }
    //   },
    // );
    // Commit the batch
    batch.commit().then(function () {
      resolve({success: true});
    });
  });
};

export const onLeaveGroup = (
  channelId: any,
  userId: any,
  callback: (result: {success: boolean; error?: string}) => void,
) => {
  channelPaticipationRef
    .where('channel', '==', channelId)
    .where('user', '==', userId)
    .get()
    .then((querySnapshot: DocumentSnapshot[]) => {
      querySnapshot.forEach((doc: DocumentSnapshot) => {
        doc.ref.delete();
      });
      callback({success: true});
    })
    .catch((error: any) => {
      callback({
        success: false,
        error: 'An error occurred. Please try again.',
      });
    });
};

export const onRenameGroup = (
  text: any,
  channel: {[x: string]: any},
  callback: {
    ({success, error, newChannel}: any): void;
    (arg0: {success: boolean; newChannel?: any; error?: string}): void;
  },
) => {
  channelsRef
    .doc(channel.id)
    .set(channel)
    .then(() => {
      const newChannel = channel;
      newChannel.name = text;
      callback({success: true, newChannel});
    })
    .catch((error: any) => {
      callback({success: false, error: 'An error occured, please try gain.'});
    });
};

export const makeAdmin = (
  channelId: any,
  user: any,
  callback: (result: {success: boolean; error?: string}) => void,
) => {
  channelPaticipationRef
    .where('channel', '==', channelId)
    .where('user', '==', user.id)
    .get() // You should use get() to retrieve documents
    .then((querySnapshot: {docs: DocumentSnapshot[]}) => {
      querySnapshot.docs.forEach((doc: DocumentSnapshot) => {
        doc.ref.update({isAdmin: user.isAdmin === true ? false : true}); // Use update to modify the document
      });
      callback({success: true});
    })
    .catch((error: any) => {
      callback({
        success: false,
        error: 'An error occurred. Please try again.',
      });
    });
};

export const exitTheGroup = (
  channelId: any,
  user: any,
  requestData: any,
  callback: (result: {success: boolean; error?: string}) => void,
) => {
  channelPaticipationRef
    .where('channel', '==', channelId)
    .where('user', '==', user.id)
    .get() // You should use get() to retrieve documents
    .then((querySnapshot: {docs: DocumentSnapshot[]}) => {
      querySnapshot.docs.forEach((doc: DocumentSnapshot) => {
        doc.ref.update(requestData); // Use update to modify the document
      });
      callback({success: true});
    })
    .catch((error: any) => {
      callback({
        success: false,
        error: 'An error occurred. Please try again.',
      });
    });
};
export const getUserParticipants = async (channelId: any, userId: any) => {
  let result = await channelPaticipationRef
    .where('channel', '==', channelId)
    .where('user', '==', userId)
    .get();
  return result.docs;
};
export const broadcastPushNotificationsforGroup = (
  inputValue: string,
  downloadURL: {mime: string} | null,
  participants: {id: string}[],
  channel: {name: string | any[]},
  user: IUser | undefined,
) => {
  if (!participants || participants.length == 0) {
    return;
  }
  const sender: IUser | undefined = user;
  const isGroupChat = channel.name && channel.name.length > 0;
  const fromTitle = isGroupChat ? channel.name : sender?.name;
  var message: string;
  if (isGroupChat) {
    if (downloadURL) {
      if (downloadURL.mime && downloadURL.mime.startsWith('video')) {
        message = sender?.name + ' ' + 'sent a video.';
      } else {
        message = sender?.name + +' ' + 'sent a photo.';
      }
    } else {
      message = (sender?.name || '') + ' ' + ': ' + inputValue;
    }
  } else {
    if (downloadURL) {
      if (downloadURL.mime && downloadURL.mime.startsWith('video')) {
        message = sender?.name + ' ' + 'sent you a video.';
      } else {
        message = sender?.name + ' ' + 'sent you a photo.';
      }
    } else {
      message = inputValue;
    }
  }
  participants.forEach((participant: {id: string}) => {
    if (participant.id != user?.id) {
      notificationManager.sendPushNotification(
        participant,
        fromTitle,
        message,
        'chat_message',
        {outBound: sender},
      );
    }
  });
};
export const channelPermissionUpdate = async (
  channelID: string | undefined,
  selectPermission: any[],
) => {
  try {
    let data = {
      is_edit: selectOption(selectPermission, 'edit'),
      is_message: selectOption(selectPermission, 'message'),
      is_user_add: selectOption(selectPermission, 'add-user'),
      is_user_approved: selectOption(selectPermission, 'user'),
    };

    await channelsRef.doc(channelID).update(data);

    return {success: true, data: data};
  } catch (e) {
    showLog('errorr==>', e);
  }
};

export const updateChannel = async (
  channelID: string | undefined,
  requestData: any,
) => {
  try {
    await channelsRef.doc(channelID).update(requestData);

    return {success: true, data: requestData};
  } catch (e) {
    showLog('errorr==>', e);
  }
};
export const updateMessageStatusThread = (
  channel: {
    participants: any;
    id: string | undefined;
  },
  status: string,
  userId: string,
) => {
  if (channel.participants?.[0]?.is_group) {
  }

  return messageInfoRef
    .where('messageStatus', 'in', ['1', '2'])
    .where('receiverId', '==', userId)
    .where('channel', '==', channel?.id)
    .onSnapshot(querySnapshot => {
      querySnapshot?.docChanges()?.forEach(change => {
        const doc = change.doc;
        const dataToUpdate = {
          messageStatus: status,
          seenDate: currentTimestamp(),
        };
        messageInfoRef
          .doc(doc.id)
          .update(dataToUpdate)
          .then(() => {})
          .catch(error => {
            showLog('Error updating document:' + doc.id, error);
          });
      });
    });
};

export const channelThreadUpdate = async (
  channelID: string,
  messageId: string,
  status: string,
  outBound: any,
  toUserID: string,
) => {
  try {
    let data: any = {};
    if (status === MESSAGE_STATUS.DELIVERY) {
      data = {
        deliveryDate: currentTimestamp(),
        messageStatus: status,
      };
    }
    if (outBound?.channelType === CHANNEL_TYPE.GROUP) {
      await messageInfoRef
        .where('channel', '==', channelID)
        .where('messageId', '==', messageId)
        .where('receiverId', '==', toUserID)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            messageInfoRef.doc(doc.id).update(data);
          });
        })
        .then(() => {
          showLog('Success', 'Documents updated successfully');
        })
        .catch(error => {
          console.error('Error updating documents:', error);
        });
    } else {
      await messageInfoRef
        .where('channel', '==', channelID)
        .where('messageId', '==', messageId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            messageInfoRef.doc(doc.id).update(data);
          });
        })
        .then(() => {
          showLog('Success', 'Documents updated successfully');
        })
        .catch(error => {
          console.error('Error updating documents:', error);
        });
    }
    return {success: true, data: data};
  } catch (e) {
    showLog('errorr==>', e);
  }
};

export const getMessageInformation = async (
  channelID: any,
  message: {id: any},
  is_broadCast: boolean,
) => {
  let msgList: any = [];
  let result: any = await messageInfoRef
    .where(is_broadCast ? 'masterChannel' : 'channel', '==', channelID)
    .where('messageId', '==', message.id)
    .get();
  if (result?._docs) {
    result?._docs.forEach((ele: {data: () => any}) => {
      if (ele?.data()) {
        msgList.push(ele?.data());
      }
    });
  }
  return msgList;
};

export const getMessageInformationList = async (channelID: any) => {
  let msgList: any = [];
  let result: any = await messageInfoRef
    .where('channel', '==', channelID)
    .get();
  if (result?._docs) {
    result?._docs.forEach((ele: {data: () => any}) => {
      if (ele?.data()) {
        msgList.push(ele?.data());
      }
    });
  }
  return msgList;
};

export const currentTimestamp = () => {
  return firebase.firestore.Timestamp.now().toDate();
};
