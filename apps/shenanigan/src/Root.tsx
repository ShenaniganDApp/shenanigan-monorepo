/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
if (__DEV__) {
  import('../ReactotronConfig').then(() =>
    console.log('Reactotron Configured')
  );
}

import React, { useEffect, useState } from 'react';
import DevMenu from 'react-native-dev-menu';

import Storybook from '../storybook';
import { Providers } from './Providers';
import { Text } from 'react-native';

const Root: React.FC = () => {
  const [storybookActive, setStorybookActive] = useState(true);
  const toggleStorybook = () => setStorybookActive((active) => !active);

  useEffect(() => {
    if (__DEV__) {
      DevMenu.addItem('Toggle Storybook', toggleStorybook);
      toggleStorybook();
    }
  }, []);

  useEffect(() => {
    console.log(storybookActive, __DEV__);
  }, [storybookActive]);

  // return storybookActive ? <Storybook /> : <Providers />;
  return <Text>Hello</Text>;
};

export { Root };
