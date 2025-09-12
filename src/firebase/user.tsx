import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export const usersRef = firestore().collection('users');

export const getUserData = async (userId: string | undefined) => {
  try {
    const user = await usersRef.doc(userId).get();

    return {data: {...user.data(), id: user.id}, success: true};
  } catch (error) {
    return {
      error: 'Oops! an error occured. Please try again',
      success: false,
    };
  }
};

export const updateUserData = async (
  userId: string | undefined,
  userData: Partial<{[x: string]: any}>,
) => {
  try {
    const userRef = usersRef.doc(userId);

    await userRef.update({
      ...userData,
    });

    return {success: true};
  } catch (error) {
    return {error, success: false};
  }
};

export const subscribeUsers = async (callback: any) => {
  const snapshot = await usersRef.get();
  const data: any[] = [];
  const completeData: any[] = [];
  snapshot.docs.map((doc: any) => {
    const user = doc.data();
    data.push({...user, id: doc.id});
    completeData.push({...user, id: doc.id});
  });
  callback({
    data: data,
    completeData: completeData,
  });

  // return usersRef.onSnapshot((querySnapshot) => {
  //   const data = [];
  //   const completeData = [];
  //   querySnapshot.forEach((doc) => {
  //     const user = doc.data();
  //     data.push({ ...user, id: doc.id });
  //     completeData.push({ ...user, id: doc.id });
  //   });
  //   return callback(data, completeData);
  // });
};
export const subscribeUsersWithoutCallBack = async () => {
  const snapshot = await usersRef.get();
  const data: any[] = [];
  const completeData: any[] = [];
  snapshot.docs.map((doc: any) => {
    const user = doc.data();
    data.push({...user, id: doc.id});
    completeData.push({...user, id: doc.id});
  });
  return {
    data: data,
    completeData: completeData,
  };
};
export const getAllUserList = async (email: any) => {
  const userList: any = [];
  let res = await firestore().collection('users').orderBy('name').get();

  res?.docs?.forEach(item => {
    if (item?.data()?.email != email) {
      userList.push(item.data());
    }
  });

  return userList;
};

export const subscribeCurrentUser = (
  userId: any,
  callback: (arg0: FirebaseFirestoreTypes.DocumentData) => void,
) => {
  const ref = usersRef
    .where('id', '==', userId)
    .onSnapshot({includeMetadataChanges: true}, querySnapshot => {
      const docs = querySnapshot.docs;
      if (docs.length > 0) {
        callback(docs[0].data());
      }
    });
  return ref;
};
