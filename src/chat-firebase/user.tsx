import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  where,
  onSnapshot,
} from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";

const db = getFirestore(getApp());

// reference
export const usersRef = collection(db, "users");

// ✅ Get single user
export const getUserData = async (userId: string | undefined) => {
  try {
    if (!userId) throw new Error("UserId is required");
    const userSnap = await getDoc(doc(db, "users", userId));

    if (!userSnap.exists()) {
      return { error: "User not found", success: false };
    }

    return { data: { ...userSnap.data(), id: userSnap.id }, success: true };
  } catch (error) {
    return {
      error: "Oops! an error occured. Please try again",
      success: false,
    };
  }
};

// ✅ Update user
export const updateUserData = async (
  userId: string | undefined,
  userData: Partial<{ [x: string]: any }>
) => {
  try {
    if (!userId) throw new Error("UserId is required");
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { ...userData });

    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};

// ✅ Subscribe users (one-time get)
export const subscribeUsers = async (callback: any) => {
  const snapshot = await getDocs(usersRef);
  const data: any[] = [];
  const completeData: any[] = [];

  snapshot.docs.forEach((docSnap) => {
    const user = docSnap.data();
    data.push({ ...user, id: docSnap.id });
    completeData.push({ ...user, id: docSnap.id });
  });

  callback({
    data,
    completeData,
  });
};

// ✅ Subscribe users without callback
export const subscribeUsersWithoutCallBack = async () => {
  const snapshot = await getDocs(usersRef);
  const data: any[] = [];
  const completeData: any[] = [];

  snapshot.docs.forEach((docSnap) => {
    const user = docSnap.data();
    data.push({ ...user, id: docSnap.id });
    completeData.push({ ...user, id: docSnap.id });
  });

  return {
    data,
    completeData,
  };
};

// ✅ Get all users except current
export const getAllUserList = async (email: string) => {
  const userList: any[] = [];
  const q = query(collection(db, "users"), orderBy("name"));
  const res = await getDocs(q);

  res.docs.forEach((item) => {
    if (item.data()?.email !== email) {
      userList.push(item.data());
    }
  });

  return userList;
};

// ✅ Subscribe to current user
export const subscribeCurrentUser = (
  userId: string,
  callback: (doc: any) => void
) => {
  if (!userId) return;

  const q = query(usersRef, where("id", "==", userId));
  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (querySnapshot) => {
      const docs = querySnapshot.docs;
      if (docs.length > 0) {
        callback(docs[0].data());
      }
    }
  );
};
