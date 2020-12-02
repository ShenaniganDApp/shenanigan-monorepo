import React, {
    useEffect,
    useRef,
    useState,
    useContext,
    useCallback
} from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { NodePlayerView } from 'react-native-nodemediaclient';
import QRCode from 'react-native-qrcode-svg';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from 'reanimated-bottom-sheet';
import { graphql, useQuery } from 'relay-hooks';
import { useBurner } from '../../hooks/Burner';
import { Web3Context } from '../../contexts';

import { LiveTabProps as Props, LiveTabs } from '../../Navigator';
import { Address, Balance } from '../Web3';
import { LiveQuery } from './__generated__/LiveQuery.graphql';

type User = {
    address: string | null;
    username: string | null;
    isBurner: boolean | null;
};

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

const initialState = {
    user: {
        address: '',
        username: '',
        isBurner: true
    }
};

export default function Live({
    route: {
        params: { mainnetProvider, localProvider, injectedProvider, price }
    }
}: Props) {
    const [user, setUser] = useState<User | null>(initialState.user);
    //@TODO implement retry, error, cached
    const { props: queryProps } = useQuery<LiveQuery>(
        graphql`
            query LiveQuery {
                me {
                    ...Burner_me
                    addresses
                    username
                    burner
                }
            }
        `
    );

    const vp = useRef(null);
    const {
        connectWeb3,
        uri,
        isVisible,
        setIsVisible
    } = useContext(Web3Context);
    const { me } = { ...queryProps };

    const [isAuthenticated, _] = useBurner(me);
    console.log('isAuthenticated: ', isAuthenticated);

    useEffect(() => {
        if (me) {
            setUser({
                address: me.addresses[0],
                username: me.username,
                isBurner: me.burner
            });
        }
    }, [me]);

    const connect = useCallback(async () => {
        await connectWeb3().catch(console.error);
    }, [connectWeb3]);

    let display = <></>;
    display = (
        <View style={{ flexDirection: 'row' }}>
            {user.address ? (
                <Address value={user.address} ensProvider={mainnetProvider} />
            ) : (
                <Text>Connecting...</Text>
            )}
            <Balance
                address={user.address}
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

    const fall = new Animated.Value(1);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#d2ffff' }}>
            {display}
            {!isAuthenticated && <Button title="Connect" onPress={connect} />}
            <Modal
                isVisible={isVisible}
                onBackdropPress={() => setIsVisible(false)}
            >
                <View>
                    <QRCode size={300} value={uri} />
                </View>
            </Modal>
            <NodePlayerView
                style={{ flex: 1, backgroundColor: '#333' }}
                ref={vp}
                inputUrl=""
                scaleMode="ScaleAspectFill"
                bufferTime={300}
                maxBufferTime={1000}
                autoplay
                // onStatus={(code, msg) => {
                //     console.log(`onStatus=${code} msg=${msg}`);
                // }}
            />
            <BottomSheet
                snapPoints={[500, 50]}
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
