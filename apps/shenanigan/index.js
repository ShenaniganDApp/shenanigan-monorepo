import 'expo-dev-client';
import './shim.js';
import 'react-native-gesture-handler';
import { AppRegistry, YellowBox } from 'react-native';

import { name as appName } from './app.json';
import { Root } from './src/Root';

AppRegistry.registerComponent(appName, () => Root);

YellowBox.ignoreWarnings(['Setting a timer']);

// eslint-disable-next-line import/no-default-export
export { default } from './storybook';
