import React from 'react';
import { RelayEnvironmentProvider } from 'relay-hooks';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from "./App"
import Environment from './relay/Environment';

const Providers = () => {
    return (
        <RelayEnvironmentProvider environment={Environment}>
            <SafeAreaProvider><App/></SafeAreaProvider>
        </RelayEnvironmentProvider>
    );
};

export default Providers;
