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
    me,
    commentsQuery
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

    const [overlayVisible, setOverlayVisible] = useState(false);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: 'black'
            }}
        >
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <LiveVideo />

                <TouchableOpacity
                    onPressOut={() => setOverlayVisible(!overlayVisible)}
                    style={{
                        flex: 1,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}
                />
                {overlayVisible && (
                    <>
                        <Header />
                        <LiveChat commentsQuery={commentsQuery} />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};
