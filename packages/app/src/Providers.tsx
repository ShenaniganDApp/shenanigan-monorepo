import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RelayEnvironmentProvider } from 'relay-hooks';

import { App } from './App';
import { Web3ContextProvider } from './contexts';
import { TabSwipeContextProvider } from './contexts';
import Environment from './relay/Environment';

export const Providers = (): React.ReactElement => {
    return (
        <RelayEnvironmentProvider environment={Environment}>
            <Web3ContextProvider>
                <TabSwipeContextProvider>
                    <SafeAreaProvider>
                        <App />
                    </SafeAreaProvider>
                </TabSwipeContextProvider>
            </Web3ContextProvider>
        </RelayEnvironmentProvider>
    );
};
