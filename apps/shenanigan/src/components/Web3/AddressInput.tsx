import { providers } from 'ethers';
import React, { useEffect, useState } from 'react';
import {
    NativeSyntheticEvent,
    Text,
    TextInput,
    TextInputChangeEventData,
    View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import QRCodeScanner from 'react-native-qrcode-scanner';
import { QrcodeOutlined } from 'react-native-vector-icons';

import { Blockie } from '.';

type Props = {
    autoFocus: boolean;
    ensProvider: providers.InfuraProvider;
    placeholder: string;
    value?: string;
    onChange: (address: string) => void;
};

export default function AddressInput(props: Props) {
    const [ens, setEns] = useState('');
    const [value, setValue] = useState('');

    const currentValue =
        typeof props.value !== 'undefined' ? props.value : value;

    useEffect(() => {
        setEns('');
        if (currentValue && props.ensProvider) {
            async function getEns() {
                let newEns;
                try {
                    console.log('trying reverse ens', newEns);

                    newEns = await props.ensProvider.lookupAddress(
                        currentValue
                    );
                    console.log('setting ens', newEns);
                    setEns(newEns);
                } catch (e) {}
                console.log('checking resolve');
                if (
                    currentValue.indexOf('.eth') > 0 ||
                    currentValue.indexOf('.xyz') > 0
                ) {
                    try {
                        console.log('resolving');
                        const possibleAddress = await props.ensProvider.resolveName(
                            currentValue
                        );
                        console.log('GOT:L', possibleAddress);
                        if (possibleAddress) {
                            setEns(currentValue);
                            props.onChange(possibleAddress);
                        }
                    } catch (e) {}
                }
            }
            getEns();
        }
    }, [props.value]);

    const [scan, setScan] = useState(false);

    const scannerButton = (
        <TouchableOpacity
            style={{ marginTop: 4 }}
            onPress={() => {
                setScan(!scan);
            }}
        >
            <QrcodeOutlined style={{ fontSize: 18 }} />
            <Text>Scan</Text>
        </TouchableOpacity>
    );

    const updateAddress = async (newValue: string | undefined) => {
        if (typeof newValue !== 'undefined') {
            let address = newValue;
            if (address.indexOf('.eth') > 0 || address.indexOf('.xyz') > 0) {
                try {
                    const possibleAddress = await props.ensProvider.resolveName(
                        address
                    );
                    if (possibleAddress) {
                        address = possibleAddress;
                    }
                } catch (e) {}
            }
            setValue(address);
            if (typeof props.onChange === 'function') {
                props.onChange(address);
            }
        }
    };

    let scanner = <></>;
    if (scan) {
        scanner = (
            <TouchableOpacity
                style={{
                    zIndex: 256,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%'
                }}
                onPress={() => {
                    setScan(!scan);
                }}
            >
                {/* <QRCodeScanner
                    delay={250}
                    resolution={1200}
                    onError={e => {
                        console.log('SCAN ERROR', e);
                        setScan(!scan);
                    }}
                    onRead={(newValue: string) => {
                        if (newValue) {
                            console.log('SCAN VALUE', newValue);
                            let possibleNewValue = newValue;
                            if (possibleNewValue.indexOf('/') >= 0) {
                                possibleNewValue = possibleNewValue.substr(
                                    possibleNewValue.lastIndexOf('0x')
                                );
                                console.log('CLEANED VALUE', possibleNewValue);
                            }
                            setScan(!scan);
                            updateAddress(possibleNewValue);
                        }
                    }}
                    style={{ width: '100%' }}
                /> */}
            </TouchableOpacity>
        );
    }

    return (
        <View>
            {scanner}
            <Blockie address={currentValue} size={8} scale={3} />
            <TextInput
                autoFocus={props.autoFocus}
                placeholder={props.placeholder ? props.placeholder : 'address'}
                value={ens || currentValue}
                onChange={async (
                    e: NativeSyntheticEvent<TextInputChangeEventData>
                ) => {
                    updateAddress(e.nativeEvent.text);
                }}
            />
            {scannerButton}
        </View>
    );
}
