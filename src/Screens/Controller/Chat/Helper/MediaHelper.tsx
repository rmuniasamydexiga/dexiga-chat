import * as RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import storage from '@react-native-firebase/storage';
import {showLog} from '../../../../Helper/common';
import {
  FILE_PATH,
  IS_ANDROID,
  IS_IOS,
  MESSAGE_TYPE,
} from '../../../../Constant/Constant';
import {FFmpegKit} from 'ffmpeg-kit-react-native';

export const isUrlValid = (userInput: string) => {
  return userInput && userInput.startsWith('http');
};

export const isGetImage = (imagePath: string) => {
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(imagePath);
};

export const getFileUrlForInternal = (item: any) => {
  let result = '';
  if (item && item.url.startsWith('file')) {
    result = item.url;
  } else {
    let path = getFilePathForOsBased(null);
    let fileConcat = getFileConcat();
    result = `${fileConcat}${path}/${item.fileName}`;
  }

  return result;
};

export const getFileUrlForInternalReceiver = (item: any) => {
  let result = '';
  if (item && item.url.startsWith('file')) {
    result = item.url;
  } else {
    let fileName = getFileName(item);
    let path = getFilePathForOsBased(null);
    let fileConcat = getFileConcat();

    result = `${fileConcat}${path}/${fileName}`;
  }
  return result;
};

