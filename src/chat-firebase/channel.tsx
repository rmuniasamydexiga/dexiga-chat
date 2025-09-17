import { v4 as uuidv4 } from 'uuid';
import { getApp } from '@react-native-firebase/app';
import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  orderBy,
  writeBatch,
  Timestamp,
  getDoc,
} from '@react-native-firebase/firestore';
import {
  CHANNEL_TYPE,
  CHAT_DETAILS_CONFIGURE,
  CHAT_OPTIONS,
  ERROR_MESSAGE_CONTENT,
  MESSAGE_CONTENT,
  MESSAGE_STATUS,
  MESSAGE_TYPE,
} from '../chat-services/constant/constant';
import { showLog } from '../chat-services/common';
import { COLLECTION_NAME } from './collection-name';
import { notificationManager } from '.';

const app = getApp();
const db = getFirestore(app);


const channelsRef = collection(db, COLLECTION_NAME.CHANNELS);
const messageInfoRef = collection(db, COLLECTION_NAME.MESSAGE_INFO);
const channelPaticipationRef = collection(db, COLLECTION_NAME.CHANNEL_PARTICIPATIONS);

// export const subscribeChannelParticipation = async (userId: any, callback: any) => {
//   if(!userId) return  undefined
//   //{status:false};
//   const q = query(channelPaticipationRef, where('user', '==', userId));
//   return onSnapshot(q, (querySnapshot) => {
//     const participations = querySnapshot?.docs?.map((doc) => doc.data());
//     callback(participations);
//   });
// };

// export const channelMessageStatus = async (userId: any, callback: any) => {
//     if(!userId) return  undefined
//     //{status:false};

//   const q = query(
//     messageInfoRef,
//     where('receiverId', '==', userId),
//     where('messageStatus', '==', '1')
//   );
//   return onSnapshot(q, (querySnapshot) => {
//     const messageCounts: any = {};
//     querySnapshot.docs.forEach((doc) => {
//       const data = doc?.data();
//       if (data) {
//         const channel = data.channel;
//         if (messageCounts[channel]) {
//           messageCounts[channel]++;
//         } else {
//           messageCounts[channel] = 1;
//         }
//       }
//     });
//     callback(messageCounts);
//   });
// };

// export const subscribeChannels = async (callback: any) => {
//   return onSnapshot(channelsRef, (snapshot) =>
//     callback(snapshot.docs.map((doc) => doc?.data()))
//   );
// };

export const subscribeChannels = (callback: (channels: any[]) => void) => {
  const unsubscribe = onSnapshot(channelsRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });

  return unsubscribe;
};

/**
 * Subscribe to channel participation for a specific user
 */
export const subscribeChannelParticipation = (
  userId: string,
  callback: (participations: any[]) => void
) => {
  if (!userId) return () => {};

  const q = query(channelPaticipationRef, where("user", "==", userId));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });

  return unsubscribe;
};

/**
 * Subscribe to unread message count per channel for a specific user
 */
export const channelMessageStatus = (
  userId: string,
  callback: (messageCounts: Record<string, number>) => void
) => {
  if (!userId) return () => {};

  const q = query(
    messageInfoRef,
    where("receiverId", "==", userId),
    where("messageStatus", "==", "1")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messageCounts: Record<string, number> = {};

    snapshot.docs.forEach((doc) => {
      const data: any = doc.data();
      const channelId = data.channel;

      if (channelId) {
        messageCounts[channelId] = (messageCounts[channelId] || 0) + 1;
      }
    });

    callback(messageCounts);
  });

  return unsubscribe;
};

export const deleteBraodCast = async (
  channel: any,
  userId: string,
  type: string
) => {
  try {
    const channelRef = doc(db, "channels", channel?.id); // collection name: channels
    await updateDoc(channelRef, {
      mutedBy: userId,
      isDelete: true,
    });
    return true;
  } catch (e) {
    console.error("Error deleting broadcast:", e);
    return false;
  }
};

