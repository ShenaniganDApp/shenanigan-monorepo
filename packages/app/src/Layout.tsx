import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import WalletModal from "./components/Web3/Web3Modal"

type Props = {
  children?:
    | React.ReactChild
    | React.ReactChild[];
};

const Layout = ({ children }: Props): React.ReactElement => (
  <Swiper
      horizontal={false} 
      showsPagination={false}
      loop={false}
      index={1}
    >
      <SafeAreaView>
        <WalletModal/>
      </SafeAreaView>

      {children}
    </Swiper>
)

export default Layout;