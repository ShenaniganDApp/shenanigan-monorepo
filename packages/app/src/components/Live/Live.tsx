import {
    createMaterialTopTabNavigator,
    MaterialTopTabScreenProps
} from '@react-navigation/material-top-tabs';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import { NodePlayerView } from 'react-native-nodemediaclient';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWalletConnect } from 'react-native-walletconnect';
import BottomSheet from 'reanimated-bottom-sheet';

import { LiveTabProps as Props, LiveTabs } from '../../Navigator';
import { Address, Balance } from '../Web3';

const windowHeight = Dimensions.get('window').height - 60

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 50
    },
    panel: {
        height: 600,
        padding: 20,
        backgroundColor: '#d2ffff',
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
        shadowOpacity: 0.4
    }
});

const { height } = Dimensions.get('window');

export default function Live(props: Props) {
    const [address, setAddress] = useState<string>();

    const {
        mainnetProvider,
        localProvider,
        injectedProvider,
        price
    } = props.route.params;

    const vp = useRef(null);
    const {
        createSession,
        killSession,
        session,
        signTransaction
    } = useWalletConnect();
    const hasWallet = !!session.length;

    let display = <></>;
    display = (
        <View style={{ flexDirection: 'row' }}>
            {address ? (
                <Address value={address} ensProvider={mainnetProvider} />
            ) : (
                <Text>Connecting...</Text>
            )}
            <Balance
                address={address}
                provider={localProvider}
                dollarMultiplier={price}
            />
            {/* <Wallet
                address={address}
                provider={localProvider}
                ensProvider={mainnetProvider}
                price={price}
            /> */}
        </View>
    );

    useEffect(() => {
        hasWallet && setAddress(session[0].accounts[0]);
    }, [hasWallet]);

    const fall = new Animated.Value(1);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#d2ffff' }}>
            {display}
            {!address && <Button title="Connect" onPress={createSession} />}
            <NodePlayerView
                style={{ flex: 1, backgroundColor: '#333' }}
                ref={vp}
                inputUrl=""
                scaleMode="ScaleAspectFill"
                bufferTime={300}
                maxBufferTime={1000}
                autoplay
                onStatus={(code, msg) => {
                    console.log(`onStatus=${code} msg=${msg}`);
                }}
            />
            <BottomSheet
                snapPoints={[ windowHeight, 600 ]}
                renderContent={() => <LiveTabs />}
                renderHeader={() => <View style={styles.header} />}
                initialSnap={1}
                callbackNode={fall}
                enabledInnerScrolling={false}
            >
                <Animated.View
                    style={{
                        alignItems: 'center',
                        opacity: Animated.add(0.1, Animated.multiply(fall, 0.9))
                    }}
                >
                    <Text style={{ position: 'absolute', zIndex: 1 }}>
                        Swipe up from very bottom
                    </Text>
                </Animated.View>
            </BottomSheet>
        </SafeAreaView>
    );
}