export const channelMessageStatusWithOutSnapShots = async (userId: any) => {
  try {
      if(!userId) return undefined;
      // {status:false};

    const q = query(
      messageInfoRef,
      where('receiverId', '==', userId),
      where('messageStatus', '==', '1')
    );
    const querySnapshot = await getDocs(q);
    const messageCounts: any = {};
    querySnapshot.docs.forEach((doc) => {
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

export const subscribeChannelParticipationWithOutSnapShots = async (userId: any) => {
  try {
      if(!userId) return undefined;
      // {status:false};

    const q = query(channelPaticipationRef, where('user', '==', userId));
    const querySnapshot = await getDocs(q);
    const participations = querySnapshot?.docs?.map((doc) => doc.data());
    return participations;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
};

export const subscribeChannelsWithOutSnapShots = async () => {
  try {
    const querySnapshot = await getDocs(channelsRef);
    const channels = querySnapshot.docs.map((doc) => doc.data());
    return channels;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
};

export const fetchChannelParticipantUsers = async (
  channel: { id: any },
  callback: (participantIDs: any[]) => void
) => {
    if(!channel.id) return undefined
    //{status:false};

  const q = query(channelPaticipationRef, where('channel', '==', channel.id));
  const snapshot = await getDocs(q);
  callback(snapshot.docs.map((doc) => doc.data()));
};

export const fetchChannelParticipantIDs = async (
  channel: { id: any; is_broadCast: boolean },
  callback: (participantIDs: any[]) => void
) => {
          if(!channel.id) return undefined;
          //{status:false};

  else if (channel.is_broadCast) {
    const participantsRef = collection(db, COLLECTION_NAME.CHANNELS, channel.id, 'participant');
    const snapshot = await getDocs(participantsRef);
    const data = snapshot.docs.map((doc) => doc.data());
    callback(data);
  } else {

    const q = query(channelPaticipationRef, where('channel', '==', channel.id));
    const snapshot = await getDocs(q);
    callback(snapshot.docs.map((doc) => doc.data().user));
  }
};

export const createChannel = async (
  creator: { id?: string; userID?: string; is_broadCast?: boolean },
  otherParticipants: Array<any>,
  name?: string
): Promise<{ success: boolean; channel?: any }> => {
  try {
    // ✅ case: broadcast / group
    if (otherParticipants?.[0]?.is_broadCast || otherParticipants?.[0]?.is_group) {
      return { success: true, channel: otherParticipants[0] };
    }

    // ✅ determine channel ID
    let channelID: string = uuidv4().toString();
    const id1 = creator?.id || creator?.userID;

    if (otherParticipants && otherParticipants.length === 1) {
      const id2 =
        otherParticipants[0].id ||
        otherParticipants[0].userID ||
        otherParticipants[0].userId;

      // prevent self-channel
      if (id1 === id2) {
        return { success: false };
      }

      channelID = id1 < id2 ? id1 + id2 : id2 + id1;
    }

    const channelData = {
      creator_id: id1,
      creatorID: id1,
      id: channelID,
      channelID,
      name: name || '',
      lastMessageDate: currentTimestamp(), // or Date.now() / serverTimestamp()
    };
    console.log('channelData', channelData);

    const channelRef = doc(collection(db, COLLECTION_NAME.CHANNELS), channelID);
    const res = await getDoc(channelRef);

    if (res.exists) {
      return { success: true, channel: res.data() };
    }

    // ✅ create new channel
    await setDoc(channelRef, channelData);
    await persistChannelParticipations([...otherParticipants, creator], channelID, false);

    return { success: true, channel: channelData };
  } catch (e) {
    console.error('createChannel error:', e);
    return { success: false };
  }
};

export const persistChannelParticipations = async (
  users: Array<{ userId?: string; userID?: string; isAdmin?: boolean | null }>,
  channelID: string,
  isGroup: boolean
): Promise<{ success: boolean }> => {
  try {
    const batch = writeBatch(db);
    const channelParticipationRef = collection(db, 'channelParticipations');

    users.forEach((user) => {
      const userId = user.userId || user.userID;
      const ref = doc(channelParticipationRef); // auto-generated id

      const data: any = {
        channel: channelID,
        user: userId,
      };

      if (user.isAdmin) {
        data.isAdmin = user.isAdmin;
      }

      // 🔑 If you later need helmanAlgorthim/publicKey logic, you can add here
      // if (!isGroup) { ... } else { ... }

      batch.set(ref, data);
    });

    await batch.commit();
    return { success: true };
  } catch (e) {
    console.error('persistChannelParticipations Error:', e);
    return { success: false };
  }
};

export const fetchBroadCastuserDetails = async (
  channel: { id: any },
  callback: (participantIDs: any[]) => void
) => {
  const participantsRef = collection(db,COLLECTION_NAME.CHANNELS , channel.id, 'participant');
  const snapshot = await getDocs(participantsRef);
  const data = snapshot.docs.map((doc) => doc.data());
  callback(data);
};

export const subscribeThreadSnapshot = (
  channel: { id: string | undefined },
  callback: any
) => {
  if (!channel.id) return;
  const threadRef = collection(db, COLLECTION_NAME.CHANNELS, channel.id, 'thread');
  const q = query(threadRef, orderBy('created', 'desc'));
  return onSnapshot(q, callback);
};

export const subscribeChanelSnapshot = (
  channel: { id: string | undefined },
  callback: any
) => {
  if (!channel.id) return;
  const channelDoc = doc(db, COLLECTION_NAME.CHANNELS, channel.id);
  return onSnapshot(channelDoc, callback);
};

export const subscribeChanelParticipantSnapshot = (
  channel: { id: string | undefined },
  user: any,
  callback: any
) => {
  if (!channel.id || !user?.id) return;
  const q = query(
    channelPaticipationRef,
    where('channel', '==', channel.id),
    where('user', '==', user.id)
  );
  return onSnapshot(q, callback);
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
  channel: { id: any; participants: any[] },
  message: string | any[],
  downloadURL: any,
  inReplyToItem: null,
  messageType: string,
  fileName: string,
  fileInfo: any
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
    const { userID, profilePictureURL } = sender;
    const timestamp = currentTimestamp();
    let data: any = {
      content: message,
      created: fileInfo?.created || timestamp,
      recipientFirstName: '',
      recipientID: '',
      recipientLastName: '',
      recipientProfilePictureURL: '',
      senderFirstName: sender?.firstName || sender?.fullname || sender?.name || '',
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
    const threadRef = collection(db,COLLECTION_NAME.CHANNELS , channelID, 'thread');
    let messageResult = await addDoc(threadRef, { ...data });
    const channelDoc = doc(db, COLLECTION_NAME.CHANNELS, channelID);
    await updateDoc(channelDoc, {
      lastMessage: message && message.length > 0 ? message : downloadURL,
      lastMessageDate: timestamp,
      blockedBy: participants?.blockedBy || null,
    });
    let threadData = {};
    if (messageResult?.id) {
      threadData = {
        messageStatus: MESSAGE_STATUS.SENT,
        senderId: userID,
        receiverId: participants?.userId || null,
        channel: channelID,
        messageId: messageResult.id,
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
        await addDoc(messageInfoRef, threadData);
      }
      console.log('threadData', threadData);

      return { success: true, data: threadData };
    }
  } catch (error) {
    console.error('error', error);
    return { success: false, error: error, data: [] };
  }
};

// block chat
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
      } else {
        blockedBy = userId;
        isBlocked = true;
      }
    } else if (type === CHAT_DETAILS_CONFIGURE.UN_BLOCK) {
      if (channelParticipants.blockedBy === userId) {
        blockedBy = null;
        isBlocked = false;
      } else if (channelParticipants.blockedBy === CHAT_OPTIONS.BOTH) {
        blockedBy = channelParticipants.userId;
        isBlocked = true;
      }
    }

    const channelRef = doc(db,COLLECTION_NAME.CHANNELS , channel?.id);
    await updateDoc(channelRef, {
      blockedBy,
      isBlocked,
    });

    return { status: true, data: { blockedBy, isBlocked } };
  } catch (e) {
    return { status: false };
  }
};

// mute chat
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
  } else if (type === CHAT_DETAILS_CONFIGURE.UN_MUTE) {
    if (channelParticipants.mutedBy === userId) {
      mutedBy = null;
      isMute = false;
    } else if (channelParticipants.mutedBy === CHAT_OPTIONS.BOTH) {
      mutedBy = channelParticipants.userId;
      isMute = true;
    }
  }

  const channelRef = doc(db, COLLECTION_NAME.CHANNELS, channel?.id);
  await updateDoc(channelRef, {
    mutedBy,
    isMute,
  });
};



