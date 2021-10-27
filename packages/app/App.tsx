import AsyncStorage from '@react-native-async-storage/async-storage';
import WalletConnectProvider, {
  useWalletConnect,
} from '@walletconnect/react-native-dapp';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export function App() {
  return (
    <WalletConnectProvider
      bridge="https://bridge.walletconnect.org"
      clientMeta={{
        description: 'Shenanigan Developer App',
        uri: 'https://she.energy',
        name: 'Shenanigan',
      }}
      storageOptions={{
        asyncStorage: AsyncStorage,
      }}
    >
      <View style={styles.container}>
        <Connect />
      </View>
    </WalletConnectProvider>
  );
}

const Connect = () => {
  const connector = useWalletConnect();
  if (!connector.connected) {
    /**
     *  Connect! 🎉
     */
    return <Button title="Connect" onPress={() => connector.connect()} />;
  }
  return (
    <Button title="Kill Session" onPress={() => connector.killSession()} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
