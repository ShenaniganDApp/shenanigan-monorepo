/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState } from 'react';
import DevMenu from 'react-native-dev-menu';

import Storybook from '../storybook';
import { Providers } from './Providers';

const Root: React.FC = () => {
    const [storybookActive, setStorybookActive] = useState(false);
    const toggleStorybook = () => setStorybookActive(active => !active);

    useEffect(() => {
        console.log('sdFSFSDFSDFDS');
        if (__DEV__) {
            console.log('SDFSDFSDFDS');
            DevMenu.addItem('Toggle Storybook', toggleStorybook);
            toggleStorybook();
        }
    }, []);

    useEffect(() => {
        console.log(storybookActive, __DEV__);
    }, [storybookActive]);

    return storybookActive ? <Storybook /> : <Providers />;
};

export { Root };
