import messaging from '@react-native-firebase/messaging';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {ErrorCode} from '../Helper/Helpers';
import firestore from '@react-native-firebase/firestore';
import VoipPushNotification from 'react-native-voip-push-notification';
import {Platform} from 'react-native';
import {currentTimestamp} from './channel';
import {showLog} from '../Helper/common';

const usersRef = firestore().collection('users');
interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profilePictureURL: string;
  location: string;
  signUpLocation: string;
  appIdentifier: string;
  createdAt: any;
  created_at: any;
}

export const retrievePersistedAuthUser = () => {
  return new Promise(resolve => {
    return auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data();
            resolve({...userData, id: user.uid, userID: user.uid});
          })
          .catch(error => {
            resolve(null);
          });
      } else {
        resolve(null);
      }
    });
  });
};

const signInWithCredential = (
  credential: FirebaseAuthTypes.AuthCredential,
  appIdentifier: any,
) => {
  return new Promise((resolve, _reject) => {
    auth()
      .signInWithCredential(credential)
      .then((response: any) => {
        const isNewUser = response.additionalUserInfo.isNewUser;
        const {first_name, last_name} = response.additionalUserInfo.profile;
        const {uid, email, phoneNumber, photoURL} = response.user._user;
        if (isNewUser) {
          const timestamp = currentTimestamp();
          // firestore.FieldValue.serverTimestamp();
          const userData = {
            id: uid,
            email: email,
            firstName: first_name,
            lastName: last_name,
            phone: phoneNumber,
            profilePictureURL: photoURL,
            userID: uid,
            appIdentifier,
            created_at: timestamp,
            createdAt: timestamp,
          };
          usersRef
            .doc(uid)
            .set(userData)
            .then(() => {
              resolve({
                user: {...userData, id: uid, userID: uid},
                accountCreated: true,
              });
            });
        }
        usersRef
          .doc(uid)
          .get()
          .then(document => {
            const userData = document.data();
            resolve({
              user: {...userData, id: uid, userID: uid},
              accountCreated: false,
            });
          });
      })
      .catch(_error => {
        resolve({error: ErrorCode.serverError});
      });
  });
};

export const register = (
  userDetails: {
    email: any;
    firstName: any;
    lastName: any;
    password: any;
    phone: any;
    profilePictureURL: any;
    location: any;
    signUpLocation: any;
  },
  appIdentifier: any,
) => {
  const {
    email,
    firstName,
    lastName,
    password,
    phone,
    profilePictureURL,
    location,
    signUpLocation,
  } = userDetails;
  return new Promise(function (resolve, _reject) {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        const timestamp = currentTimestamp();
        // firestore.FieldValue.serverTimestamp();
        const uid = response.user.uid;

        const data = {
          id: uid,
          userID: uid, // legacy reasons
          email,
          firstName,
          lastName,
          phone: phone || '',
          profilePictureURL,
          location: location || '',
          signUpLocation: signUpLocation || '',
          appIdentifier,
          createdAt: timestamp,
          created_at: timestamp,
        };
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            resolve({user: data});
          })
          .catch(error => {
            resolve({error: ErrorCode.serverError});
          });
      })
      .catch(error => {
        var errorCode = ErrorCode.serverError;
        if (error.code === 'auth/email-already-in-use') {
          errorCode = ErrorCode.emailInUse;
        }
        resolve({error: errorCode});
      });
  });
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  return new Promise(function (resolve, reject) {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        const uid = response.user.uid;

        const userData = {
          email,
          password,
          id: uid,
        };
        usersRef
          .doc(uid)
          .get()
          .then(function (firestoreDocument) {
            if (!firestoreDocument.exists) {
              resolve({errorCode: ErrorCode.noUser});
              return;
            }
            const user = firestoreDocument.data();
            const newUserData = {
              ...userData,
              ...user,
            };
            resolve({user: newUserData});
          })
          .catch(function (_error) {
            resolve({error: ErrorCode.serverError});
          });
      })
      .catch(error => {
        var errorCode = ErrorCode.serverError;
        switch (error.code) {
          case 'auth/wrong-password':
            errorCode = ErrorCode.invalidPassword;
            break;
          case 'auth/network-request-failed':
            errorCode = ErrorCode.serverError;
            break;
          case 'auth/user-not-found':
            errorCode = ErrorCode.noUser;
            break;
          default:
            errorCode = ErrorCode.serverError;
        }
        resolve({error: errorCode});
      });
  });
};

export const loginWithFacebook = (accessToken: any, appIdentifier: any) => {
  const credential = auth.FacebookAuthProvider.credential(accessToken);
  return new Promise((resolve, _reject) => {
    signInWithCredential(credential, appIdentifier).then(response => {
      resolve(response);
    });
  });
};

export const logout = () => {
  auth().signOut();
};

