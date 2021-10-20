import { providers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Blockies from './Blockie';
import {
    TouchableHighlight,
    TouchableOpacity
} from 'react-native-gesture-handler';
import { colors, Card, sizes } from '../UI';

type Props = {
    value: string;
    ensProvider: providers.EnsProvider;
    size?: string;
    clickable?: boolean;
    minimized?: boolean;
    blockExplorer?: string;
    onChange?: (value: string) => void;
    toggleConnect?: () => void;
    connectTitle?: string;
    isConnected?: boolean;
};

export default function Address(props: Props) {
    const [ens, setEns] = useState('');
    useEffect(() => {
        if (props.value && props.ensProvider) {
            async function getEns() {
                let newEns;
                try {
                    // console.log("getting ens",newEns)
                    newEns = await props.ensProvider.lookupAddress(props.value);
                    setEns(newEns);
                } catch (e) {}
            }
            getEns();
        }
    }, [props.value, props.ensProvider]);

    let displayAddress = props.value.substr(0, 6);

    if (ens) {
        displayAddress = ens;
    } else if (props.size === 'short') {
        displayAddress += `...${props.value.substr(-4)}`;
    } else if (props.size === 'long') {
        displayAddress = props.value;
    }

    let blockExplorer = 'https://blockscout.com/poa/xdai/address/';
    if (props.blockExplorer) {
        blockExplorer = props.blockExplorer;
    }

    let clickable = true;
    if (props.clickable == false) {
        clickable = props.clickable;
    }

    if (props.minimized) {
        return (
            <View>
                {clickable ? (
                    <TouchableHighlight
                        onPress={() =>
                            Linking.openURL(blockExplorer + props.value)
                        }
                    >
                        <Blockies
                            seed={props.value.toLowerCase()}
                            size={12}
                            scale={2}
                        />
                    </TouchableHighlight>
                ) : (
                    <Blockies
                        seed={props.value.toLowerCase()}
                        size={12}
                        scale={2}
                    />
                )}
            </View>
        );
    }

    let text;
    if (props.onChange) {
        text = (
            <Text>
                {clickable ? (
                    <TouchableHighlight
                        onPress={() =>
                            Linking.openURL(blockExplorer + props.value)
                        }
                    >
                        <Text>{displayAddress}</Text>
                    </TouchableHighlight>
                ) : (
                    <Text>{displayAddress}</Text>
                )}
            </Text>
        );
    } else {
        text = clickable ? (
            <Text
                style={{ color: '#222222' }}
                onPress={() => Linking.openURL(blockExplorer + props.value)}
            >
                {displayAddress}
            </Text>
        ) : (
            <Text>{displayAddress}</Text>
        );
    }

    return (
        <View>
            <Card>
                <View style={styles.inner}>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <Blockies
                            address={props.value.toLowerCase()}
                            size={12}
                            scale={4}
                        />
                        <View
                            style={{
                                ...styles.dot,
                                backgroundColor: props.isConnected
                                    ? colors.green
                                    : colors.pink
                            }}
                        />
                    </View>

                    <Text style={styles.text}>{text}</Text>
                </View>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    inner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.gray,
        textAlign: 'center',
        flex: 1
    },
    dot: {
        height: 18,
        width: 18,
        borderRadius: 9,
        marginHorizontal: sizes.containerPadding
    }
});
