import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'react-native-dex-moblibs';
import { themeData } from '../redux/themeSlice';
import { darkTheme, lightTheme } from './theme/theme-configuration';

export const ThemeProviderWrapper = ({ children }: React.PropsWithChildren) => {
  const themeDetail = useSelector(themeData);

  return (
    
    <ThemeProvider
      theme={{
        light: {
          ...lightTheme,
          typography: themeDetail.typography,
        },
        dark: {
          ...darkTheme,
          typography: themeDetail.typography,
        },
      }}
    >
      {children}
    </ThemeProvider>
  );
};
