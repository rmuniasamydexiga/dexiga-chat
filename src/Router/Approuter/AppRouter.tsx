import React, {useEffect, useState} from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
  useNavigation,
} from '@react-navigation/native';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import {SCREEN_NAMES} from '../../Constant/ScreenName';

import LoginController from '../../Screens/Controller/Auth/LoginController';
import ChatController from '../../Screens/Controller/Chat/chat-inbox';
import Signup from '../../Screens/Controller/Auth/SignUp';
import ChatList from '../../Screens/Controller/Chat/chat-list';
import PlayerListController from '../../Screens/Controller/Chat/player-list';
import {MenuProvider} from 'react-native-popup-menu';
import MediaViewingController from '../../Screens/Controller/Chat/media-viewer';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {AuthProvider, useAuth} from '../Context/Auth';
import SplashScreenController from '../../Screens/Controller/Auth/Splash';
import AddNewBroadCastController from '../../Screens/Controller/broadcast/create-broadcast';
import AddNewGroupController from '../../Screens/Controller/group/create-group';
import AddNewGroupProfileController from '../../Screens/Controller/group/NewGroupProfileController';
import GroupPermissionsController from '../../Screens/Controller/group/group-permissions';
import GroupInfoController from '../../Screens/Controller/group/GroupInfoController';
import BroadCastInfoController from '../../Screens/Controller/broadcast/broadcast-info';
import MessageInfoController from '../../Screens/Controller/Chat/message-info';
import MediaListController from '../../Screens/Controller/Chat/media-list';
import IndividualChatInfoController from '../../Screens/Controller/Chat/individual-chat-info';


const Stack = createStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef();
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';
import GroupNameChangeController from '../../Screens/Controller/group/group-name-change';
import {showLog} from '../../chat-services/common';
import { ThemeProviderWrapper } from '../ThemeProviderWrapper';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage?.data?.outBound) {
          let outBound =
            typeof remoteMessage?.data?.outBound === 'string'
              ? JSON.parse(remoteMessage?.data?.outBound)
              : remoteMessage?.data?.outBound;
          let channel: any = {
            id: outBound.channel,
            name: outBound.name,
            participants: [outBound.sender],
          };

          navigationRef.navigate('PlayerListController', {channel: channel});
        }
      })
      .catch(e => showLog('AppRouterException', e));
    messaging().onNotificationOpenedApp((remoteMessage: any) => {
      if (remoteMessage?.data?.outBound) {
        showLog(
          'Notification caused app to open from background state:',
          remoteMessage,
        );
        let outBound =
          typeof remoteMessage?.data?.outBound === 'string'
            ? JSON.parse(remoteMessage?.data?.outBound)
            : remoteMessage?.data?.outBound;
        let channel: any = {
          id: outBound.channel,
          name: outBound.name,
          participants: [outBound.sender],
        };
        navigationRef.navigate(SCREEN_NAMES.CHAT, {channel: channel});
      }
    });
  }, []);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    //fetchusers
    return () => removeNetInfoSubscription();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Provider store={store}>
                    <ThemeProviderWrapper>

        <AuthProvider>
          <MenuProvider>
            <Stack.Navigator
              initialRouteName={SCREEN_NAMES.SPLASH_SCREEN}
              screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}>
              <Stack.Screen
                name={SCREEN_NAMES.SPLASH_SCREEN}
                component={SplashScreenController}
              />
              <Stack.Screen
                name={SCREEN_NAMES.LOGIN}
                component={LoginController}
              />
              <Stack.Screen name={SCREEN_NAMES.SIGNUP} component={Signup} />
              <Stack.Screen
                name={SCREEN_NAMES.CHAT_LIST}
                component={ChatList}
              />
              <Stack.Screen
                name={SCREEN_NAMES.PLAYER_LIST}
                component={PlayerListController}
              />
              <Stack.Screen
                name={SCREEN_NAMES.MEDIA_VIEWER}
                component={MediaViewingController}
              />
          
              <Stack.Screen
                name={SCREEN_NAMES.ADD_NEW_BROAD_CAST}
                component={AddNewBroadCastController}
              />
              <Stack.Screen
                name={SCREEN_NAMES.ADD_NEW_GROUP}
                component={AddNewGroupController}
              />

              <Stack.Screen
                name={SCREEN_NAMES.ADD_NEW_GROUP_PROFILE}
                component={AddNewGroupProfileController}
              />
              <Stack.Screen
                name={SCREEN_NAMES.ADD_NEW_GROUP_PERMISSIONS}
                component={GroupPermissionsController}
              />
              <Stack.Screen
                name={SCREEN_NAMES.GROUP_INFO}
                component={GroupInfoController}
              />
              <Stack.Screen
                name={SCREEN_NAMES.BROADCAST_INFO}
                component={BroadCastInfoController}
              />
              <Stack.Screen
                name={SCREEN_NAMES.INDIVIDUAL_INFO}
                component={IndividualChatInfoController}
              />

              <Stack.Screen
                name={SCREEN_NAMES.MESSAGE_INFO}
                component={MessageInfoController}
              />
              <Stack.Screen
                name={SCREEN_NAMES.MEDIA_LIST}
                component={MediaListController}
              />
              <Stack.Screen
                name={SCREEN_NAMES.GROUP_NAME_CHANGE}
                component={GroupNameChangeController}
              />

              <Stack.Screen
                name={SCREEN_NAMES.CHAT}
                component={ChatController}
              />
            </Stack.Navigator>
          </MenuProvider>
        </AuthProvider>
        </ThemeProviderWrapper>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
