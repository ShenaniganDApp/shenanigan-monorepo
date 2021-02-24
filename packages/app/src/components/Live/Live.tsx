import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { graphql, useFragment } from 'relay-hooks';
import { LiveProps } from '../../Navigator';
import { Live_me$key } from './__generated__/Live_me.graphql';

import { LiveVideo } from './LiveVideo';
import { Header } from './Header';
import { LiveChat } from './LiveChat';

import { SafeAreaView } from 'react-native-safe-area-context';

type Props = LiveProps;

/*
    toggley woggley -> on press
    safeareaview
    plus -> opens chat
    donation -> open monies

    pause play mute & chat bubble
    wallet styles
*/

export const Live = ({
    mainnetProvider,
    localProvider,
    injectedProvider,
    price,
    liveChallenge,
    me
}: Props): ReactElement => {
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
            style={{
                flex: 1,
                backgroundColor: 'black'
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'space-between'
                }}
            >
                <LiveVideo />
                <Header />
                <LiveChat />
            </View>
        </SafeAreaView>
    );
};
