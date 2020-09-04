import * as React from 'react';
import { Component } from 'react';
import { View, Text, Linking, Alert, Button } from 'react-native';
import MobileRegistry from '@walletconnect/mobile-registry';
import { MainTabsProps as Props } from '../../Navigator';
import { ethers } from 'ethers';


export default class Live extends Component<Props> {
    constructor(props: Props) {
        super(props);
        console.log('props: ', props);
    }
    state = {};

    render() {
        const { address } = this.props.route.params;
        return (
            <View style={{ flex: 1, backgroundColor: '#d2ffff' }}>
                <Text>Live</Text>
                <Text>accounts: {address}</Text>
            </View>
        );
    }
}
