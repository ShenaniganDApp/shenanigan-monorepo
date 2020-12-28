import React from 'react';
import Swiper from 'react-native-swiper';

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
      {children}
    </Swiper>
)

export default Layout;