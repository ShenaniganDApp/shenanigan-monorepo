import React, { ReactElement, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { graphql, useFragment } from 'relay-hooks';
import { LiveProps } from '../../Navigator';
import { Live_me$key } from './__generated__/Live_me.graphql';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LiveVideo } from './LiveVideo';
import { Header } from './Header';
import { LiveChat } from './LiveChat';

type Props = LiveProps;

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

    const [videoVisible, setVideoVisible] = useState(false);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: videoVisible ? 'black' : '#d2ffff'
            }}
        >
            {!videoVisible && (
                <TouchableOpacity
                    onPressOut={() => setVideoVisible(true)}
                    style={{ flex: 1 }}
                />
            )}
            {videoVisible && (
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <LiveVideo />
                    <Header />
                    <LiveChat />
                </View>
            )}
        </SafeAreaView>
    );
};
