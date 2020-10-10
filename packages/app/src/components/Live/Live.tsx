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

export default function Live(props: Props) {
    const { address } = props.route.params;
    const vp = useRef(null);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#d2ffff' }}>
        <NodePlayerView
          style={{ flex: 1, backgroundColor: '#333' }}
          ref={vp}
          inputUrl={""}
          scaleMode={"ScaleAspectFill"}
          bufferTime={300}
          maxBufferTime={1000}
          autoplay={true}
          onStatus={(code, msg) => {
            console.log("onStatus=" + code + " msg=" + msg);
          }}
        />
        </SafeAreaView>
    );
}
