import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WalletConnectProvider from 'react-native-walletconnect';
import { RelayEnvironmentProvider } from 'relay-hooks';

import App from './App';
import Environment from './relay/Environment';

const Providers = () => {
    return (
        <RelayEnvironmentProvider environment={Environment}>
            <WalletConnectProvider>
                <SafeAreaProvider>
                    <App />
                </SafeAreaProvider>
            </WalletConnectProvider>
        </RelayEnvironmentProvider>
    );
};

export default Providers;
