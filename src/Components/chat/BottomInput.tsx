import {FC, useRef, useState} from 'react';
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import dynamicStyles from '../../Screens/Viewer/Chat/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {FadeInLeft, FadeOut} from 'react-native-reanimated';
 import { IS_IOS } from '../../Constant/Constant';
import React from 'react';
import { useStylesheet } from 'react-native-dex-moblibs';

const assets = {
  cameraFilled: require('../../Assets/Images/camera-filled.png'),
  send: require('../../Assets/Images/send.png'),
  mic: require('../../Assets/Images/microphone.png'),
  close: require('../../Assets/Images/close-x-icon.png'),
};

interface props {
  item: any;
  value: any;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAddMediaPress: () => void;
  uploadProgress: () => void;
  appStyles: any;
  trackInteractive: any;
  inReplyToItem: any;
  onReplyingToDismiss: () => void;
  recorderDetails: {
    recordSecs: number;
    recordTime: number;
    isRecording: boolean;
  };
  startRecord: () => void;
  stopRecord: (type: string) => void;
}

const BottomInput: FC<props> = props => {
  const {
    item,
    value,
    onChangeText,
    onSend,
    onAddMediaPress,
    appStyles,
    
    inReplyToItem,
    onReplyingToDismiss,
    recorderDetails,
    startRecord,
    stopRecord,
  } = props;

  const styles = dynamicStyles(null);
      const {theme} = useStylesheet()
  
  const textInputRef = useRef<any>(null);
  const [customKeyboard, setCustomKeyboard] = useState<any>({
    component: undefined,
    initialProps: undefined,
  });
  const [keyboardAccessoryHeight, setKeyboardAccessoryHeight] = useState(0);

  const isDisabled = value.trim().length === 0;

  const onKeyboardResigned = () => {
    resetKeyboardView();
  };

  const resetKeyboardView = () => {
    setCustomKeyboard({component: undefined, initialProps: undefined});
  };

  const showKeyboardView = (component: any) => {
    setCustomKeyboard({
      component,
      initialProps: {appStyles},
    });
  };



  return (
    <View style={styles.bottomContentContainer}>
      {inReplyToItem && (
        <View style={styles.inReplyToView}>
          <Text style={styles.replyingToHeaderText}>
            {'Replying to'}{' '}
            <Text style={styles.replyingToNameText}>
              {inReplyToItem.senderFirstName || inReplyToItem.senderLastName}
            </Text>
          </Text>
          <Text style={styles.replyingToContentText}>
            {inReplyToItem.content}
          </Text>
          <TouchableHighlight
            style={styles.replyingToCloseButton}
            onPress={() => onReplyingToDismiss && onReplyingToDismiss()}>
            <Image source={assets.close} style={styles.replyingToCloseIcon} />
          </TouchableHighlight>
        </View>
      )}

      {recorderDetails?.isRecording ? (
        <Animated.View
          style={styles.RecorderView}
          entering={FadeInLeft.duration(400)}
          exiting={FadeOut.duration(700)}>
          <View style={{flex: 0.15, alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.RecorderViewTouchables}
              onPress={() => stopRecord('cancel')}>
              <Icon name="delete" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View
            style={{flex: 0.7, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{color: theme.colors.text, fontFamily: theme.fonts.regular}}>
              {props.recorderDetails.recordTime}
              {/* 00: 26 */}
            </Text>
          </View>
          <View style={{flex: 0.15, alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.RecorderViewTouchables}
              onPress={() => stopRecord('finish')}>
              <Icon name="arrow-upward" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        <View style={styles.TypeMessageInput}>
          <TextInput
            style={{
              width: '67%',
              padding: 10,
              marginTop:IS_IOS? 10:0,
              justifyContent: 'center',
              fontFamily: theme.fonts.regular,
            }}
            placeholder="Message..."
            multiline={true}
            underlineColorAndroid="transparent"
            ref={textInputRef}
            onChangeText={(text: any) => onChangeText(text)}
            value={value}
          //   onSubmitEditing={(event) => {
          //         Keyboard.dismiss()
            
          // }}
            onFocus={resetKeyboardView}
          />
          <View
            style={{
              width: '18%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <TouchableOpacity style={{}} onPress={() => startRecord()}>
              <Icon
                name="keyboard-voice"
                size={26}
                color={theme.colors.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAddMediaPress}
              style={styles.inputIconContainer}>
              <Image style={styles.inputIcon} source={assets.cameraFilled} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: 'center',
              width: '15%',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              disabled={isDisabled}
              onPress={onSend}
              style={[
                styles.inputIconContainer,
                isDisabled ? {opacity: 0.2} : {opacity: 1},
              ]}>
              <Image style={styles.inputIcon} source={assets.send} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
export default BottomInput;
