import firestore from '@react-native-firebase/firestore';
import {currentTimestamp} from './channel';
import {showLog} from '../chat-services/common';

const notificationsRef = firestore().collection('notifications');

const fcmURL = 'https://fcm.googleapis.com/fcm/send';
const firebaseServerKey ='AAAAV6ZJ7PQ:APA91bEWFKueAoKqHfN6jX-hx03M_QYUURLReJzBxMteRviy2J5HZ0MH8tgLjpxRoe4BEmOVW51fBoSW7eAiHrm55OSKLf2-U8pKTlyRMk2Ch1XR1g4Pfpx1yR7Bv_a3BaiIqIRLUkuG';

export const sendPushNotification = async (
  toUser: {id: string; userId?: string; pushToken?: string},
  title: string,
  body: string,
  type: string,
  metadata: any,
) => {
  if (metadata && metadata.outBound && toUser.id == metadata.outBound.id) {
    return;
  }
  const notification = {
    toUserID: toUser.id || toUser.userId,
    title,
    body,
    // metadata,
    toUser,
    type,
    seen: false,
  };

  const ref = await notificationsRef.add({
    ...notification,
    createdAt: currentTimestamp(),
  });
  notificationsRef.doc(ref.id).update({id: ref.id});
  if (!toUser.pushToken) {
    return;
  }

  const pushNotification = {
    to: toUser.pushToken,

    notification: {
      title: title,
      body: body,
      sound: 'https://www.youtube.com/shorts/uEQG7wYUw4g',
    },
    data: {...metadata, type, toUserID: toUser.id},
  };
  fetch(fcmURL, {
    method: 'post',
    headers: new Headers({
      Authorization: 'key=' + firebaseServerKey,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(pushNotification),
  }).then(res => {});
};

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
    const response = await fetch(fcmURL, {
      method: 'post',
      headers: new Headers({
        Authorization: 'key=' + firebaseServerKey,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(pushNotification),
    });
  } catch (error) {
    showLog('error', error);
  }
};
