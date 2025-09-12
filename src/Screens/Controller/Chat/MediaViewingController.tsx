import {Alert, Platform, PermissionsAndroid} from 'react-native';
import React from 'react';
import MediaViewingViewer from '../../Viewer/Chat/MediaViewingViewer';
import {useNavigation, useRoute} from '@react-navigation/native';
import {downloadFile} from './Helper/MediaHelper';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../Redux/chat/reducers';
import {showLog} from '../../../Helper/common';

const MediaViewingController: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const user = useSelector(selectUser);

  const checkPermission = async () => {
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
      downloadFile(route?.params?.data);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile(route?.params?.data);
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        showLog('mediaCache', 'Storage Permission Not Granted' + err);
      }
    }
  };

  const goNavigationBack = () => {
    navigation.goBack();
  };
  return (
    <MediaViewingViewer
      user={user}
      data={route?.params?.data}
      onPressCorner={() => checkPermission()}
      goNavigationBack={() => goNavigationBack()}
    />
  );
};

export default MediaViewingController;
