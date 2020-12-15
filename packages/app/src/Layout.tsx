import React from 'react';
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

const Layout = ({ children }): React.ReactElement => (
  <Swiper
      horizontal={false} 
      showsPagination={false}
      loop={false}
      index={1}
    >
      <SafeAreaView>
        <Text>Top</Text>
      </SafeAreaView>

      {children}
    </Swiper>
)

export default Layout;