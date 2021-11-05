// if you use expo remove this line
import './rn-addons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { withKnobs } from '@storybook/addon-knobs';
import {
    addDecorator,
    configure,
    getStorybookUI
} from '@storybook/react-native';
import { AppRegistry } from 'react-native';

import { name as appName } from '../app.json';
import { loadStories } from './storyLoader';

// enables knobs for all stories
addDecorator(withKnobs);

// import stories
configure(() => {
    loadStories();
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({
    asyncStorage: AsyncStorage
});

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you should remove this line.
AppRegistry.registerComponent(appName, () => StorybookUIRoot);

// eslint-disable-next-line import/no-default-export
export { StorybookUIRoot as default };
