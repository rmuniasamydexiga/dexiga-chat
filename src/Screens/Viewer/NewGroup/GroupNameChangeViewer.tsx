import React from 'react';
import { View, TouchableOpacity, ImageBackground, TextInput, } from 'react-native';
import { GetTheme } from '../../../Constant/Colors';

import HeaderSeven from '../../../Components/Header/HeaderSeven';
import { FONTS } from '../../../Constant/Fonts';
import SelectButton from '../../../Components/Buttons/SelectButton';



interface IGroupChangeViewer {
  updateGroup: () => void
  setgroupName: (data: any) => void
  navigationGoback: () => void
  groupName: string

}

const GroupChangeViewer: React.FC<IGroupChangeViewer> = (props) => {
  const theme = GetTheme()
  const {groupName,updateGroup,setgroupName, navigationGoback,} = props

  return (
    <View style={{ flex: 1, backgroundColor: theme.border }}>
      <HeaderSeven title={'Enter the Group Name'}
        onPress={() => navigationGoback()}
        menuVisible={false}
        menuList={[]}
        subTitle={''}
        onPressMenu={function (data: string): void {
          throw new Error('Function not implemented.');
        }}
        onPressDeleteMessage={function (): void {
          throw new Error('Function not implemented.');
        }} isMediaHeader={false} activeIndex={0} navigationTab={function (indexValue: any): void {
          throw new Error('Function not implemented.');
        }}></HeaderSeven>
      <View style={{ flex: 0.15, margin: 10 }}>
        <TouchableOpacity style={{ flexDirection: 'row' }} >
          <View style={{ flex: 0.15 }}>
            <ImageBackground
              style={{
                width: 45,
                height: 45,
                borderRadius: 45,
              }}
              source={require("../../../Assets/Images/user.png")
              }
              resizeMode="cover"
            />
            
          </View>
          <View style={{ flex: 0.7 }}>
            <TextInput
              value={groupName}
              onChangeText={(text) => setgroupName(text)}
              style={{ borderBottomWidth: 2, borderColor: theme.headerTheme, fontFamily: FONTS.OpenSans_Regular }}
              placeholder={'Enter the Group Name'}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, alignItems: 'center', marginTop: 10, flexDirection: 'row' }}>
        <View style={{ marginHorizontal: 10 }}>
          <SelectButton Text={'OK'} Width={160} ButtonColor={theme.headerTheme} onPress={() => updateGroup()} textColor={theme.WhiteAndBlack} />
        </View>
        <View style={{ marginHorizontal: 10 }}>
          <SelectButton Text={'Cancel'} Width={160} ButtonColor={theme.headerTheme} onPress={() => navigationGoback()} textColor={theme.WhiteAndBlack} />
        </View>
      </View>
    </View>
  );
};

export default GroupChangeViewer;

