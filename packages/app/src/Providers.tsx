import React from 'react';
import { RelayEnvironmentProvider } from 'relay-hooks';
import WalletConnectProvider from 'react-native-walletconnect';

import { SafeAreaProvider } from 'react-native-safe-area-context';
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
