import React from 'react';
import {  Dimensions, ImageBackground, Image } from 'react-native';
const { height, width } = Dimensions.get('window');

const SplashScreenViewer = () => {


  return  <ImageBackground
      style={{
        width: width,
        height: height,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
      resizeMode={'stretch'}
     
      source={require('../../../Assets/Images/splash.jpg')}>
        
 
    
    </ImageBackground>
  
};
export default SplashScreenViewer;
