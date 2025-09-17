import {Alert, Platform, PermissionsAndroid,Image} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {downloadFile, getFileUrlForInternal, getFileUrlForInternalReceiver} from '../../chat-services/MediaHelper';
import {useSelector} from 'react-redux';
import {selectUser} from '../../redux/chatSlice';
import {showLog} from '../../chat-services/common';
import { PageContainer,HeaderTwo } from 'react-native-dex-moblibs';
import Video from 'react-native-video';
import { HEIGHT, MESSAGE_TYPE, WIDTH } from '../../chat-services/constant/constant';

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
  
  const mediaData=route?.params?.data
    return (
  <PageContainer>
      <HeaderTwo
        isShowDownLoad={false}
        title={mediaData.messageType}
        onPress={() => goNavigationBack()}
        menuVisible={false}
        onPressCorner={() => checkPermission()}></HeaderTwo>
      {mediaData.messageType === MESSAGE_TYPE.IMAGE ? (
        <Image
          source={{
            uri:
              mediaData.senderID !== user.id
                ? getFileUrlForInternalReceiver(mediaData)
                : getFileUrlForInternal(mediaData),
          }}
          style={{height: HEIGHT, width: WIDTH}}
          //   indicatorProps={circleSnailProps}
          resizeMode={'contain'}
          //   onLoad={this.onImageLoad}
        />
      ) : (
<Video
    onError={(error)=>{
      showLog("Error",error)
   
    }
    }

      source={{
        uri:
        mediaData.senderID !== user.id
                    ? getFileUrlForInternalReceiver(mediaData)
                    : getFileUrlForInternal(mediaData)
 
           
      }}
     style={{width: WIDTH, height: HEIGHT - 50}}
   
          resizeMode='contain'
    />
       
      )}
  </PageContainer>
  );
 
};

export default MediaViewingController;
