

export interface IColorSet {
    mainThemeBackgroundColor: string;
    mainThemeForegroundColor: string;
    mainTextColor: string;
    mainSubtextColor: string;
    hairlineColor: string;
    tint: string;
    facebook: string;
    grey: string;
    whiteSmoke: string;
    headerTintColor: string;
    bottomTintColor: string;
    mainButtonColor: string;
    subButtonColor: string;
  }

 export  interface IColorSetObj {
    light: IColorSet;
    dark: IColorSet;
    'no-preference': IColorSet;
  }

  interface NavTheme {
    backgroundColor: string;
    fontColor: string;
    activeTintColor: string;
    inactiveTintColor: string;
    hairlineColor: string;
  }
  
 export  interface INavThemeSet {
    light: NavTheme;
    dark: NavTheme;
    'no-preference': NavTheme;
    main:string
  }

  export interface IImageSet {
    chat: any;
    file: any;
 
    notification: any;
    photo: any;
   
  }


  export interface ISizeSet {
    buttonWidth: string;
    inputWidth: string;
    radius: number;
}

export interface ILoadingModal {
    color: string;
    size: number;
    overlayColor: string;
    closeOnTouch: boolean;
    loadingType: string;
}

export interface IFontSet {
    xxlarge: number;
    xlarge: number;
    large: number;
    middle: number;
    normal: number;
    small: number;
    xsmall: number;
    title: number;
    content: number;
}

export interface IFontFamily{
    boldFont: string;
    semiBoldFont: string;
    regularFont: string;
    mediumFont: string;
    lightFont: string;
    extraLightFont: string;
}