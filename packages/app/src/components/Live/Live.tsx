import {
    createMaterialTopTabNavigator,
    MaterialTopTabScreenProps
} from '@react-navigation/material-top-tabs';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View, FlatList } from 'react-native';
import { NodePlayerView } from 'react-native-nodemediaclient';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWalletConnect } from 'react-native-walletconnect';
import BottomSheet from 'reanimated-bottom-sheet';

import { LiveTabProps as Props, LiveTabs } from '../../Navigator';
import { Address, Balance } from '../Web3';

const { height } = Dimensions.get('window');


const styles = StyleSheet.create({
    // header: {
    //     width: '100%',
    //     height: 500,
    //     backgroundColor: 'blue',
    // },

    dragBar: {
        backgroundColor: 'lightgray',
        borderRadius: 100,
        height: 4,
        marginTop: 15,
        width: '35%'
    },
    header: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
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


export default function Live(props: Props) {
    const [address, setAddress] = useState<string>();
    const [currentSnap, setSnap] = useState<string>(9);

    const {
        mainnetProvider,
        localProvider,
        injectedProvider,
        price
    } = props.route.params;

    const vp = useRef(null);

    const sheetRef = React.useRef(null);

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

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.dragBar} />
        </View>
    );

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
            <FlatList
                style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.0)', height: height - 120, position: 'absolute', right: 0, left: 0, bottom: 0 }}
                scrollEventThrottle={16}

                onScrollEndDrag={(event) => {
                    const yPos = parseInt(event.nativeEvent.contentOffset.y);
                    const pyPos = yPos / height;
                    let tmp = 9;
                    let index = Math.abs(9 - (Math.ceil(pyPos * 100) % 15))
                    if (index == 9) index = 0
                    console.log("end", yPos, pyPos, Math.ceil(pyPos * 100), yPos % 9, Math.ceil(pyPos * 100) % 9)
                    if (currentSnap > 0) {
                        tmp = currentSnap - index;
                        if (tmp < 0) tmp = 0;
                        sheetRef.current.snapTo(tmp)//snap to closest index
                        setSnap(tmp)
                    }

                }}

                onScroll={(event) => {
                    const yHeight = parseInt(event.nativeEvent.contentOffset.y);
                    // console.log("onScroll", yHeight, yHeight % 9)
                    // sheetRef.current.snapTo( 7 )
                }}
                onScrollBeginDrag={() => console.log("start")} />

            <BottomSheet
                snapPoints={[height - 100, height / 2, height / 3, height / 4, height / 5, height / 6, height / 7, height / 8, height / 9, 0]}
                renderContent={() => <LiveTabs />}
                renderHeader={renderHeader}
                initialSnap={9}
                callbackNode={fall}
                ref={sheetRef}
                enabledContentTapInteraction={true}
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