// delete chat
export const deleteChat = async (
  channelID: string,
  messages: any[],
  userId: string | null,
  isGroup: boolean,
) => {
  const threadRef = collection(db, COLLECTION_NAME.CHANNELS, channelID, 'thread');

  for (const ele of messages) {
    let newData: any = null;

    if (ele.isDeleted) {
      if (isGroup) {
        let deletedBy = ele.deletedBy.split('~');
        deletedBy.push(userId);
        newData = {
          isDeleted: true,
          deletedBy: deletedBy.join('~'),
        };
      } else {
        newData = {
          isDeleted: true,
          deletedBy: CHAT_OPTIONS.BOTH,
        };
      }
    } else {
      newData = {
        isDeleted: true,
        deletedBy: userId,
      };
    }

    const msgRef = doc(threadRef, ele.id);
    await deleteDoc(msgRef); // currently deleting instead of updating
    // If you want to update instead of delete, replace with:
    // await updateDoc(msgRef, newData);
  }

  return { status: true };
};

export const deleteBroadcast = async (
  channel: any,
  userId: string,
  type: string,
) => {
  try {
    const channelRef = doc(db, "channels", channel?.id);

    await updateDoc(channelRef, {
      mutedBy: userId,
      isDelete: true,
    });

    return true;
  } catch (e) {
    return false;
  }
};

