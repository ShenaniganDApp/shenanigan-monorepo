/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
import AsyncStorage from '@react-native-community/async-storage';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import React, { useEffect, useState } from 'react';
import DevMenu from 'react-native-dev-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RelayEnvironmentProvider } from 'react-relay';

import Storybook from '../storybook';
import { App } from './App';
import { Web3ContextProvider } from './contexts';
import Environment from './relay/Environment';

const Root: React.FC = () => {
    const [storybookActive, setStorybookActive] = useState(false);
    const toggleStorybook = () => setStorybookActive((active) => !active);

    useEffect(() => {
        if (__DEV__) {
            DevMenu.addItem('Toggle Storybook', toggleStorybook);
            toggleStorybook();
        }
    }, []);

    return (
        <RelayEnvironmentProvider environment={Environment}>
            <WalletConnectProvider
                bridge="https://bridge.walletconnect.org"
                clientMeta={{
                    description: 'Shenanigan Developer App',
                    url: 'https://she.energy',
                    name: 'Shenanigan'
                }}
                storageOptions={{
                    asyncStorage: AsyncStorage
                }}
            >
                <Web3ContextProvider>
                    <SafeAreaProvider>
                        {storybookActive ? <Storybook /> : <App />}
                    </SafeAreaProvider>
                </Web3ContextProvider>
            </WalletConnectProvider>
        </RelayEnvironmentProvider>
    );
};

export { Root };
