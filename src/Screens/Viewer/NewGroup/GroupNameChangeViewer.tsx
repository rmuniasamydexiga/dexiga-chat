import React from 'react';
import { View, TouchableOpacity, ImageBackground, TextInput, } from 'react-native';

import HeaderSeven from '../../../Components/Header/HeaderSeven';
import { Button, useStylesheet, wp } from 'react-native-dex-moblibs';



interface IGroupChangeViewer {
  updateGroup: () => void
  setgroupName: (data: any) => void
  navigationGoback: () => void
  groupName: string

}

const GroupChangeViewer: React.FC<IGroupChangeViewer> = (props) => {
  const {theme}=useStylesheet()
  const {groupName,updateGroup,setgroupName, navigationGoback,} = props

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.borderColor }}>
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
              style={{ borderBottomWidth: 2, borderColor: theme.colors.primary, fontFamily: theme.fonts.regular }}
              placeholder={'Enter the Group Name'}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, alignItems: 'center', marginTop: 10, flexDirection: 'row' }}>
        <View style={{ marginHorizontal: 10 }}>
            <Button
                  title={'OK'}
                  style={{ width: wp('90%') }}
                  onPress={updateGroup}
                />
        </View>
        <View style={{ marginHorizontal: 10 }}>
           <Button
                  title={'OK'}
                  style={{ width: wp('90%') }}
                  onPress={navigationGoback}
                />
        </View>
      </View>
    </View>
  );
};

export default GroupChangeViewer;