export const checkFileOrDirectoryExists = (fileList: any, item: any) => {
  try {
    let fileName = getFileName(item);
    // console.log('File List--', fileList);
    console.log('getFileName--', fileName);
    if (fileList) {
      let exists = fileList.findIndex(
        (ele: {name: string}) => ele.name === fileName,
      );
      return exists === -1;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const readFileNameMedia = async () => {
  try {
    let readFile = await RNFS.readDir(RNFS.PicturesDirectoryPath);

    return readFile;
  } catch (error) {
    console.error('Error checking file or directory existence1:', error);
    return [];
  }
};

export const readFileName = async () => {
  try {
    let readFile = await RNFS.readDir(RNFS.LibraryDirectoryPath);
    let readFile1 = await RNFS.readDir(RNFS.DocumentDirectoryPath);
    return readFile.concat(readFile1);
  } catch (error) {
    console.error('Error checking file or directory existence1:', error);
    return [];
  }
};

export const readInternalFileName = async () => {
  try {
    let path = getFilePathForOsBased(FILE_PATH.PICTURE_DIRECTORY);
    let readFile = await RNFS.readDir(path);

    return readFile;
  } catch (error) {
    console.error('Error checking file or directory existence:', error);
    return [];
  }
};

export const directoryTOSaveFile = async (data: any) => {
  let fileName = data.fileName;
  let path = getFilePathForOsBased(FILE_PATH.DEFAULT);
  let destinationPath = `${path}/${fileName}`;
  if (data.source) {
    fileName = data.fileName; // Choose a file name
    destinationPath = `${path}/${fileName}`;
  } else {
    showLog('No image selected to save.', null);
    return true;
  }
  try {
    await RNFS.copyFile(data.source, destinationPath);
  } catch (error) {
    console.error('Error saving image:', error);
  }
};

export const directoryTOSaveFileInternal = async (data: {
  url: string;
  source: any;
  messageType: string;
  fileName: any;
}) => {
  try {
    let FILE_URL = '';
    if (data?.url?.startsWith('http')) {
      FILE_URL = data?.url;
    } else {
      FILE_URL = await storage().ref(data.url).getDownloadURL();
    }
    if (!FILE_URL) {
      showLog('Invalid URL', null);
      return;
    }
    if (IS_IOS && data?.messageType === MESSAGE_TYPE.VIDEO) {
      await downloadAndConvertVideo(FILE_URL, data);
      return true;
    } else {
      const RootDir = getFilePathForOsBased(FILE_PATH.PICTURE_DIRECTORY);
      // const RootDir = RNFS.PicturesDirectoryPath;
      let fileNames = getFileName(data);
      const filePath = `${RootDir}/${fileNames}`;
      showLog('DownLoadStart', 'Download started FILE_URL' + FILE_URL);
      const options = {
        fromUrl: FILE_URL,
        toFile: filePath,
        background: true, // (optional) download in the background
        discretionary: true, // (optional) allow the OS to control the timing of the download
        progressDivider: 1, // (optional) controls the interval at which the progress callback is called
        begin: (res: any) => {
          showLog('DownLoadStart', 'Download started' + filePath);
        },
      };
      const download = RNFS.downloadFile(options);
      return download.promise
        .then(response => {
          showLog('response:', response);

          if (response.statusCode === 200) {
            return true;
          } else {
            return false;
          }
        })
        .catch(error => {
          showLog('Download error:', error);
          return false;
        });
    }
  } catch (e) {
    console.log('error===>', e);
  }
};
export const directoryTOSaveDocumentFileInternal = async (data: {
  url: string;
  source: any;
  fileName: any;
}) => {
  const FILE_URL = data?.url;
  if (!FILE_URL) {
    showLog('Error', 'Invalid URL');
    return;
  }

  const RootDir = getFilePathForOsBased(FILE_PATH.DEFAULT);
  const filePath = `${RootDir}/${data?.fileName}`;
  const options = {
    fromUrl: FILE_URL,
    toFile: filePath,
    background: true, // (optional) download in the background
    discretionary: true, // (optional) allow the OS to control the timing of the download
    progressDivider: 1, // (optional) controls the interval at which the progress callback is called
    begin: (res: any) => {
      showLog('DownLoadData', 'Download starteds');
    },
  };

  const download = RNFS.downloadFile(options);
  return download.promise
    .then(response => {
      showLog('responseresponse', response);
      if (response.statusCode === 200) {
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      showLog('Download error:', error);
      return false;
    });
};

export const downloadFile = (data: {url: any; fileName: string}) => {
  let FILE_URL = data?.url;
  const {config, fs} = RNFetchBlob;
  let fileName = getFileName(data);
  let RootDir = IS_IOS ? fs.dirs.DocumentDir : fs.dirs.PictureDir;
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      path: RootDir + '/' + fileName, // Specify the custom file name here
      description: 'Downloading file...',
      notification: true,
      useDownloadManager: true,
    },
  };

  let result = config(options)
    .fetch('GET', FILE_URL)
    .then(res => {
      if (IS_IOS) {
        RNFetchBlob.fs.writeFile(RootDir + '/' + fileName, res.data);
      }
      return true;
    });
  return true;
};

export const getFileViewer = async (data: any) => {
  let path = getFilePathForOsBased(null);
  let result = FileViewer.open(`${path}/${data?.fileName}`) // absolute-path-to-my-local-file.
    .then(() => {});
};

export const getFileNameJoin = (data: any) => {
  let path = getFilePathForOsBased(FILE_PATH.DEFAULT);
  let fileNames = getFileName(data);
  return `${path}/${fileNames}`;
};

export const picturePathSelectedBaseOnPlotform = () => {
  return getFilePathForOsBased(null);
  // IS_IOS ? RNFS.LibraryDirectoryPath : RNFS.PicturesDirectoryPath
};

export const getFilePathForOsBased = (type: any) => {
  if (type === FILE_PATH.DEFAULT) {
    return IS_IOS ? RNFS.DocumentDirectoryPath : RNFS.DocumentDirectoryPath;
  } else if (type === FILE_PATH.PICTURE_DIRECTORY) {
    return IS_IOS ? RNFS.LibraryDirectoryPath : RNFS.PicturesDirectoryPath;
  } else {
    return RNFS.DocumentDirectoryPath;
  }
};
export const getFileName = (data: any) => {
  let fileNames = '';
  // console.log('Filename--', data);
  let splitName = data?.fileName.split('.')[0];
  if (data?.messageType === MESSAGE_TYPE.AUDIO) {
    fileNames = IS_IOS ? splitName + `.m4a` : splitName + `.mp3`;
  } else if (data?.messageType === MESSAGE_TYPE.VIDEO) {
    fileNames = IS_IOS ? splitName + `.mov` : splitName + `.mp4`;
  } else if (data?.messageType === MESSAGE_TYPE.IMAGE) {
    fileNames = IS_IOS ? splitName + `.jpg` : splitName + `.jpg`;
  } else {
    fileNames = data?.fileName;
  }
  return fileNames;
};

export const getFileConcat = () => {
  return IS_IOS ? 'file://' : 'file:';
};

const downloadAndConvertVideo = async (FILE_URL: string, data: any) => {
  try {
    // Define the path to save the video file
    const dirs = RNFetchBlob.fs.dirs;

    let splitName = data?.fileName.split('.')[0];
    const mp4FilePath = `${dirs.DocumentDir}/${splitName}.mp4`;

    // Download the video file
    await RNFetchBlob.config({
      path: mp4FilePath,
      appendExt: 'mp4', // Append file extension if not provided in FILE_URL
      indicator: true, // Show download progress indicator
      overwrite: true, // Don't overwrite existing files
    }).fetch('GET', FILE_URL);

    // Convert MP4 to MOV
    const movFilePath = `${dirs.DocumentDir}/${splitName}.mov`;
    await FFmpegKit.executeAsync(`-i ${mp4FilePath} ${movFilePath}`);

    console.log('Downloading, converting, and saving video completed.');

    return true;
  } catch (error) {
    console.error('Error downloading, converting, and saving video:', error);
    return false;
  }
};

// const downloadAndConvertVideo = async (FILE_URL:string) => {
//   try {

//     const response = await fetch(FILE_URL);
//     const blob :any= await response.blob();
//     const mp4FilePath = `${RNFetchBlob.fs.dirs.DocumentDir}/video.mp4`;
//     const base64Data = await RNFetchBlob.fs.readFile(blob, 'base64');

//     // Save MP4 file
//     await RNFetchBlob.fs.writeFile(mp4FilePath, base64Data, 'base64');

//     // Convert MP4 to MOV
//     const movFilePath = `${RNFetchBlob.fs.dirs.DocumentDir}/video11.mov`;
//     await FFmpegKit.executeAsync(`-i ${mp4FilePath} ${movFilePath}`);
//     console.error('downloading, converting, and saving video:');

// return true
//   } catch (error) {

//     console.error('Error downloading, converting, and saving video:', error);
//   }
// };
