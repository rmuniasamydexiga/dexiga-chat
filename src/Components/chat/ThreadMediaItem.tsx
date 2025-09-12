import {FC, useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import dynamicStyles from '../../Screens/Viewer/Chat/styles';
import {IS_ANDROID, MESSAGE_TYPE} from '../../Constant/Constant';
import Video from 'react-native-video';
import {
  getFileUrlForInternal,
  getFileUrlForInternalReceiver,
} from '../../Screens/Controller/Chat/Helper/MediaHelper';
import PlayIcon from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {dayFormatwithUnix} from '../../Helper/DayHelper';
import {FONTS} from '../../Constant/Fonts';
import {GetTheme} from '../../Constant/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getFizeInUint, showLog} from '../../Helper/common';
import React from 'react';

interface props {
  outBound: any;
  updateItemImagePath: (obj: any) => void;
  videoRef: any;
  isShowDownLoad: any;
  item: any;
  uploadProgress: any;
  dynamicStyles: any;
  is_group: boolean;
}

const ThreadMediaItem: FC<props> = props => {
  const {
    outBound,
    updateItemImagePath,
    uploadProgress,
    videoRef,
    isShowDownLoad,
    is_group,
    item,
  } = props;
  const appStyles = dynamicStyles(outBound);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const theme = GetTheme();

  useEffect(() => {
    if (!videoLoading) {
      setVideoPaused(true);
    }
  }, [videoLoading]);

  if (item.messageType === MESSAGE_TYPE.IMAGE) {
    return (
      <>
        <ImageBackground
          source={{
            uri: !outBound
              ? getFileUrlForInternalReceiver(item)
              : getFileUrlForInternal(item),
          }}
          style={{width: 300, height: 250, borderRadius: 10}}
          imageStyle={{borderRadius: 30}}>
          {!outBound && is_group && (
            <Text
              style={{
                fontSize: 14,
                fontFamily: FONTS.OpenSans_Bold,
                color: theme.Primary,
                margin: 10,
              }}>
              {item.senderFirstName}
            </Text>
          )}

          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {item &&
            item.url &&
            item.url.startsWith('file') &&
            uploadProgress !== 0 ? (
              <AnimatedCircularProgress
                size={80}
                width={5}
                fill={uploadProgress}
                tintColor="#00e0ff"
                onAnimationComplete={() => showLog('onAnimationComplete', null)}
                backgroundColor="#3d5875"
              />
            ) : isShowDownLoad ? (
              <View>
                <Octicons name="download" size={53} color={'white'} />
                <Text
                  style={{
                    fontSize: 14,
                    alignSelf: 'flex-start',
                    color: '#ffffff',
                    fontFamily: FONTS.OpenSans_Regular,
                    marginTop: 10,
                  }}>
                  {getFizeInUint(item.fileSize)}
                </Text>
              </View>
            ) : null}
          </View>
          <Text
            style={{
              fontFamily: FONTS.OpenSans_Regular,
              fontSize: 15,
              alignSelf: 'flex-end',
              margin: 15,
              color: '#ffffff',
            }}>
            {item?.created ? dayFormatwithUnix(item?.created, 'HH:MM') : ''}
          </Text>
        </ImageBackground>
      </>
    );
  } else if (item.messageType === MESSAGE_TYPE.VIDEO) {
    return (
      <View>
        {/* <TouchableOpacity onPress={()=>{}} > */}
        {IS_ANDROID ? (
          <ImageBackground
            style={{width: 300, height: 250, borderRadius: 10}}
            imageStyle={{borderRadius: 10}}
            source={{
              uri: !outBound
                ? getFileUrlForInternalReceiver(item)
                : getFileUrlForInternal(item),
            }}>
            {!outBound && is_group && (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: FONTS.OpenSans_Bold,
                  color: theme.Primary,
                  margin: 10,
                }}>
                {item.senderFirstName}
              </Text>
            )}

            {item &&
            item.url &&
            item.url.startsWith('file') &&
            uploadProgress !== 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AnimatedCircularProgress
                  size={80}
                  width={5}
                  fill={uploadProgress}
                  tintColor="#00e0ff"
                  onAnimationComplete={() =>
                    showLog('onAnimationComplete', null)
                  }
                  backgroundColor="#3d5875"
                />
              </View>
            ) : isShowDownLoad && !outBound ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Octicons name="download" size={53} color={'white'} />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#ffffff',
                    fontFamily: FONTS.OpenSans_Regular,
                    marginTop: 10,
                  }}>
                  {getFizeInUint(item.fileSize)}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <PlayIcon name="play-circle-o" size={53} color={'white'} />
              </View>
            )}

            <Text
              style={{
                fontFamily: FONTS.OpenSans_Regular,
                fontSize: 15,
                alignSelf: 'flex-end',
                margin: 15,
                color: '#ffffff',
              }}>
              {item?.created ? dayFormatwithUnix(item?.created, 'HH:MM') : ''}
            </Text>
          </ImageBackground>
        ) : (
          <View style={{flex: 1}}>
            <TouchableOpacity disabled={true} onPress={() => {}}>
              {!outBound && is_group && (
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FONTS.OpenSans_Bold,
                    color: theme.Primary,
                    margin: 10,
                  }}>
                  {item.senderFirstName}
                </Text>
              )}

              <Video
                style={{width: 300, height: 250, borderRadius: 10}}
                paused={true}
                //style={{ height:/1.2,width:width/1,borderColor:'white',borderWidth:0.5,}}

                source={{
                  uri: !outBound
                    ? getFileUrlForInternalReceiver(item)
                    : getFileUrlForInternal(item),
                }}
                resizeMode="stretch"
              />
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  backgroundColor: 'rgba(0,0,0,.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {item &&
                item.url &&
                item.url.startsWith('file') &&
                uploadProgress !== 0 ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <AnimatedCircularProgress
                      size={80}
                      width={5}
                      fill={uploadProgress}
                      tintColor="#00e0ff"
                      onAnimationComplete={() =>
                        showLog('onAnimationComplete', null)
                      }
                      backgroundColor="#3d5875"
                    />
                  </View>
                ) : isShowDownLoad && !outBound ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Octicons
                      disabled={true}
                      name="download"
                      size={53}
                      color={'white'}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <PlayIcon
                      name="play-circle-o"
                      size={53}
                      color={'white'}
                      disabled={true}
                    />
                  </View>
                )}

                <Text
                  style={{
                    fontFamily: FONTS.OpenSans_Regular,
                    fontSize: 15,
                    alignSelf: 'flex-end',
                    margin: 15,
                    color: '#ffffff',
                  }}>
                  {item?.created
                    ? dayFormatwithUnix(item?.created, 'HH:MM')
                    : ''}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* </TouchableOpacity>   */}
      </View>
    );
  } else if (item.messageType === MESSAGE_TYPE.DOCUMENT) {
    return (
      <View
        style={{
          height: !outBound && is_group ? 80 : 60,
          width: 250,
          margin: 10,
          borderRadius: 10,
        }}>
        {!outBound && is_group && (
          <Text
            style={{
              fontSize: 14,
              fontFamily: FONTS.OpenSans_Bold,
              color: theme.Primary,
              marginTop: 10,
              marginLeft: 10,
            }}>
            {item.senderFirstName}
          </Text>
        )}

        <View style={{flex: 0.75, flexDirection: 'row'}}>
          <View style={{flex: 0.2}}>
            <View
              style={{
                height: 50,
                backgroundColor: theme.headerTheme,
                borderRadius: 10,
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{textAlign: 'center', color: theme.White}}>
                  {item.fileName ? item.fileName.split('.')[1] : ''}
                </Text>
              </View>
            </View>
          </View>
          <View style={{flex: 0.7}}>
            <Text style={{marginLeft: 10}} numberOfLines={1}>
              {item.fileName}
            </Text>
          </View>
          <View style={{flex: 0.1}}>
            {item.url.startsWith('content') && (
              <AnimatedCircularProgress
                size={30}
                width={3}
                fill={uploadProgress}
                tintColor="#00e0ff"
                onAnimationComplete={() =>
                  showLog('Test', 'onAnimationComplete')
                }
                backgroundColor="#3d5875"
              />
            )}
            {isShowDownLoad && !item.url.startsWith('content') ? (
              <View
                style={{
                  height: 30,
                  width: 30,
                  borderWidth: 1,
                  borderRadius: 30,
                }}>
                <MaterialCommunityIcons
                  style={{margin: 5}}
                  name={'download'}
                  size={20}></MaterialCommunityIcons>
              </View>
            ) : (
              <></>
            )}
          </View>
        </View>
        <Text
          style={{
            fontFamily: FONTS.OpenSans_Regular,
            fontSize: 10,
            alignSelf: 'flex-end',
            color: '#ffffff',
            marginTop: 0,
          }}>
          {item?.created ? dayFormatwithUnix(item?.created, 'HH:MM') : ''}
        </Text>
      </View>
    );
  } else {
    return <Image source={{uri: item.url}} style={appStyles.mediaMessage} />;
  }
};

export default ThreadMediaItem;
