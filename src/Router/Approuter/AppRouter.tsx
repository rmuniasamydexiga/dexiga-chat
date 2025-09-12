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
import ChatController from '../../Screens/Controller/Chat/ChatController';
import Signup from '../../Screens/Controller/Auth/SignUp';
import ChatList from '../../Screens/Controller/Chat/chatListController';
import PlayerListController from '../../Screens/Controller/Chat/PlayerListController';
import {MenuProvider} from 'react-native-popup-menu';
import MediaViewingController from '../../Screens/Controller/Chat/MediaViewingController';
import {Provider, useDispatch} from 'react-redux';
import {store} from '../../Redux/store';
import {AuthProvider, useAuth} from '../Context/Auth';
import SplashScreenController from '../../Screens/Controller/Splash/Splash';
import AddNewBroadCastController from '../../Screens/Controller/NewBroadCast/NewBroadCastController';
import AddNewGroupController from '../../Screens/Controller/NewGroup/NewGroupController';
import AddNewGroupProfileController from '../../Screens/Controller/NewGroup/NewGroupProfileController';
import GroupPermissionsController from '../../Screens/Controller/NewGroup/GroupPermissionsController';
import GroupInfoController from '../../Screens/Controller/NewGroup/GroupInfoController';
import BroadCastInfoController from '../../Screens/Controller/NewBroadCast/BroadCastInfoController';
import MessageInfoController from '../../Screens/Controller/Chat/MessageController';
import MediaListController from '../../Screens/Controller/Chat/MediaListController';
import IndividualChatInfoController from '../../Screens/Controller/Chat/IndividualChatInfoController';
import Page from '../../Screens/Controller/Page';


const Stack = createStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef();
import messaging from '@react-native-firebase/messaging';
import OffLineAlert from '../../Components/OffLineAlert';
import NetInfo from '@react-native-community/netinfo';
import GroupNameChangeController from '../../Screens/Controller/NewGroup/GroupNameChangeController';
import {showLog} from '../../Helper/common';

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
        <AuthProvider>
          <MenuProvider>
            {isConnected === false ? <OffLineAlert></OffLineAlert> : null}
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
                name={SCREEN_NAMES.PAGE}
                component={Page}
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
      </Provider>
    </NavigationContainer>
  );
};

export default App;
