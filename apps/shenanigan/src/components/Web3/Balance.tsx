import { BigNumber, ethers, providers } from 'ethers';
import React, { useState } from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { usePoller } from '../../hooks';

type Props = {
    address?: string | null;
    provider: providers.JsonRpcProvider;
    dollarMultiplier: number;
    balance?: BigNumber;
    pollTime?: number;
    size?: number;
};

export default function Balance({
    address,
    provider,
    pollTime,
    balance: balanceProp,
    dollarMultiplier,
    size
}: Props) {
    const [dollarMode, setDollarMode] = useState(true);
    const [balance, setBalance] = useState<BigNumber>();

    const getBalance = async () => {
        if (address && provider) {
            try {
                const newBalance = await provider.getBalance(address);
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
        pollTime ? pollTime : 1999
    );

    let floatBalance = parseFloat('0.00');

    let usingBalance = balance;

    if (typeof balanceProp !== 'undefined') {
        usingBalance = balanceProp;
    }

    if (usingBalance) {
        const etherBalance = ethers.utils.formatEther(usingBalance);
        parseFloat(etherBalance).toFixed(2);
        floatBalance = parseFloat(etherBalance);
    }

    let displayBalance = floatBalance.toFixed(4);

    if (dollarMultiplier && dollarMode) {
        displayBalance = `$${(floatBalance * dollarMultiplier).toFixed(2)}`;
    }

    return (
        <TouchableOpacity onPress={() => setDollarMode(!dollarMode)}>
            <Text
                style={{
                    fontSize: size ? size : 24,
                    fontWeight: 'bold'
                }}
            >
                {displayBalance}
            </Text>
        </TouchableOpacity>
    );
}
