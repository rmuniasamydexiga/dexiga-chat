import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,

  signOut,
} from '@react-native-firebase/auth';

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
} from '@react-native-firebase/firestore';

import {
  getMessaging,
  requestPermission,
} from '@react-native-firebase/messaging';

import VoipPushNotification from 'react-native-voip-push-notification';
import { Platform } from 'react-native';
import { currentTimestamp } from './channel';
import { showLog } from '../chat-services/common';
import { ErrorCode } from '../chat-services/Helpers';

// Initialize
const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const usersRef = collection(db, 'users');


// ---------------- AUTH ----------------
export const retrievePersistedAuthUser = () => {
  return new Promise(resolve => {
    return onAuthStateChanged(auth, async (user: any ) => {
      if (user) {
        try {
          const userSnap = await getDoc(doc(usersRef, user.uid));
          const userData = userSnap.data();
          resolve({ ...userData, id: user.uid, userID: user.uid });
        } catch (e) {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

export const register = async (
  userDetails: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone: string;
    profilePictureURL: string;
    location: string;
    signUpLocation: string;
  },
  appIdentifier: any,
) => {
  try {
    const { email, firstName, lastName, password, phone, profilePictureURL, location, signUpLocation } =
      userDetails;

    const res = await createUserWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    const timestamp = currentTimestamp();

    const data = {
      id: uid,
      userID: uid,
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

    await setDoc(doc(usersRef, uid), data);
    return { user: data };
  } catch (error: any) {
    let errorCode = ErrorCode.serverError;
    if (error.code === 'auth/email-already-in-use') {
      errorCode = ErrorCode.emailInUse;
    }
    return { error: errorCode };
  }
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    const userSnap = await getDoc(doc(usersRef, uid));

    if (!userSnap.exists) return { error: ErrorCode.noUser };

    const userData = userSnap.data();
    return { user: { ...userData, email, id: uid } };
  } catch (error: any) {
    let errorCode = ErrorCode.serverError;
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
    }
    return { error: errorCode };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error };
  }
};


// ---------------- FIRESTORE ----------------
export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  const q = query(usersRef, where('email', '==', email));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const createUser = async (userId: string, data: any): Promise<any> => {
  try{
        console.log('User created successfully:', data);

    let result= await setDoc(doc(usersRef, userId), data);
    console.log('User created successfully:', result);
    return result;
  }catch(e){
    console.error('Error creating user: ', e);
  }
};

export const updateUser = async (
  userID: string | undefined,
  newData: { pushToken?: string; pushKitToken?: string },
) => {
  if (!userID) return;
  const dataWithOnlineStatus = {
    ...newData,
    lastOnline: currentTimestamp(),
  };
  await setDoc(doc(usersRef, userID), dataWithOnlineStatus, { merge: true });
};


// ---------------- PUSH ----------------
export const fetchAndStorePushTokenIfPossible = async (user: {
  id: any;
  userID: any;
}) => {
  try {
    const settings = await requestPermission(getMessaging(app));
    if (settings) {
      const token = await getMessaging(app).getToken();
      await updateUser(user.id || user.userID, { pushToken: token });
    }

    if (Platform.OS === 'ios') {
      VoipPushNotification.requestPermissions();
      VoipPushNotification.registerVoipToken();
      VoipPushNotification.addEventListener('register', async token => {
        await updateUser(user.id || user.userID, { pushKitToken: token });
      });
    }
  } catch (error) {
    showLog('AuthError', error.message);
  }
};



export const loginUser = async (email: string, password: string, userType: string) => {
  try {
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { error: 'User not found' };
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data() as any;

    // Check password
    if (userData.password !== password) {
      return { error: 'Wrong Password' };
    }

    // Check userType
    if (userData.userType !== userType) {
      return { error: 'User type mismatch' };
    }

    // Push token update
    await fetchAndStorePushTokenIfPossible({
      id: userData.userId,
      userID: userData.userId,
    });

    // Success
    return {
      user: {
        name: userData.name,
        email: userData.email,
        id: userData.userId,
        userID: userData.userId,
      },
    };
  } catch (err: any) {
    return { error: err.message || 'Login failed' };
  }
};