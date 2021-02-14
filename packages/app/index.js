import 'react-native-gesture-handler';
import './globals';
import '@ethersproject/shims';
import { YellowBox } from 'react-native';
import _ from 'lodash';

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import { Providers } from './src/Providers';

AppRegistry.registerComponent(appName, () => Providers);

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = (message) => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};
