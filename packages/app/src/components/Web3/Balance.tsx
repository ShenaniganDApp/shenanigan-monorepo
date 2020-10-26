import { BigNumber, ethers, providers } from 'ethers';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { usePoller } from '../../hooks';

type Props = {
    address?: string;
    provider: providers.JsonRpcProvider;
    dollarMultiplier: number;
    balance?: BigNumber;
    pollTime?: number;
    size?: number;
};

export default function Balance(props: Props) {
    const [dollarMode, setDollarMode] = useState(true);
    const [balance, setBalance] = useState<BigNumber>();

    const getBalance = async () => {
        if (props.address && props.provider) {
            try {
                const newBalance = await props.provider.getBalance(
                    props.address
                );
                setBalance(newBalance);
            } catch (e) {
                console.log(e);
            }
        }
    };

    usePoller(
        () => {
            getBalance();
        },
        props.pollTime ? props.pollTime : 1999
    );

    let floatBalance = parseFloat('0.00');

    let usingBalance = balance;

    if (typeof props.balance !== 'undefined') {
        usingBalance = props.balance;
    }

    if (usingBalance) {
        const etherBalance = ethers.utils.formatEther(usingBalance);
        parseFloat(etherBalance).toFixed(2);
        floatBalance = parseFloat(etherBalance);
    }

    let displayBalance = floatBalance.toFixed(4);

    if (props.dollarMultiplier && dollarMode) {
        displayBalance = `$${(floatBalance * props.dollarMultiplier).toFixed(
            2
        )}`;
    }

    return (
        <TouchableOpacity
            style={{
                padding: 8
            }}
            onPress={() => {
                setDollarMode(!dollarMode);
            }}
        >
            <Text
                style={{
                    fontSize: props.size ? props.size : 24
                }}
            >
                {displayBalance}
            </Text>
        </TouchableOpacity>
    );
}