export const onVerificationChanged = (phone: string) => {
  auth()
    .verifyPhoneNumber(phone)
    .on(
      'state_changed',
      phoneAuthSnapshot => {
        showLog('State: ', phoneAuthSnapshot.state);
      },
      error => {
        showLog('Error', error);
      },
      phoneAuthSnapshot => {
        showLog('phoneAuthSnapshot Success', phoneAuthSnapshot);
      },
    );
};

export const retrieveUserByPhone = (phone: any) => {
  return new Promise(resolve => {
    usersRef.where('phone', '==', phone).onSnapshot(querySnapshot => {
      if (querySnapshot.docs.length <= 0) {
        resolve({error: true});
      } else {
        resolve({success: true});
      }
    });
  });
};

export const sendSMSToPhoneNumber = (phoneNumber: string) => {
  return new Promise(function (resolve, _reject) {
    auth()
      .signInWithPhoneNumber(
        phoneNumber,
        new auth.RecaptchaVerifier('recaptcha-container'),
      )
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        resolve({confirmationResult});
      })
      .catch(function (_error) {
        resolve({error: ErrorCode.smsNotSent});
      });
  });
};

export const loginWithSMSCode = (
  smsCode: string | undefined,
  verificationID: string | null,
) => {
  const credential = auth.PhoneAuthProvider.credential(verificationID, smsCode);
  return new Promise(function (resolve, _reject) {
    auth()
      .signInWithCredential(credential)
      .then(result => {
        const {user} = result;
        usersRef
          .doc(user.uid)
          .get()
          .then(function (firestoreDocument) {
            if (!firestoreDocument.exists) {
              resolve({errorCode: ErrorCode.noUser});
              return;
            }
            const userData = firestoreDocument.data();
            resolve({user: userData});
          })
          .catch(function (_error) {
            resolve({error: ErrorCode.serverError});
          });
      })
      .catch(_error => {
        resolve({error: ErrorCode.invalidSMSCode});
      });
  });
};

export const registerWithPhoneNumber = (
  userDetails: {
    firstName: any;
    lastName: any;
    phone: any;
    profilePictureURL: any;
    location: any;
    signUpLocation: any;
  },
  smsCode: string | undefined,
  verificationID: string | null,
  appIdentifier: any,
) => {
  const {
    firstName,
    lastName,
    phone,
    profilePictureURL,
    location,
    signUpLocation,
  } = userDetails;
  const credential = auth.PhoneAuthProvider.credential(verificationID, smsCode);
  return new Promise(function (resolve, _reject) {
    auth()
      .signInWithCredential(credential)
      .then(response => {
        const timestamp = currentTimestamp();
        // firestore.FieldValue.serverTimestamp();
        const uid = response.user.uid;
        const data = {
          id: uid,
          userID: uid, // legacy reasons
          firstName,
          lastName,
          phone,
          profilePictureURL,
          location: location || '',
          signUpLocation: signUpLocation || '',
          appIdentifier,
          created_at: timestamp,
          createdAt: timestamp,
        };
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            resolve({user: data});
          });
      })
      .catch(error => {
        var errorCode = ErrorCode.serverError;
        if (error.code === 'auth/email-already-in-use') {
          errorCode = ErrorCode.emailInUse;
        }
        resolve({error: errorCode});
      });
  });
};

export const updateProfilePhoto = (
  userID: string | undefined,
  profilePictureURL: any,
) => {
  return new Promise((resolve, _reject) => {
    usersRef
      .doc(userID)
      .update({profilePictureURL: profilePictureURL})
      .then(() => {
        resolve({success: true});
      })
      .catch(error => {
        resolve({error: error});
      });
  });
};

export const fetchAndStorePushTokenIfPossible = async (user: {
  id: any;
  userID: any;
}) => {
  try {
    const settings = await messaging().requestPermission();
    if (settings) {
      const token = await messaging().getToken();
      updateUser(user.id || user.userID, {pushToken: token});
    }

    if (Platform.OS === 'ios') {
      VoipPushNotification.requestPermissions();
      VoipPushNotification.registerVoipToken();

      VoipPushNotification.addEventListener('register', token => {
        updateUser(user.id || user.userID, {pushKitToken: token});
      });
    }
  } catch (error) {
    showLog('AuthError', error);
  }
};

export const updateUser = async (
  userID: string | undefined,
  newData: {pushToken?: string; pushKitToken?: string},
) => {
  const dataWithOnlineStatus = {
    ...newData,
    lastOnlineTimestamp: firestore.FieldValue.serverTimestamp(),
  };
  return await usersRef
    .doc(userID)
    .set({...dataWithOnlineStatus}, {merge: true});
};

const firebaseAuth = {
  retrievePersistedAuthUser,
  loginWithEmailAndPassword,
  logout,
  sendSMSToPhoneNumber,
  loginWithSMSCode,
  registerWithPhoneNumber,
  retrieveUserByPhone,
};

export default firebaseAuth;
