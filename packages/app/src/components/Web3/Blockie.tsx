import React from 'react';
import Blockies from 'react-native-blockies-svg';
import { Text } from 'react-native';

type Props = { address: string };
export default function Blockie(props: Props) {
    if (!props.address || typeof props.address.toLowerCase != 'function') {
        return <Text />;
    }
    return <Blockies seed={props.address.toLowerCase()} {...props} />;
}
