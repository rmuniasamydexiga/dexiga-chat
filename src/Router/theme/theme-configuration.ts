const darkTheme = {
  colors: {
    gradientColors: ['#5A077C',  '#5A077C'],
    buttonColors: ['#FB960B',  '#FB960B'],
    green: 'green',
    white: '#fff',
    transparent: 'transparent',
    primary: '#FB960B',
    surface: '#121212',
    secondary: '#5A077C',
    text: '#FFFFFF',
    labelColor: '#000000',
    textInverse: '#000000',
    secondaryText:'#FB960B',
    placeholderTextColor: '#888888',
    appBackground: '#121212',
    background: 'transparent', // App background
    dropDown:'#CCCCCC',
    inverseSwitch:'#3E3E3E',
    tint:'#47a6dd',
    success: '#FB960B',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    inputBackground: '#FFFFFF', 
    inputText: '#000000', 
    borderColor: '#FB960B',
    blockColor: '#000',
    modalOpacityColor: 'rgba(0, 0, 0, 0.7)',

    //chat app
     BackgroundColor: '#D9D9D9',
        Primary: '#002366',
        lightBlue: '#F0F8FF',
        White: '#FFFFFF',
        Black: '#000000',
        mainThemeForegroundColor: '#3875e8',
        receiverBackgroud: '#DCF7C5',
        mainTextColor: '#151723',
        hairlineColor: '#e0e0e0',
        grey3: '#e6e6f2',
        grey6: '#d6d6d6',
        grey9: '#939393',
        grey: 'grey',
        whiteSmoke: '#f5f5f5',
        subButtonColor: '#eaecf0',
        TypeMessageBubble: '#ededed',
        border: '#d2d2d2',
        headerTheme: '#242541',
  },
  fonts: {
    regular: 'OpenSans-Regular',
    bold: 'OpenSans-Bold',
  },
} as const;

const lightTheme = {
  colors: {
    ...darkTheme.colors,
  },
 fonts: {
    regular: 'OpenSans-Regular',
    bold: 'OpenSans-Bold',
  },
} as const;

type AppTheme = typeof lightTheme;
export type AppThemeColors = AppTheme['colors'];
export type AppThemeFonts = AppTheme['fonts'];

export { darkTheme, lightTheme };
