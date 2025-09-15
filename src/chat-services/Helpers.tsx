import { PixelRatio } from "react-native";
import { IS_ANDROID, IS_IOS, IS_IPAD, SCREEN_WIDTH } from "../Constant/Constant";

 export const containsOnlyLetters = (str: string) => {
    var regex = /^[a-zA-Z ]+$/;

    return regex.test(str);
}




export const font_size = (sizes: number) => {
  let size = IS_ANDROID ? sizes : sizes - 1.5


  let scale = SCREEN_WIDTH / 320;
  const newSize = size * scale;

  let pxValue = 14
  //  return size
  if (IS_IOS) {
    if (IS_IPAD) {
      pxValue = Math.round(PixelRatio.roundToNearestPixel(newSize)) - 10;
    } else {
      pxValue = Math.round(PixelRatio.roundToNearestPixel(newSize));
    }
  }

  else {
    pxValue = Math.round(PixelRatio.roundToNearestPixel(newSize)) - 3;
  }


  return pxValue
}

export const ErrorCode = {
    passwordInUse: 'passwordInUse',
    badEmailFormat: 'badEmailFormat',
    emailInUse: 'emailInUse',
    invalidPassword: 'invalidPassword',
    noUser: 'noUser',
    rateLimited: 'rateLimited',
    serverError: 'serverError',
    photoUploadFailed: 'photoUploadFailed',
    fbAuthCancelled: 'fbAuthCancelled',
    fbAuthFailed: 'fbAuthFailed',
    smsNotSent: 'smsNotSent',
    invalidSMSCode: 'invalidSMSCode',
  };