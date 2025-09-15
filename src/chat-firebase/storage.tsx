import { ReactNativeFirebase } from '@react-native-firebase/app';
import { ErrorCode } from '../chat-services/Helpers';
import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';

const getBlob = async (uri) => {
  return await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

const uploadFileWithProgressTracking = async (
  filename: string,
  uploadUri: any,
  callbackProgress: (arg0: FirebaseStorageTypes.TaskSnapshot) => void,
  callbackSuccess: (arg0: string) => void,
  callbackError: ((a: ReactNativeFirebase.NativeFirebaseError) => any) | null | undefined,
) => {
  let finished = false;
  const blob = await getBlob(uploadUri);
  const storageRef = storage().ref();
  const fileRef = storageRef.child(filename);
  const uploadTask = fileRef.put(blob);

  uploadTask.on(
    storage.TaskEvent.STATE_CHANGED,
    (snapshot) => {
     
      if (snapshot.state == storage.TaskState.SUCCESS) {
        if (finished == true) {
          return;
        }
        finished = true;
      }
      callbackProgress(snapshot);
    },
    callbackError,
    () => {
      
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
       uploadTask.snapshot.ref.getMetadata().then((res:any)=>{
        callbackSuccess(downloadURL,res);

      })
      });
    },
  );
};

const uploadImage = (uri: string) => {
  return new Promise(async (resolve, _reject) => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const blob = await getBlob(uri);

    const storageRef = storage().ref();
    const fileRef = storageRef.child(filename);
    const uploadTask = fileRef.put(blob);

    uploadTask.on(
      storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {},
      (error) => {
        resolve({ error: ErrorCode.photoUploadFailed });
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          resolve({ downloadURL: downloadURL });
        });
      },
    );
  });
};

const firebaseStorage = {
  uploadImage,
  uploadFileWithProgressTracking,
};

export { firebaseStorage };
