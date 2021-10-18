import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
return (<WalletConnectProvider
  bridge="https://bridge.walletconnect.org"
  clientMeta={{
      description: 'Shenanigan Developer App',
      ur'https://she.energy',
      name: 'Shenanigan'
  }}
  storageOptions={{
      asyncStorage: AsyncStorage
  }}
>
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>W
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
