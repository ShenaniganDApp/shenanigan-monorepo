import React, { useState, useEffect } from 'react';
import Blockies from 'react-native-blockies-svg';
import { Text, View, Linking, StyleSheet } from 'react-native';
import { providers } from 'ethers';
import { TouchableHighlight } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    addressWrapper: { flexDirection: 'row' }
});

type Props = {
    value: string;
    ensProvider: providers.EnsProvider;
    size?: string;
    clickable?: boolean;
    minimized?: boolean;
    blockExplorer?: string;
    onChange?: (value: string) => void;
};

export default function Address(props: Props) {
    const [ens, setEns] = useState('');
    useEffect(() => {
        if (props.value && props.ensProvider) {
            async function getEns() {
                let newEns;
                try {
                    //console.log("getting ens",newEns)
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
        displayAddress += '...' + props.value.substr(-4);
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
                            size={8}
                            scale={2}
                        />
                    </TouchableHighlight>
                ) : (
                    <Blockies
                        seed={props.value.toLowerCase()}
                        size={8}
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
        <View style={styles.addressWrapper}>
            <Blockies seed={props.value.toLowerCase()} size={8} scale={4} />

            <View
                style={{
                    paddingLeft: 5
                }}
            >
                <Text
                    style={{
                        fontSize: 28
                    }}
                >
                    {text}
                </Text>
            </View>
        </View>
    );
}
