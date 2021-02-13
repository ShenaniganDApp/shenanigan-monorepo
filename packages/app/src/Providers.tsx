import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RelayEnvironmentProvider } from 'relay-hooks';

import { App } from './App';
import { Web3ContextProvider } from './contexts';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-community/async-storage';
import Environment from './relay/Environment';

export const Providers = (): React.ReactElement => {
    return (
        <RelayEnvironmentProvider environment={Environment}>
            <WalletConnectProvider
                bridge="https://bridge.walletconnect.org"
                clientMeta={{
                    description: 'Shenanigan Developer App',
                    url: 'https://she.energy',
                    icons: ['https://walletconnect.org/walletconnect-logo.png'],
                    name: 'Shenanigan'
                }}
                storageOptions={{
                    asyncStorage: AsyncStorage
                }}
            >
                <Web3ContextProvider>
                        <SafeAreaProvider>
                            <App />
                        </SafeAreaProvider>
                </Web3ContextProvider>
            </WalletConnectProvider>
        </RelayEnvironmentProvider>
    );
};
