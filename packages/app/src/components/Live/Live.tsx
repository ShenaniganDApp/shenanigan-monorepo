import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Linking,
    Alert,
    Button,
    PermissionsAndroid
} from 'react-native';
import { LiveTabsProps as Props } from '../../Navigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NodePlayerView } from 'react-native-nodemediaclient';
import { Address } from '../Web3';
import  Animated  from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

export default function Live(props: Props) {
    const { address, mainnetProvider } = props.route.params;
    const vp = useRef(null);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#d2ffff' }}>
            <Address value={address} ensProvider={mainnetProvider} clickable />
            <NodePlayerView
                style={{ flex: 1, backgroundColor: '#333' }}
                ref={vp}
                inputUrl={''}
                scaleMode={'ScaleAspectFill'}
                bufferTime={300}
                maxBufferTime={1000}
                autoplay={true}
                onStatus={(code, msg) => {
                    console.log('onStatus=' + code + ' msg=' + msg);
                }}
            />
            <BottomSheet
                snapPoints={[500, 50]}
                renderContent={renderInner}
                renderHeader={() => <View style={styles.header} />}
                initialSnap={1}
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
