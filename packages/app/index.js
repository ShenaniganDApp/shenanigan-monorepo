import 'react-native-gesture-handler';
import './globals';

import _ from 'lodash';
import { AppRegistry, YellowBox } from 'react-native';

import { name as appName } from './app.json';
import { Providers } from './src/Providers';

AppRegistry.registerComponent(appName, () => Providers);

YellowBox.ignoreWarnings(['Setting a timer']);
const clonedConsole = _.clone(console);
console.warn = (message) => {
    if (message.indexOf('Setting a timer') <= -1) {
        clonedConsole.warn(message);
    }
};
