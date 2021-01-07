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
import { graphql, useFragment, useQuery } from 'relay-hooks';
import { useBurner } from '../../hooks/Burner';
import { Web3Context } from '../../contexts';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';

import { LiveTabProps, LiveTabs } from '../../Navigator';
import { Address, Balance } from '../Web3';
import { Live_me$key } from './__generated__/Live_me.graphql';

type Props = LiveTabProps & {};

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
    const user = useFragment<Live_me$key>(
        graphql`
            fragment Live_me on User {
                ...Burner_me
                addresses
                username
                burner
            }
        `,
        me
    );
    const player = useRef(null);
    const { connectWeb3 } = useContext(Web3Context);
    const [isAuthenticated, _] = useBurner(me);

    const connect = useCallback(async () => {
        await connectWeb3().catch(console.error);
    }, [connectWeb3]);

    let display = <></>;
    let address = user.addresses[0];
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

    return (
        <Swiper horizontal={false} showsPagination={false} loop={false}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#d2ffff' }}>
                {display}
                {!isAuthenticated && (
                    <Button title="Connect" onPress={connect} />
                )}
                <Video
                    source={{
                        uri:
                            'https://fra-cdn.livepeer.com/hls/8197mqr3gsrpeq37/index.m3u8'
                    }}
                    ref={player}
                    // onBuffer={this.onBuffer} // Callback when remote video is buffering
                    // onError={this.videoError} // Callback when video cannot be loaded
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                    }}
                />
            </SafeAreaView>

            <SafeAreaView style={{ height: '100%' }}>
                <LiveTabs me={me} liveChallenge={liveChallenge} />
            </SafeAreaView>
        </Swiper>
    );
}
