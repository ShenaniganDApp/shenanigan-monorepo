import * as React from 'react';
import { Component } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default class Poll extends Component {
    // static navigationOptions = {
    //   drawerLockMode: 'PollMenu'
    // };
    render() {
        return (
            <SafeAreaView>
                <Text>Poll</Text>
            </SafeAreaView>
        );
    }
}
