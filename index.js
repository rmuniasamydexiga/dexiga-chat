/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/Router/Approuter/AppRouter';
import RNFetchBlob from 'rn-fetch-blob';
import 'react-native-get-random-values'; // keep this for uuid


// Configure rn-fetch-blob
RNFetchBlob.config({
  fileCache: true,
  // Other configurations as needed
});
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {channelThreadUpdate} from './src/chat-firebase/channel';
import {MESSAGE_STATUS} from './src/chat-services/constant/constant';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    'Background notification recieved.',
    JSON.stringify(remoteMessage),
  );
  if (remoteMessage?.data?.outBound) {
    let outBound =
      typeof remoteMessage?.data?.outBound === 'string'
        ? JSON.parse(remoteMessage?.data?.outBound)
        : remoteMessage?.data?.outBound;
    channelThreadUpdate(
      outBound.channel,
      outBound.messageId,
      MESSAGE_STATUS.DELIVERY,
      outBound,
      remoteMessage?.data?.toUserID,
    );
  }
});

messaging()
  .getInitialNotification()
  .then(async remoteMessage => {
    console.log('Quit state message', JSON.stringify(remoteMessage));
    // if (remoteMessage?.data?.outBound) {
    //   let outBound =
    //     typeof remoteMessage?.data?.outBound === 'string'
    //       ? JSON.parse(remoteMessage?.data?.outBound)
    //       : remoteMessage?.data?.outBound;
    //   channelThreadUpdate(
    //     outBound.channel,
    //     outBound.messageId,
    //     MESSAGE_STATUS.DELIVERY,
    //     outBound,
    //     remoteMessage?.data?.toUserID,
    //   );
    // }
  });

messaging().onMessage(async remoteMessage => {
  if (remoteMessage?.data?.outBound) {
    let outBound =
      typeof remoteMessage?.data?.outBound === 'string'
        ? JSON.parse(remoteMessage?.data?.outBound)
        : remoteMessage?.data?.outBound;
    channelThreadUpdate(
      outBound.channel,
      outBound.messageId,
      MESSAGE_STATUS.DELIVERY,
      outBound,
      remoteMessage?.data?.toUserID,
    );
  }
});

AppRegistry.registerComponent(appName, () => App);
