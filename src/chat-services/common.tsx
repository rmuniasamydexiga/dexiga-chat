import {PermissionsAndroid, Platform} from 'react-native';
import {
  CHAT_DETAILS_CONFIGURE,
  CHAT_OPTIONS,
  ERROR_MESSAGE_CONTENT,
  IS_ANDROID,
  MAXIMUM_FILE_SIZE,
  SNACKBAR_MESSAGE_LENGTH,
} from '../Constant/Constant';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

import Snackbar from 'react-native-snackbar';
export const snackBarMessage = (text: string, duration: any) => {
  return Snackbar.show({
    text: text,

    duration:
      duration === SNACKBAR_MESSAGE_LENGTH.SHORT
        ? Snackbar.LENGTH_SHORT
        : Snackbar.LENGTH_LONG,
  });
};
export const requestPerMissions = async () => {
  if (IS_ANDROID) {
    let Version: any = Platform.Version;
    if (Version < 32) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'PERMISSION',
          message: 'Must need to give permission for access your local files',
          buttonNeutral: 'Give Permission',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      const granted1 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'PERMISSION',
          message: 'Must need to give permission for access your local files',
          buttonNeutral: 'Give Permission',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const granted2 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'PERMISSION',
          message: 'Must need to give permission for access your local files',
          buttonNeutral: 'Give Permission',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      return (
        granted === PermissionsAndroid.RESULTS.GRANTED &&
        granted1 === PermissionsAndroid.RESULTS.GRANTED &&
        granted2 === PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'PERMISSION',
          message: 'Must need to give permission for access your local files',
          buttonNeutral: 'Give Permission',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const granted1 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        {
          title: 'PERMISSION',
          message: 'Must need to give permission for access your local files',
          buttonNeutral: 'Give Permission',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const granted2 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'PERMISSION',
          message: 'Must need to give permission for access your local files',
          buttonNeutral: 'Give Permission',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return (
        granted === PermissionsAndroid.RESULTS.GRANTED &&
        granted1 === PermissionsAndroid.RESULTS.GRANTED &&
        granted2 === PermissionsAndroid.RESULTS.GRANTED
      );
    }
  } else {
    return requestPhotoLibraryPermission();
  }
};

const requestPhotoLibraryPermission = async () => {
  try {
    return true;
    const permissionStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    let granted = true;
    if (permissionStatus === RESULTS.DENIED) {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (result === RESULTS.GRANTED) {
        granted = true;
      } else {
        granted = false;
      }
    } else if (permissionStatus === RESULTS.GRANTED) {
      granted = true;
    } else {
      granted = false;
    }
    return granted;
  } catch (error) {
    console.error('Error requesting photo library permission:', error);
  }
};

export const getNameWithList = (userId: any, users: any[]) => {
  let name = '';
  if (users) {
    let findData = users.find((ele: {id: any}) => ele.id === userId);
    if (findData) {
      name = findData.name;
    }
  } else {
  }
  return name;
};
export const requestAudioPermission = async () => {
  try {
    if (IS_ANDROID) {
      let dat = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      let grants = null;
      let Version: any = Platform.Version;
      if (Version < 31) {
        grants = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'PERMISSION',
            message: 'Must need to give permission for access your local files',
            buttonNeutral: 'Give Permission',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
      } else {
        let grants1 = await PermissionsAndroid.request(
          // PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          // PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          // PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'PERMISSION',
            message: 'Must need to give permission for access your local files',
            buttonNeutral: 'Give Permission',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        let grants2 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          // PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          // PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          // PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'PERMISSION',
            message: 'Must need to give permission for access your local files',
            buttonNeutral: 'Give Permission',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        grants = grants2 && grants1 ? PermissionsAndroid.RESULTS.GRANTED : null;
      }

      return grants === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true
      // const permissionStatus = await request(PERMISSIONS.IOS.MICROPHONE);
      //  return permissionStatus === 'granted'
    }
  } catch (err) {
    showLog('errerr', err);
    return;
  }
};

export const getName = (user: any) => {
  let name = '';
  if (user?.name) {
    name = user?.name;
  }
  return name;
};
export const getMessage = (data: any) => {
  if (data?.startsWith('http')) {
    return 'sent a file';
  } else {
    return data;
  }
};

export const getFizeInUint = (fileSize: any) => {
  let fileSizeResult = fileSize / 1024;
  if (fileSizeResult < 1024) {
    return fileSizeResult.toFixed(2) + ' ' + 'kb';
  } else {
    fileSizeResult = fileSizeResult / 1024;
    if (fileSizeResult < 1024) {
      return fileSizeResult.toFixed(2) + ' ' + 'MB';
    }
  }
};
export const getFileSizeLimit = (fileSize: any) => {
  let fileSizeResult = fileSize / 1024;
  fileSizeResult = fileSizeResult / 1024;
  return fileSizeResult < MAXIMUM_FILE_SIZE;
};
export const showLog = (key: string, response: any) => {
  if (response) {
    console.log(
      key,
      typeof response === 'string' ? response : JSON.stringify(response),
    );
  } else {
    if (key) {
      console.log(key);
    }
  }
};

export function validateEmailAddress(text: string) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(text) === false) return false;
  else return true;
}

export function stringHasOnlySpace(text: string) {
  let regex = /^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/;
  if (regex.test(text) === false) return false;
  else return true;
}

export function validateMobileNumber(number: string | any[] | null) {
  if (number === null) {
    return false;
  }
  if (!acceptNumbersOnly(number)) {
    return false;
  }
  if (number.length >= 8 && number.length <= 12) {
    return true;
  } else return false;
}

export function validateMobileNumberRegex(number: string) {
  var regPattern = '^([0|+[0-9]{1,5})?([7-9][0-9]{9})$';
  var regPatternForMob = new RegExp(regPattern);
  if (regPatternForMob.test(number)) return true;
  else return false;
}

export function acceptNumbersOnly(value: any) {
  const regex = new RegExp('^[0-9]+$');
  const result = regex.test(value);
  return result;
}
export function validatePassword(value: string) {
  const regex = new RegExp('^[^\\s]+$'); //did't support White spaces
  if (regex.test(value) === false) return false;
  else return true;
}

export function validateName(text: string) {
  let regex = /^(?!\s*$)[-a-zA-Z_:' ']{1,100}$/;
  if (regex.test(text) === false) return false;
  else return true;
}
export function onlySpaceNotAllowed(text: string) {
  if (text) {
    if (text.trim()) return true;
    else return false;
  } else {
    return false;
  }
}

export function validateMaximumMinimuString(
  text: string,
  minimum: number,
  maximum: number,
) {
  let isValidate = false;
  if (text) {
    if (text.trim() !== '') {
      if (minimum && maximum) {
        if (text.length >= minimum && text.length <= maximum) {
          isValidate = true;
        } else {
          isValidate = false;
        }
      } else {
        isValidate = true;
      }
    }
  }
  return isValidate;
}

export function checkPlayerBlockOrNot(chatList: any, id1: any, id2: any) {
  let id = id1 < id2 ? id1 + id2 : id2 + id1;

  let findData = chatList.find(ele => ele?.channelID === id);
  if (
    findData &&
    (findData.blockedBy === id1 || findData.blockedBy == CHAT_OPTIONS.BOTH)
  ) {
    return ERROR_MESSAGE_CONTENT.UN_BLOCK_CHAT;
  } else {
    return '';
  }
  // channel?.participants?.[0]?.blockedBy !== CHAT_OPTIONS.BOTH && channel?.participants?.[0]?.blockedBy !== user?.userID ?
}
