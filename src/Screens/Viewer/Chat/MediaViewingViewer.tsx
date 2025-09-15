import React from 'react';
import {View, StyleSheet, Dimensions, Image, SafeAreaView} from 'react-native';

import {HEIGHT, MESSAGE_TYPE, WIDTH} from '../../../Constant/Constant';
import HeaderTwo from '../../../Components/Header/HeaderTwo';
import Video from 'react-native-video';

import {
  getFileUrlForInternal,
  getFileUrlForInternalReceiver,
  isUrlValid,
} from '../../../chat-services/MediaHelper';
import { showLog } from '../../../chat-services/common';
import { PageContainer } from 'react-native-dex-moblibs';
interface User {
  name: string;
  email: string;
}

interface IPlayerListViewer {
  data: any;
  goNavigationBack:()=>void
  onPressCorner:()=>void
  user: any;
}

const MediaViewingViewer: React.FC<IPlayerListViewer> = props => {
  const {data, user,onPressCorner,goNavigationBack} = props;

  return (
   

    

  <PageContainer>
      <HeaderTwo
        isShowDownLoad={false}
        title={data.messageType}
        onPress={() => goNavigationBack()}
        menuVisible={false}
        onPressCorner={() => onPressCorner()}></HeaderTwo>
      {data.messageType === MESSAGE_TYPE.IMAGE ? (
        <Image
          source={{
            uri:
              data.senderID !== user.id
                ? getFileUrlForInternalReceiver(data)
                : getFileUrlForInternal(data),
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
        data.senderID !== user.id
                    ? getFileUrlForInternalReceiver(data)
                    : getFileUrlForInternal(data)
 
           
      }}
     style={{width: WIDTH, height: HEIGHT - 50}}
   
          resizeMode='contain'
    />
       
      )}
  </PageContainer>
  );
};

export default MediaViewingViewer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'purple',
    fontSize: 20,
    fontWeight: '600',
  },
  userItem: {
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    height: 60,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingLeft: 20,
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
  },
  name: {color: 'black', marginLeft: 20, fontSize: 20},
});
