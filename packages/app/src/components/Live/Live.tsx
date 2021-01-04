import React, {
    useEffect,
    useRef,
    useState,
    useContext,
    useCallback,
} from 'react';
import { Button, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useQuery } from 'relay-hooks';
import { useBurner } from '../../hooks/Burner';
import { Web3Context } from '../../contexts';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';

import { LiveTabProps as Props, LiveTabs } from '../../Navigator';
import { Address, Balance } from '../Web3';
import { LiveQuery } from './__generated__/LiveQuery.graphql';

type User = {
    address: string | null;
    username: string | null;
    isBurner: boolean | null;
};

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

    const player = useRef(null);
    const { connectWeb3, uri, isVisible, setIsVisible } = useContext(
        Web3Context
    );
    const { me } = { ...queryProps };

    const [isAuthenticated, _] = useBurner(me);

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

    return (
        <Swiper horizontal={false} showsPagination={false} loop={false}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#d2ffff' }}>
                {display}
                {!isAuthenticated && (
                    <Button title="Connect" onPress={connect} />
                )}
                <Video
                    source={{ uri: "https://fra-cdn.livepeer.com/hls/8197mqr3gsrpeq37/index.m3u8" }} // Can be a URL or a local file.
                    ref={player}
                    // onBuffer={this.onBuffer} // Callback when remote video is buffering
                    // onError={this.videoError} // Callback when video cannot be loaded
                    style={{flex: 1, backgroundColor: '#333'}}
                />
            </SafeAreaView>

            <SafeAreaView style={{ height: '100%' }}>
                <LiveTabs />
            </SafeAreaView>
        </Swiper>
    );
}
