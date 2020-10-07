import React, { useState } from 'react';
import { Component } from 'react';
import { View, Text, Linking, Alert, Button, PermissionsAndroid } from 'react-native';
import { LiveTabsProps as Props } from '../../Navigator';
import { SafeAreaView } from 'react-native-safe-area-context';

type State = {
  
};

export default function Live(props: Props) {
    const { address } = props.route.params;
   
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#d2ffff' }}>
            <Text>Live</Text>
            <Text>accounts: {address}</Text>
        </SafeAreaView>
    );
}
