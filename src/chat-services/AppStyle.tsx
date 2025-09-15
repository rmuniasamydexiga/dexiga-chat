import { Platform, Dimensions, I18nManager } from 'react-native';
import { IColorSet,IColorSetObj, INavThemeSet ,IImageSet, ISizeSet,ILoadingModal, IFontSet, IFontFamily} from '../Interfaces';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const darkColorSet :IColorSet= {
  mainThemeBackgroundColor: '#121212',
  mainThemeForegroundColor: '#3875e8',
  mainTextColor: '#ffffff',
  mainSubtextColor: '#f5f5f5',
  hairlineColor: '#222222',
  tint: '#3068CC',
  facebook: '#4267b2',
  grey: 'grey',
  whiteSmoke: '#222222',
  headerTintColor: '#ffffff',
  bottomTintColor: 'lightgrey',
  mainButtonColor: '#062246',
  subButtonColor: '#20242d',
};

const lightColorSet:IColorSet = {
  mainThemeBackgroundColor: '#ffffff',
  mainThemeForegroundColor: '#3875e8',
  mainTextColor: '#151723',
  mainSubtextColor: '#7e7e7e',
  hairlineColor: '#e0e0e0',
  tint: '#3068CC',
  facebook: '#4267b2',
  grey: 'grey',
  whiteSmoke: '#f5f5f5',
  headerTintColor: '#000000',
  bottomTintColor: 'grey',
  mainButtonColor: '#e8f1fd',
  subButtonColor: '#eaecf0',
};

const colorSet:IColorSetObj = {
  light: lightColorSet,
  dark: darkColorSet,
  'no-preference': lightColorSet,
};

const navThemeConstants :INavThemeSet= {
  light: {
    backgroundColor: '#fff',
    fontColor: '#000',
    activeTintColor: '#3875e8',
    inactiveTintColor: '#ccc',
    hairlineColor: '#e0e0e0',
  },
  dark: {
    backgroundColor: '#000',
    fontColor: '#fff',
    activeTintColor: '#3875e8',
    inactiveTintColor: '#888',
    hairlineColor: '#222222',
  },
  main: '#3875e8',
  'no-preference': {
    backgroundColor: '#fff',
    fontColor: '#000',
    activeTintColor: '#3875e8',
    inactiveTintColor: '#ccc',
    hairlineColor: '#e0e0e0',
  },
};

const imageSet:IImageSet = {
  chat: require('../Assets/Images/chat.png'),
  file: require('../Assets/Images/file.png'),
  notification: require('../Assets/Images/notification.png'),
  photo: require('../Assets/Images/photo.png'),
};



const fontFamily:IFontFamily = {
  boldFont: '',
  semiBoldFont: '',
  regularFont: '',
  mediumFont: '',
  lightFont: '',
  extraLightFont: '',
};

const fontSet :IFontSet= {
  xxlarge: 40,
  xlarge: 30,
  large: 25,
  middle: 20,
  normal: 16,
  small: 13,
  xsmall: 11,
  title: 30,
  content: 20,
};

const loadingModal:ILoadingModal = {
  color: '#FFFFFF',
  size: 20,
  overlayColor: 'rgba(0,0,0,0.5)',
  closeOnTouch: false,
  loadingType: 'Spinner', // 'Bubbles', 'DoubleBounce', 'Bars', 'Pulse', 'Spinner'
};

const sizeSet:ISizeSet = {
  buttonWidth: '70%',
  inputWidth: '80%',
  radius: 25,
};

const styleSet = {
  menuBtn: {
    container: {
      borderRadius: 22.5,
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    icon: {
      tintColor: 'black',
      width: 15,
      height: 15,
    },
  },
  searchBar: {
    container: {
      marginLeft: Platform.OS === 'ios' ? 30 : 0,
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      flex: 1,
    },
    input: {
      borderRadius: 10,
      color: 'black',
    },
  },
  rightNavButton: {
    marginRight: 10,
  },
  borderRadius: {
    main: 25,
    small: 5,
  },
  textInputWidth: {
    main: '80%',
  },
  backArrowStyle: {
    resizeMode: 'contain',
    tintColor: '#3875e8',
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    marginLeft: 10,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
};

const StyleDict = {
  imageSet,

  fontFamily,
  colorSet,
  navThemeConstants,
  fontSet,
  sizeSet,
  styleSet,
  loadingModal,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
};

export default StyleDict;
