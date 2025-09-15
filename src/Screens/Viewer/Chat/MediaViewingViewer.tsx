import React from 'react';
import { Image} from 'react-native';

import {HEIGHT, MESSAGE_TYPE, WIDTH} from '../../../Constant/Constant';
import HeaderTwo from '../../../Components/Header/HeaderTwo';
import Video from 'react-native-video';

import {
  getFileUrlForInternal,
  getFileUrlForInternalReceiver,
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

