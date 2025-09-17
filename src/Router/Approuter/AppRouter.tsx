import React, {useEffect, useState} from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
  useNavigation,
} from '@react-navigation/native';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import {Paths} from '../../chat-services/constant/ScreenName';

import LoginController from '../../Screens/Controller/Auth/LoginController';
import ChatController from '../../chat-modules/chat/chat-inbox';
import Signup from '../../Screens/Controller/Auth/SignUp';
import ChatList from '../../chat-modules/chat/chat-list';
import PlayerListController from '../../chat-modules/chat/player-list';
import {MenuProvider} from 'react-native-popup-menu';
import MediaViewingController from '../../chat-modules/chat/media-viewer';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {AuthProvider, useAuth} from '../../chat-context/chat-auth';
import SplashScreenController from '../../Screens/Controller/Auth/Splash';
import AddNewBroadCastController from '../../chat-modules/broadcast/create-broadcast';
import AddNewGroupController from '../../chat-modules/group/create-group';
import AddNewGroupProfileController from '../../chat-modules/group/group-profile';
import GroupPermissionsController from '../../chat-modules/group/group-permissions';
import GroupInfoController from '../../chat-modules/group/group-info';
import BroadCastInfoController from '../../chat-modules/broadcast/broadcast-info';
import MessageInfoController from '../../chat-modules/chat/message-info';
import MediaListController from '../../chat-modules/chat/media-list';
import IndividualChatInfoController from '../../chat-modules/chat/individual-chat-info';


const Stack = createStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef();
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';
import GroupNameChangeController from '../../chat-modules/group/group-name-change';
import {showLog} from '../../chat-services/common';
import { ThemeProviderWrapper } from '../ThemeProviderWrapper';
import { AssetsProvider } from 'react-native-dex-moblibs';

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
        navigationRef.navigate(Paths.Chat, {channel: channel});
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
                      <AssetsProvider assets={{
            images: {},
            svgs: {}
          }}>

        <AuthProvider>
          <MenuProvider>
            <Stack.Navigator
              initialRouteName={Paths.SPLASH_SCREEN}
              screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}>
              <Stack.Screen
                name={Paths.SPLASH_SCREEN}
                component={SplashScreenController}
              />
              <Stack.Screen
                name={Paths.LOGIN}
                component={LoginController}
              />
              <Stack.Screen name={Paths.SIGNUP} component={Signup} />
              
              <Stack.Screen
                name={Paths.ChatList}
                component={ChatList}
              />
              <Stack.Screen
                name={Paths.PlayerList}
                component={PlayerListController}
              />
              <Stack.Screen
                name={Paths.MediaViewer}
                component={MediaViewingController}
              />
          
              <Stack.Screen
                name={Paths.AddNewBroadCast}
                component={AddNewBroadCastController}
              />
              <Stack.Screen
                name={Paths.AddNewGroup}
                component={AddNewGroupController}
              />

              <Stack.Screen
                name={Paths.AddNewGroupProfile}
                component={AddNewGroupProfileController}
              />
              <Stack.Screen
                name={Paths.AddNewGroupPermissions}
                component={GroupPermissionsController}
              />
              <Stack.Screen
                name={Paths.GroupInfo}
                component={GroupInfoController}
              />
              <Stack.Screen
                name={Paths.BroadcastInfo}
                component={BroadCastInfoController}
              />
              <Stack.Screen
                name={Paths.IndividualChatInfo}
                component={IndividualChatInfoController}
              />

              <Stack.Screen
                name={Paths.MessageInfo}
                component={MessageInfoController}
              />
              <Stack.Screen
                name={Paths.MediaList}
                component={MediaListController}
              />
              <Stack.Screen
                name={Paths.GroupNameChange}
                component={GroupNameChangeController}
              />

              <Stack.Screen
                name={Paths.Chat}
                component={ChatController}
              />
            </Stack.Navigator>
          </MenuProvider>
        </AuthProvider>
        </AssetsProvider>
        </ThemeProviderWrapper>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
