import 'react-native-gesture-handler';
import './globals';
import '@ethersproject/shims/dist/index';

import _ from 'lodash';
import { AppRegistry, YellowBox } from 'react-native';

import { name as appName } from './app.json';
import { Root } from './src/Root';

AppRegistry.registerComponent(appName, () => Root);

YellowBox.ignoreWarnings(['Setting a timer']);
const cloneConsole = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        cloneConsole.warn(message);
    }
};

// eslint-disable-next-line import/no-default-export
export { default } from './storybook';
