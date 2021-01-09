import React, {
    useEffect,
    useRef,
    useState,
    useContext,
    useCallback,
    ReactElement
} from 'react';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useFragment } from 'relay-hooks';
import { Web3Context } from '../../contexts';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';

import { LiveTabProps, LiveTabs } from '../../Navigator';
import { Address, Balance } from '../Web3';
import { Live_me$key, Live_me } from './__generated__/Live_me.graphql';

type Props = LiveTabProps;

export function Live({
    route: {
        params: {
            mainnetProvider,
            localProvider,
            injectedProvider,
            price,
            liveChallenge,
            me
        }
    }
}: Props): ReactElement {
    const [user, setUser] = useState<Live_me | null>();
    const player = useRef(null);
    const { connectWeb3 } = useContext(Web3Context);

    const connect = useCallback(async () => {
        console.log('hello');
        await connectWeb3().catch(console.error);
    }, [connectWeb3]);
    const userFragment = useFragment<Live_me$key>(
        graphql`
            fragment Live_me on User {
                addresses
                username
                burner
            }
        `,
        me
    );
    useEffect(() => {
        setUser(userFragment);
    }, [userFragment]);
    let display = <></>;
    display = (
        <View style={{ flexDirection: 'row' }}>
            {user ? (
                <>
                    <Address
                        value={user.addresses[0]}
                        ensProvider={mainnetProvider}
                    />
                    <Balance
                        address={user.addresses[0]}
                        provider={localProvider}
                        dollarMultiplier={price}
                    />
                </>
            ) : (
                <Text>Connecting...</Text>
            )}

            {/* <Wallet
                address={address}
                provider={localProvider}
                ensProvider={mainnetProvider}
                price={price}
            /> */}
        </View>
    );

    return (
        <Swiper horizontal={false} showsPagination={false} loop={false}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#d2ffff' }}>
                {display}
                {user && user.burner && (
                    <Button title="Connect" onPress={connect} />
                )}
                <View style={{ flex: 1 }}>
                    <Video
                        source={{
                            uri:
                                'https://fra-cdn.livepeer.com/hls/8197mqr3gsrpeq37/index.m3u8'
                        }}
                        ref={player}
                        // onBuffer={this.onBuffer} // Callback when remote video is buffering
                        // onError={this.videoError} // Callback when video cannot be loaded
                        style={{
                            aspectRatio: 9 / 16,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0
                        }}
                    />
                </View>
            </SafeAreaView>

            <SafeAreaView style={{ height: '100%' }}>
                <LiveTabs me={me} liveChallenge={liveChallenge} />
            </SafeAreaView>
        </Swiper>
    );
}