export const exitTheGroup = async (
  channelId: string,
  user: any,
  requestData: any,
  callback: (result: { success: boolean; error?: string }) => void
) => {
  try {
    if (!user.id) return undefined
    // { status: false };

    const q = query(
      channelPaticipationRef,
      where("channel", "==", channelId),
      where("user", "==", user.id)
    );

    const snapshot = await getDocs(q);

    const updates = snapshot.docs.map((docSnap) =>
      updateDoc(docSnap.ref, requestData)
    );

    await Promise.all(updates);

    callback({ success: true });
  } catch (error) {
    callback({
      success: false,
      error: "An error occurred. Please try again.",
    });
  }
};

export const makeAdmin = async (
  channelId: string,
  user: any,
  callback: (result: { success: boolean; error?: string }) => void
) => {
  try {
    const q = query(
      channelPaticipationRef,
      where("channel", "==", channelId),
      where("user", "==", user.id)
    );

    const snapshot = await getDocs(q);

    const updates = snapshot.docs.map((docSnap) =>
      updateDoc(docSnap.ref, { isAdmin: user.isAdmin === true ? false : true })
    );

    await Promise.all(updates);

    callback({ success: true });
  } catch (error) {
    callback({
      success: false,
      error: "An error occurred. Please try again.",
    });
  }
};

export const onLeaveGroup = async (
  channelId: string,
  userId: string,
  callback: (result: { success: boolean; error?: string }) => void
) => {
  try {
    const q = query(
      channelPaticipationRef,
      where("channel", "==", channelId),
      where("user", "==", userId)
    );

    const snapshot = await getDocs(q);

    const deletions = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletions);

    callback({ success: true });
  } catch (error) {
    callback({
      success: false,
      error: "An error occurred. Please try again.",
    });
  }
};

export const updateMessageStatusThread = (
  channel: { participants: any; id?: string },
  status: string,
  userId: string
) => {
  if (!channel?.id) return undefined
  // {status:false};
  if(!userId) return undefined
  // {status:false};

  const q = query(
    messageInfoRef,
    where("messageStatus", "in", ["1", "2"]),
    where("receiverId", "==", userId),
    where("channel", "==", channel.id)
  );

  return onSnapshot(q, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      const docSnap = change.doc;
      const dataToUpdate = {
        messageStatus: status,
        seenDate: currentTimestamp(),
      };

      updateDoc(doc(db, "messageInfo", docSnap.id), dataToUpdate).catch(
        (error) => {
          showLog("Error updating document: " + docSnap.id, error);
        }
      );
    });
  });
};

export const addMessageInfo = async (reqData: any) => {
  try {
    const messageInfoRef = collection(db, 'messageInfo'); // 👈 your collection name
    await addDoc(messageInfoRef, reqData);
    return { success: true };
  } catch (error) {
    console.error('addMessageInfo error:', error);
    return { success: false, error };
  }
};

// ... (The rest of your methods should be similarly updated to use the modular API.)
// For brevity, only the above methods are shown fully converted. 
// The rest of your code should follow the same pattern: 
// - Use `collection(db, ...)`, `doc(db, ...)`, `getDocs`, `addDoc`, `updateDoc`, `setDoc`, `deleteDoc`, `onSnapshot`, etc.

