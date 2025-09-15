import React, {FC, ReactNode} from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {verticalScale} from '../../../Constant/Metrics';
import {useStylesheet} from 'react-native-dex-moblibs';

interface Props {
  height?: number;
  children: ReactNode;
}

const HeaderContainer: FC<Props> = ({height = verticalScale(75), children}) => {
  const {theme} = useStylesheet();
  return (
    <ImageBackground
      source={require('../../../Assets/Images/background.jpg')}
      style={[styles.container, {height, backgroundColor: theme.colors.background}]}>
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HeaderContainer;
