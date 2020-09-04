
import * as React from 'react';
import { Component } from 'react';
import { View, Text } from 'react-native';

type Props = {};
export class Loading extends Component<Props> {
    state = { loading: true };
    render() {
        return (
            <View>
                <Text>{'Loading'}</Text>
            </View>
        );
    }
}