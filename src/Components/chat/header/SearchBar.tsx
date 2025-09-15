import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {BackButton} from './back-arrow';
import {useStylesheet} from 'react-native-dex-moblibs';

export const SearchBar = ({
  value,
  onChange,
  onBack,
}: {
  value?: string;
  onChange: (txt: string) => void;
  onBack: () => void;
}) => {
  const {theme} = useStylesheet();
  return (
    <View style={[styles.wrapper, {backgroundColor: theme.colors.background, borderColor: theme.colors.text}]}>
      <BackButton onPress={onBack} />
      <TextInput
        value={value}
        placeholder="Enter the search"
        placeholderTextColor={theme.colors.text}
        style={{color: theme.colors.text, flex: 1, marginLeft: 10}}
        autoFocus
        onChangeText={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    margin: 10,
    borderWidth: 2,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
