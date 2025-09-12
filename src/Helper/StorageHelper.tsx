import AsyncStorage from '@react-native-async-storage/async-storage';

import { showLog } from './common';

const setData = async (USER_KEY: string, value: string) => {
    try {

    await AsyncStorage.setItem(USER_KEY, value);
   
        return true
    } catch (e) {
        showLog('exeecption', e)
    }
};

const getData = async (USER_KEY: string) => {
    try {
       let result=  await AsyncStorage.getItem(USER_KEY)
       return result
     
    } catch (e) {
        showLog('exeecption', e)


    }
};
const removeData = async (USER_KEY: string) => {
    await AsyncStorage.removeItem(USER_KEY);
};

const clearAll = async () => {
    await AsyncStorage.clear();
    return true
}

export const STORAGE={
    USERID:'USERID',
    EMAIL:'EMAIL',
    NAME:'NAME',

}

export {
    setData,
    getData,
    removeData,
    clearAll

};