export const sendMessageForBroadCast = async (
  sender:
    | {
        firstName?: string;
        fullname?: string;
        userID?: string;
        profilePictureURL?: string;
        name?: string;
      }
    | undefined,
  channel: { id: string; participants: any[]; userId?: string },
  message: string | any[],
  downloadURL: any,
  inReplyToItem: null,
  messageType: string,
  fileName: string,
  broadCastMessageData: any,
  fileInfo: any
): Promise<{ success: boolean; error?: any }> => {
  try {
    const participants = channel?.participants?.[0];

    // ✅ Blocked user check
    if (
      sender?.userID === participants?.blockedBy ||
      participants?.blockedBy === CHAT_OPTIONS.BOTH
    ) {
      return {
        success: false,
        error: ERROR_MESSAGE_CONTENT.UN_BLOCK,
      };
    }

    const { userID, profilePictureURL } = sender || {};
    const timestamp = currentTimestamp();

    const data: any = {
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
      messageType,
      fileName: fileName || '',
      isBlocked: participants?.isBlocked || false,
      blockedBy: participants?.blockedBy || null,
      isAudio: messageType === MESSAGE_TYPE.AUDIO,
    };

    if (messageType !== MESSAGE_TYPE.TEXT) {
      data.fileSize = fileInfo?.size || '';
    }

    if (messageType === MESSAGE_TYPE.AUDIO) {
      data.duration = fileInfo?.recordTime || '';
    }

    const channelID = String(channel.id);
    const channelRef = doc(db, COLLECTION_NAME.CHANNELS, channelID);
    const threadRef = doc(collection(channelRef, 'thread'), broadCastMessageData?.messageId);

    const res = await getDoc(channelRef);

    if (res.exists) {
      // ✅ channel exists → update thread + channel info
      await setDoc(threadRef, { ...data });
      await updateDoc(channelRef, {
        lastMessage: message && message.length > 0 ? message : downloadURL,
        lastMessageDate: timestamp,
      });
    } else {
      // ✅ channel does not exist → create new channel
      const channelData = {
        creator_id: userID,
        creatorID: userID,
        id: channelID,
        channelID,
        lastMessageDate: timestamp,
      };

      await setDoc(channelRef, channelData);
      await persistChannelParticipations(
        [{ userId: userID }, { userID: channel?.userId }],
        channelID,
        false
      );

      await setDoc(threadRef, { ...data });
      await updateDoc(channelRef, {
        lastMessage: message && message.length > 0 ? message : downloadURL,
        lastMessageDate: timestamp,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('sendMessageForBroadCast error:', error);
    return { success: false, error };
  }
};

export const getUserParticipants = async (channelId: any, userId: any) => {
  try {
    const q = query(
      collection(db, 'channelParticipation'), // 👈 replace with your actual collection name
      where('channel', '==', channelId),
      where('user', '==', userId)
    );

    const result = await getDocs(q);
    return result.docs; // still gives you an array of QueryDocumentSnapshot
  } catch (error) {
    console.error('getUserParticipants error:', error);
    return [];
  }
};

export const createNewBroadCast = async (
  dataArray: any,
  userId: string | null,
  channelName: string,
) => {
  const channelID = uuidv4();
  console.log('Channel name ih', channelName);
  const channelData = {
    creator_id: userId,
    creatorID: userId,
    id: channelID,
    channelID,
    is_broadCast: true,
    lastMessageDate: currentTimestamp(),
    name: channelName,
  };
  let broadCastList: any = [];
  let broadCastUserList: any = [];

  await persistChannelParticipations([{ userId: userId }], channelID, false);

  const channelDocRef = doc(db, COLLECTION_NAME.CHANNELS, channelID);
  await setDoc(channelDocRef, channelData);

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
      broadCastList.push({ channelID: id, userId: id2 });
      broadCastUserList.push({
        channelID: id,
        userId: id2,
        name: data.name,
      });
      const participantRef = collection(db, COLLECTION_NAME.CHANNELS, channelID, 'participant');
      await addDoc(participantRef, { channelID: id, broadCastUserId: id2 });
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
  const participantCollectionRef = collection(db, COLLECTION_NAME.CHANNELS, channelID, 'participant');
  const querySnapshot = await getDocs(participantCollectionRef);
  const deletePromises = querySnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
  await Promise.all(deletePromises);

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
      broadCastList.push({ channelID: id, userId: id2 });
      const participantRef = collection(db, COLLECTION_NAME.CHANNELS, channelID, 'participant');
      await addDoc(participantRef, { channelID: id, broadCastUserId: id2 });
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

export const updateChannel = async (
  channelID: string | undefined,
  requestData: any
) => {
  try {
    if (!channelID) throw new Error("Channel ID is undefined");

    const channelRef = doc(db, "channels", channelID);
    await updateDoc(channelRef, requestData);

    return { success: true, data: requestData };
  } catch (e) {
    showLog("errorr==>", e);
    return { success: false, error: e };
  }
};


export const sendInfoMessage = async (
  user: any,
  channel: any,
  message: any,
  selcetedUser: any | null
) => {
  try {
    let request: any = {
      content: message,
      created: currentTimestamp(),
      senderFirstName: user.name || "",
      senderID: user?.id,
      actionId: selcetedUser?.id || user?.id,
      messageType: MESSAGE_TYPE.INFORMATION,
    };

    // reference to /channels/{channel.id}/thread
    const threadRef = collection(db, "channels", channel.id, "thread");

    // add message to thread subcollection
    const messageResult = await addDoc(threadRef, { ...request });

    // update parent channel document
    const channelRef = doc(db, "channels", channel.id);
    await updateDoc(channelRef, {
      lastMessage: request.content,
      lastMessageDate: currentTimestamp(),
    });

    return { success: true, messageId: messageResult.id, data: request };
  } catch (error) {
    console.error("error", error);
    return { success: false, error: error, data: [] };
  }
};

const selectOption = (selectPermission: any[], data: string) => {
  let result = false;
  if (selectPermission) {
    const findData = selectPermission.find((ele) => ele.type === data);
    if (findData) {
      result = findData.is_select;
    }
  }
  return result;
};

export const channelPermissionUpdate = async (
  channelID: string | undefined,
  selectPermission: any[]
) => {
  try {
    if (!channelID) throw new Error("Channel ID is undefined");

    const data = {
      is_edit: selectOption(selectPermission, "edit"),
      is_message: selectOption(selectPermission, "message"),
      is_user_add: selectOption(selectPermission, "add-user"),
      is_user_approved: selectOption(selectPermission, "user"),
    };

    const channelRef = doc(db, "channels", channelID);
    await updateDoc(channelRef, data);

    return { success: true, data };
  } catch (e) {
    showLog("errorr==>", e);
    return { success: false, error: e };
  }
};

export const creatNewGroup = async (
  dataArray: any,
  userId: string | null,
  groupName: string,
  selectPermission: any,
  user: any
) => {
  try {
    let channelID = String(uuidv4());

    const channelData = {
      creator_id: userId,
      creatorID: userId,
      id: channelID,
      name: groupName || "",
      channelID,
      is_group: true,
      is_edit: selectOption(selectPermission, "edit"),
      is_message: selectOption(selectPermission, "message"),
      is_user_add: selectOption(selectPermission, "add-user"),
      is_user_approved: selectOption(selectPermission, "user"),
      lastMessageDate: currentTimestamp(),
    };

    // save channel data
    const channelRef = doc(db, "channels", channelID);
    await setDoc(channelRef, channelData);

    // persist participants
    persistChannelParticipations(
      [...dataArray, { userId: userId, isAdmin: true }],
      channelID,
      true
    );

    // add system thread message for group creation
    const threadRef = collection(db, "channels", channelID, "thread");
    const createThreadDetails = {
      content: `${MESSAGE_CONTENT.CREATE_GROUP}`,
      created: currentTimestamp(),
      senderFirstName: user.name || "",
      senderID: userId,
      messageType: MESSAGE_TYPE.INFORMATION,
    };
    await addDoc(threadRef, createThreadDetails);

    // add system thread messages for each added user
    for (const ele of dataArray) {
      const addThreadDetails = {
        content: `${MESSAGE_CONTENT.ADD}`,
        created: currentTimestamp(),
        senderFirstName: user.name || "",
        senderID: userId,
        actionId: ele.userId || ele.userID,
        messageType: MESSAGE_TYPE.INFORMATION,
      };
      await addDoc(threadRef, addThreadDetails);
    }

    return {
      status: true,
      data: {
        ...channelData,
      },
    };
  } catch (error) {
    console.error("Error creating new group:", error);
    return { status: false, error };
  }
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

export const currentTimestamp = () => {
  return Timestamp.now().toDate();
};


