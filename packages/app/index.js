import 'react-native-gesture-handler';
import './globals';
import '@ethersproject/shims';

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import { Providers } from './src/Providers';

AppRegistry.registerComponent(appName, () => Providers);
