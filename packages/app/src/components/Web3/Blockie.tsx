import React from 'react';
import { Text, View } from 'react-native';
import Blockies from 'react-native-blockies-svg';

type Props = { address: string };
export default function Blockie(props: Props) {
    if (!props.address || typeof props.address.toLowerCase !== 'function') {
        return <Text />;
    }
    return (
        <View style={{ transform: [{ rotate: '90deg' }] }}>
            <Blockies seed={props.address.toLowerCase()} {...props} />
        </View>
    );
}
