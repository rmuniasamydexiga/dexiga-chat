import React, {FC} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import HeaderContainer from './header-container';
import {SearchBar} from './SearchBar';
import {VectorIcon, useStylesheet} from 'react-native-dex-moblibs';
import {PopupMenu} from '../../Menu/Menu';

interface Props {
  variant?: 'one' | 'four' | 'five';
  title: string;
  subTitle?: string;
  showTextInput?: boolean;
  searchValue?: string;
  menuVisible: boolean;
  menuList: any[];
  onPressBack?: () => void;
  onSearch?: () => void;
  onSearchText?: (txt: string) => void;
  onMenuToggle?: () => void;
  onMenuSelect?: (data: string) => void;
  searchPressBack?: () => void;
  isHideDot?: boolean;
  isHideSearch?: boolean;
  onAction?: (type: 'camera' | 'search') => void;

}

const ChatHeader: FC<Props> = ({
  variant = 'one',
  title,
  subTitle,
  showTextInput,
  searchValue,
  menuVisible,
  menuList,
  onPressBack,
  onSearch,
  onSearchText,
  onMenuToggle,
  onMenuSelect,
  searchPressBack,
  isHideDot,
  isHideSearch
}) => {
  const {theme} = useStylesheet();

  if (showTextInput) {
    return (
      <HeaderContainer>
        <SearchBar value={searchValue} onChange={onSearchText ?? (() => {})} onBack={searchPressBack ?? (() => {})} />
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer height={variant === 'four' ? 100 : 70}>
      {variant === 'one' && (
        <>
          <TouchableOpacity onPress={onPressBack}>
            <VectorIcon name="angle-left" type="FontAwesome" size={40} color={theme.colors.white} />
          </TouchableOpacity>
          <Image source={require('../../../Assets/Images/user.png')} style={{height: 45, width: 45, borderRadius: 22.5, marginHorizontal: 8}} />
          <Text style={{flex: 1, fontSize: theme.typography.title, fontFamily: theme.fonts.bold, color: theme.colors.text}}>
            {title}
          </Text>
        </>
      )}

      {variant === 'five' && (
        <>
    {showTextInput ? (
      <SearchBar
        value={searchValue}
        onChange={onSearchText ?? (() => {})}
        onBack={searchPressBack ?? (() => {})}
      />
    ) : (
      <>
        <TouchableOpacity onPress={onPressBack}>
          <VectorIcon
            name="angle-left"
            type="FontAwesome"
            size={40}
            color={theme.colors.white}
          />
        </TouchableOpacity>
        <View style={{flex: 1, marginLeft: 10}}>
          <Text
            style={{
              fontSize: theme.typography.subSubTitle,
              fontFamily: theme.fonts.bold,
              color: theme.colors.text,
            }}>
            {title}
          </Text>
          {subTitle ? (
            <Text
              style={{
                fontSize: theme.typography.label,
                fontFamily: theme.fonts.regular,
                color: theme.colors.text,
              }}>
              {subTitle}
            </Text>
          ) : null}
        </View>

        {isHideSearch && (
          <TouchableOpacity onPress={onSearch}>
            <VectorIcon
              name="search"
              type="Feather"
              size={25}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        )}

        {isHideDot && (
          <TouchableOpacity onPress={onMenuToggle}>
            <VectorIcon
                name="dots-three-vertical"
              type="Entypo"
              size={20}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        )}
      </>
    )}
  </>
      )}

      {variant === 'four' && (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: theme.typography.subSubTitle, fontFamily: theme.fonts.bold, color: theme.colors.white, margin: 8}}>
            Dexiga Chat {title}
          </Text>
          <TouchableOpacity onPress={onSearch}>
            <VectorIcon name="search" type="Feather" size={25} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* <TouchableOpacity onPress={onMenuToggle}>
        <VectorIcon                 name="dots-three-vertical"
 type="Entypo" size={20} color={theme.colors.white} />
      </TouchableOpacity>
      <PopupMenu visible={menuVisible} menuList={menuList} hideMenu={onMenuSelect} /> */}
    </HeaderContainer>
  );
};

export default ChatHeader;
