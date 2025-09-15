
 export const containsOnlyLetters = (str: string) => {
    var regex = /^[a-zA-Z ]+$/;

    return regex.test(str);
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