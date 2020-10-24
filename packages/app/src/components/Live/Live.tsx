import React, { useRef, useState } from 'react';
import { Component } from 'react';
import {
    View,
    Text,
    Linking,
    Alert,
    Button,
    PermissionsAndroid
} from 'react-native';
import { LiveTabsProps as Props } from '../../Navigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NodePlayerView } from 'react-native-nodemediaclient';
import { Address } from '../Web3';

export default function Live(props: Props) {
    const { address, mainnetProvider } = props.route.params;
    const vp = useRef(null);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#d2ffff' }}>
            <Address value={address} ensProvider={mainnetProvider} clickable />
            <NodePlayerView
                style={{ flex: 1, backgroundColor: '#333' }}
                ref={vp}
                inputUrl={''}
                scaleMode={'ScaleAspectFill'}
                bufferTime={300}
                maxBufferTime={1000}
                autoplay={true}
                onStatus={(code, msg) => {
                    console.log('onStatus=' + code + ' msg=' + msg);
                }}
            />
        </SafeAreaView>
    );
}
