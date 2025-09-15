import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

import {showLog} from '../chat-services/common';

const db = getFirestore(); // initialize Firestore

const notificationsRef = collection(db, 'notifications');

const fcmURL = 'https://fcm.googleapis.com/fcm/send';
const firebaseServerKey =
  'AAAAV6ZJ7PQ:APA91bEWFKueAoKqHfN6jX-hx03M_QYUURLReJzBxMteRviy2J5HZ0MH8tgLjpxRoe4BEmOVW51fBoSW7eAiHrm55OSKLf2-U8pKTlyRMk2Ch1XR1g4Pfpx1yR7Bv_a3BaiIqIRLUkuG';

// ✅ Send push notification
export const sendPushNotification = async (
  toUser: {id: string; userId?: string; pushToken?: string},
  title: string,
  body: string,
  type: string,
  metadata: any,
) => {
  if (metadata && metadata.outBound && toUser.id === metadata.outBound.id) {
    return;
  }

  const notification = {
    toUserID: toUser.id || toUser.userId,
    title,
    body,
    toUser,
    type,
    seen: false,
    createdAt: serverTimestamp(),
  };

  // Add notification
  const ref = await addDoc(notificationsRef, notification);

  // Update doc with its ID
  await updateDoc(doc(db, 'notifications', ref.id), {id: ref.id});

  // Skip push if user has no token
  if (!toUser.pushToken) {
    return;
  }

  const pushNotification = {
    to: toUser.pushToken,
    notification: {
      title,
      body,
      sound: 'https://www.youtube.com/shorts/uEQG7wYUw4g',
    },
    data: {...metadata, type, toUserID: toUser.id},
  };

  await fetch(fcmURL, {
    method: 'post',
    headers: {
      Authorization: 'key=' + firebaseServerKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pushNotification),
  });
};

// ✅ Send call notification
export const sendCallNotification = async (
  sender: {id: string; firstName: string},
  recipient: {pushToken: string; id: string},
  channelID: string,
  callType: string,
  callID: string,
) => {
  if (!recipient.pushToken) {
    return;
  }

  const pushNotification = {
    to: recipient.pushToken,
    priority: 'high',
    data: {
      channelID,
      recipientID: recipient.id,
      senderID: sender.id,
      callType,
      callID,
      callerName: sender.firstName,
      priority: 'high',
      contentAvailable: true,
    },
  };

  try {
    await fetch(fcmURL, {
      method: 'post',
      headers: {
        Authorization: 'key=' + firebaseServerKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pushNotification),
    });
  } catch (error) {
    showLog('error', error);
  }
};
