import React, { useState, useContext, ReactElement, useCallback } from 'react';

import {
    Alert,
    Platform,
    Text,
    View,
    StyleSheet,
    Button,
    Image,
    TouchableWithoutFeedback,
    ImageProps,
    Linking
} from 'react-native';
import { Web3Context } from '../../contexts';

import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';
import wallets from '../../registry';
import wcLogo from '../../images/walletconnect-logo.png';

const WalletsGrid = (): ReactElement => (
    <View style={styles.grid}>
        {wallets.map(
            ({ name, logo }: { name: string; logo: ImageProps['source'] }) => (
                <View style={styles.item} key={name}>
                    <Image source={logo} style={styles.logo} />
                    <Text>{name}</Text>
                </View>
            )
        )}
    </View>
);

const ConnectButton = (): ReactElement => {
    const { uri } = useContext(Web3Context);

    const handlePress = useCallback(async () => {
        const supported = await Linking.canOpenURL(uri);

        if (supported) {
            await Linking.openURL(uri);
        } else {
            Alert.alert(`Don't know how to open this URL: ${uri}`);
        }
    }, [uri]);

    return <Button title="Connect" onPress={handlePress} />;
};

const WalletConnect = (): ReactElement => {
    if (Platform.OS === 'ios') {
        return <WalletsGrid />;
    } else {
        return <ConnectButton />;
    }
};

const WalletModal = (): ReactElement => {
    const [qrIsVisible, setQrIsVisible] = useState(false);
    const { uri, isVisible, setIsVisible } = useContext(Web3Context);

    const headerText =
        Platform.OS === 'ios'
            ? 'Choose Your Preferred Wallet'
            : 'Connect to Wallet';

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.header}>
                <Image source={wcLogo} style={styles.wcLogo} />
                <Button title="X" onPress={() => setIsVisible(false)} />
            </View>

            <View style={styles.walletsContainer}>
                <Text style={styles.walletsTitle}>
                    {qrIsVisible ? 'Scan QR Code' : headerText}
                </Text>

                {qrIsVisible ? (
                    <QRCode size={200} value={uri} />
                ) : (
                    <WalletConnect />
                )}

                <TouchableWithoutFeedback
                    onPress={() => setQrIsVisible(!qrIsVisible)}
                >
                    <Text style={styles.switch}>
                        {qrIsVisible ? 'View Wallets' : 'View QR Code'}
                    </Text>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
};
export default WalletModal;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    title: {
        color: 'white'
    },
    wcLogo: {
        width: 200,
        height: 50,
        resizeMode: 'contain'
    },
    walletsContainer: {
        backgroundColor: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 32,
        paddingBottom: 32,
        borderRadius: 25,
        alignItems: 'center'
    },
    walletsTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#686868',
        marginBottom: 20
    },
    switch: {
        fontSize: 18,
        textAlign: 'center',
        color: '#686868',
        marginTop: 20
    },
    list: {
        textAlign: 'center'
    },
    item: {
        padding: 10,
        flexBasis: '33.333%',
        alignItems: 'center'
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginBottom: 8
    }
});
