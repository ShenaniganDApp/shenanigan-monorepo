import AsyncStorage from '@react-native-community/async-storage';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RelayEnvironmentProvider } from 'react-relay';

import { App } from './App';
import {
    Web3ContextProvider,
    TabNavigationContextProvider,
    SwiperContextProvider
} from './contexts';
import Environment from './relay/Environment';

export const Providers = (): React.ReactElement => {
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
                    <TabNavigationContextProvider>
                        <SwiperContextProvider>
                            <SafeAreaProvider>
                                <App />
                            </SafeAreaProvider>
                        </SwiperContextProvider>
                    </TabNavigationContextProvider>
                </Web3ContextProvider>
            </WalletConnectProvider>
        </RelayEnvironmentProvider>
    );
};
