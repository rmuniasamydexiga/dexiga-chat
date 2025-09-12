import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const scale = (size:number, factor:number = 0.5) => size + ( horizontalScale(size) - size ) * factor;
const moderateScale = (size:number, factor = 0.5) => size + (scale(size) - size) * factor;
 const moderateVerticalScale = (size:number, factor = 0.5) => size + (verticalScale(size) - size) * factor;
 
export { horizontalScale, verticalScale, scale ,moderateVerticalScale,moderateScale};



