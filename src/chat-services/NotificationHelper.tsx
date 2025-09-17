import {showLog} from './common';
import {IUser} from '../chat-firebase/Interfaces/Chat';
import {notificationManager} from '../chat-firebase';

export const indiviualPushNotifications = (
  channel: any,
  user: any,
  inputValue: any,
  downloadURL: any,
  messageData: any,
) => {
  try {
    const participants = channel.participants;
    if (!participants || participants.length == 0) {
      return;
    }
    const sender: any | undefined = user;
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
        message = sender?.name + ' ' + ': ' + inputValue;
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
          {
            outBound: {
              ...messageData,
              ...sender,
            },
          },
        );
      }
    });
  } catch (e) {
    showLog('err,', e);
  }
};

export const broadcastPushNotifications = (
  channel: any,
  user: any,
  inputValue: string,
  downloadURL: any,
  messageData: any,
  participant: {id: string},
) => {
  const sender: IUser | undefined = user;

  const fromTitle = user?.name;
  var message: string;

  if (downloadURL) {
    if (downloadURL.mime && downloadURL.mime.startsWith('video')) {
      message = user?.name + ' ' + 'sent you a video.';
    } else {
      message = user?.name + ' ' + 'sent you a photo.';
    }
  } else {
    message = inputValue;
  }

  if (participant.id != user?.id) {
    notificationManager.sendPushNotification(
      participant,
      fromTitle,
      message,
      'chat_message',
      {
        outBound: {
          ...messageData,
          sender,
        },
      },
    );
  }
};

export const groupPushNotifications = (
  channel: any,
  user: any,
  inputValue: string,
  downloadURL: any,
  participants: {id: string}[] | undefined,
  messageData: any,
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
      message = sender?.name + ' ' + ': ' + inputValue;
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
        {
          outBound: {
            ...messageData,
            sender,
          },
        },
      );
    }
  });
};
