import { createSlice } from '@reduxjs/toolkit';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { type RootState } from './store';

interface IFontSize {
  smallTitle: number;
  title: number;
  subTitle: number;
  subSubTitle: number;
  label: number;
  superText: number;
  superSuperText: number;
  smallText: number;
  smallText_10: number;
}
interface IThemeInitialState {
  size: number;
  typography: IFontSize;
}

//Guideline sizes are based on standard ~5" screen mobile device
// const guidelineBaseWidth = 350;
// const guidelineBaseHeight = 680;
// const scale = (size: number) => (width / guidelineBaseWidth) * size;

const fontSizeScale = (size: number) => size;
const initialState: IThemeInitialState = {
  size: 1,
  typography: {
    smallTitle: fontSizeScale(5),
    title: hp('2.7'),
    subTitle: hp('2.5'),
    subSubTitle: fontSizeScale(16),
    label: hp('1.8'),
    superText: fontSizeScale(30),
    superSuperText: fontSizeScale(46),
    smallText: hp('1.65'),
    smallText_10: fontSizeScale(8),
  },
};
export const themeSlice = createSlice({
  name: 'themeData',
  initialState: initialState,
  reducers: {
    themeDetails: (state, action) => {
      state.typography = action.payload;
    },
    fontReducer: (state, action) => {
      state.size = action.payload;
    },
  },
});

export const { themeDetails, fontReducer } = themeSlice.actions;
export const themeData = (state: RootState) => state.themeData;

export default themeSlice.reducer;
