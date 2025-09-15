import React from 'react';
import {TouchableOpacity} from 'react-native';
import {VectorIcon, useStylesheet} from 'react-native-dex-moblibs';

export const BackButton = ({onPress}: {onPress: () => void}) => {
  const {theme} = useStylesheet();
  return (
    <TouchableOpacity onPress={onPress}>
      <VectorIcon
        type="FontAwesome"
        name="angle-left"
        size={40}
        color={theme.colors.text}
      />
    </TouchableOpacity>
  );
};
