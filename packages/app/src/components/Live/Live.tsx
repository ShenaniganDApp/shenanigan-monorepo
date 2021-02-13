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
import Video from 'react-native-video';

import { LiveTabProps, LiveTabs } from '../../Navigator';
import { Address, Balance } from '../Web3';
import { Live_me$key, Live_me } from './__generated__/Live_me.graphql';
import { WalletDropdown } from '../../WalletDropdown';

type Props = LiveTabProps;

export const Live = ({
    mainnetProvider,
    localProvider,
    injectedProvider,
    price,
    liveChallenge,
    me
}: Props): ReactElement => {
    const player = useRef(null);
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
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#d2ffff', height: '100%' }}
        >
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
    );
};
