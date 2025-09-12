

import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { NativeModules } from 'react-native';

// In order to access to our Objective-C exported module
const { VideoPlayerBridge } = NativeModules;

const Video = (props:any) => {
  const handlePlayVideo = () => {
    // Calling the native method renderVideoFromUrl
    VideoPlayerBridge.renderVideoFromUrl(props?.uri);
  };

  return (
    <View style={styles.container}>
      <Button title="Play Video" onPress={handlePlayVideo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Video;
