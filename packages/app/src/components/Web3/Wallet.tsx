import { ethers, providers } from 'ethers';
import QR from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Clipboard,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Blockies from 'react-native-blockies-svg';
import Modal from 'react-native-modal';
import { Spin } from 'react-native-vector-icons';

import { Transactor } from '../../helpers';
import { Address, AddressInput, Balance, EtherInput } from '.';

const styles = StyleSheet.create({
    inputStyle: {
        padding: 10
    }
});

type Props = {
    address?: string;
    ensProvider: providers.InfuraProvider;
    provider: providers.JsonRpcProvider;
    price: number;
    color?: string;
};

export default function Wallet(props: Props) {
    const [open, setOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [signer, setSigner] = useState<providers.JsonRpcSigner>();
    const [qr, setQr] = useState('');
    const [pk, setPK] = useState('');
    console.log('props.provider: ', props.provider);
    let providerSend = <></>;

    if (props.provider) {
        providerSend = (
            <Button
                title="Wallet"
                onPress={() => {
                    setOpen(!open);
                }}
                // style={{
                //     padding: 7,
                //     color: props.color ? props.color : '#1890ff',
                //     cursor: 'pointer',
                //     fontSize: 28,
                //     verticalAlign: 'middle'
                // }}
            />
        );
    }

    const [amount, setAmount] = useState<string | number>();
    const [toAddress, setToAddress] = useState<string>();

    useEffect(() => {
        const getAddress = async () => {
            if (props.provider) {
                let loadedSigner;
                try {
                    // console.log("SETTING SIGNER")
                    loadedSigner = props.provider.getSigner();
                    setSigner(loadedSigner);
                } catch (e) {
                    // console.log(e)
                }
                if (props.address) {
                    setSelectedAddress(props.address);
                } else if (!selectedAddress && loadedSigner) {
                    // console.log("GETTING ADDRESS FOR WALLET PROVIDER",loadedSigner)
                    const result = await loadedSigner.getAddress();
                    if (result) {
                        setSelectedAddress(result);
                    }
                }
            }
            // setQr("")
        };
        getAddress();
    }, [props.provider, props.address]);

    let display;
    let receiveButton;
    let privateKeyButton;
    if (qr) {
        display = (
            <View>
                <TouchableOpacity
                    onPress={() => Clipboard.setString(selectedAddress)}
                >
                    <View>
                        <Text>{selectedAddress}</Text>
                    </View>
                </TouchableOpacity>

                <QR
                    value={selectedAddress}
                    size={450}
                    level="H"
                    includeMargin
                    renderAs="svg"
                    imageSettings={{ excavate: false }}
                />
            </View>
        );
        receiveButton = (
            <Button
                key="hide"
                title="Hide"
                onPress={() => {
                    setQr('');
                }}
            />
        );
        privateKeyButton = (
            <Button
                key="hide"
                title="Private Key"
                onPress={() => {
                    setPK(selectedAddress);
                    setQr('');
                }}
            />
        );
    } else if (pk) {
        const pk = localStorage.getItem('metaPrivateKey');
        const wallet = pk ? new ethers.Wallet(pk) : null;

        if (wallet?.address != selectedAddress) {
            display = (
                <View>
                    <Text style={{ fontWeight: 'bold' }}>
                        *injected account*, private key unknown
                    </Text>
                </View>
            );
        } else {
            display = (
                <View>
                    <Text style={{ fontWeight: 'bold' }}>Private Key:</Text>

                    <View>
                        <TouchableOpacity
                            onPress={() => Clipboard.setString(pk as string)}
                        >
                            <View>
                                <Text>{pk}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1
                        }}
                    />

                    <Text style={{ fontStyle: 'italic' }}>
                        Point your camera phone at qr code to open in{' '}
                        <TouchableOpacity
                            onPress={() =>
                                Linking.openURL(`https://xdai.io/${pk}`)
                            }
                        >
                            <Text>burner wallet</Text>
                        </TouchableOpacity>
                        <Text>:</Text>
                    </Text>
                    <QR
                        value={`https://xdai.io/${pk}`}
                        size={450}
                        level="H"
                        includeMargin
                        renderAs="svg"
                        imageSettings={{ excavate: false }}
                    />
                    <TouchableOpacity
                        onPress={() => Clipboard.setString(selectedAddress)}
                    >
                        <View>
                            <Text style={{ fontSize: 16 }}>
                                {`https://xdai.io/${pk}`}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
        receiveButton = (
            <Button
                key="receive"
                title="Receive"
                onPress={() => {
                    setQr(selectedAddress);
                    setPK('');
                }}
            />
        );
        privateKeyButton = (
            <Button
                key="hide"
                title="Hide"
                onPress={() => {
                    setPK('');
                    setQr('');
                }}
            />
        );
    } else {
        display = (
            <View>
                <Text>
                    ⚡ You are on the{' '}
                    <TouchableOpacity
                        onPress={() =>
                            Linking.openURL('https://www.xdaichain.com/')
                        }
                    >
                        <Text>xDai network</Text>
                    </TouchableOpacity>
                    ⚡
                </Text>
                <View style={styles.inputStyle}>
                    <AddressInput
                        autoFocus
                        ensProvider={props.ensProvider}
                        placeholder="to address"
                        value={toAddress}
                        onChange={setToAddress}
                    />
                </View>
                <View style={styles.inputStyle}>
                    <EtherInput
                        price={props.price}
                        value={amount}
                        onChange={(value) => {
                            setAmount(value);
                        }}
                    />
                </View>

                <Text>
                    📖{' '}
                    <TouchableOpacity
                        onPress={() =>
                            Linking.openURL(
                                'https://www.xdaichain.com/for-users/get-xdai-tokens'
                            )
                        }
                    >
                        <Text>Learn more about using xDai</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        );
        receiveButton = (
            <Button
                key="receive"
                title="Receive"
                onPress={() => {
                    setQr(selectedAddress);
                    setPK('');
                }}
            />
        );
        privateKeyButton = (
            <Button
                key="hide"
                title="Private Key"
                onPress={() => {
                    setPK(selectedAddress);
                    setQr('');
                }}
            />
        );
    }

    return (
        <View>
            {providerSend}
            <Modal
                isVisible={open}
                // onOk={() => {
                //     setOpen(!open);
                // }}
                // onCancel={() => {
                //     setOpen(!open);
                // }}
                // footer={[
                //     privateKeyButton,
                //     receiveButton,
                //     <Button
                //         key="submit"
                //         title="Send"
                //         disabled={!amount || !toAddress || !!qr}
                //         onPress={async () => {
                //             const mainnetBytecode = await props.ensProvider.getCode(
                //                 toAddress!
                //             );
                //             if (
                //                 !mainnetBytecode ||
                //                 mainnetBytecode === '0x' ||
                //                 mainnetBytecode === '0x0' ||
                //                 mainnetBytecode === '0x00'
                //             ) {
                //                 const tx = Transactor(props.provider);
                //                 tx!({
                //                     to: toAddress,
                //                     value: ethers.utils.parseEther('' + amount)
                //                 });
                //                 setOpen(!open);
                //             } else {
                //                 // make a popup notification
                //                 console.log("Unable to send");
                //             }
                //         }}
                //     >
                //     </Button>
                // ]}
            >
                <View>
                    {selectedAddress ? (
                        <Address
                            value={selectedAddress}
                            ensProvider={props.ensProvider}
                        />
                    ) : (
                        <Text>Loading</Text>
                    )}
                    <View style={{ alignItems: 'flex-end', paddingRight: 25 }}>
                        <Balance
                            address={selectedAddress}
                            provider={props.provider}
                            dollarMultiplier={props.price}
                        />
                    </View>
                </View>
                {display}
            </Modal>
        </View>
    );
}
