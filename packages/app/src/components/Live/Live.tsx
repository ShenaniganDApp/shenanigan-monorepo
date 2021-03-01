import React, { ReactElement, useState } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { graphql, useFragment } from 'relay-hooks';
import { LiveProps } from '../../Navigator';
import { Live_me$key } from './__generated__/Live_me.graphql';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LiveVideo } from './LiveVideo';
import { Header } from './Header';
import { LiveChat } from './LiveChat';
import { Live_liveChallenge$key } from './__generated__/Live_liveChallenge.graphql';
import { LiveDashboard } from './LiveDashboard';

type Props = LiveProps;

export const Live = (props: Props): ReactElement => {
    const me = useFragment<Live_me$key>(
        graphql`
            fragment Live_me on User {
                _id
                addresses
                burner
            }
        `,
        props.me
    );

    const liveChallenge = useFragment<Live_liveChallenge$key>(
        graphql`
            fragment Live_liveChallenge on Challenge {
                _id
                creator {
                    _id
                }
            }
        `,
        props.liveChallenge
    );

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const [fadeAnimation] = useState(() => new Animated.Value(0));
    const [moveDown] = useState(() => new Animated.Value(-10));
    const [moveUp] = useState(() => new Animated.Value(10));
    const animationTiming = 200;

    const fadeIn = () => {
        setOverlayVisible(true);

        Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: animationTiming,
            useNativeDriver: true
        }).start();

        Animated.timing(moveDown, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start();

        Animated.timing(moveUp, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    };

    const fadeOut = () => {
        Animated.timing(fadeAnimation, {
            toValue: 0,
            duration: animationTiming,
            useNativeDriver: true
        }).start(() => setOverlayVisible(false));

        Animated.timing(moveDown, {
            toValue: -10,
            duration: animationTiming,
            useNativeDriver: true
        }).start();

        Animated.timing(moveUp, {
            toValue: 10,
            duration: 300,
            useNativeDriver: true
        }).start();
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: 'black'
            }}
        >
            {liveChallenge.creator._id === me._id ? (
                <LiveDashboard />
            ) : (
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <LiveVideo isPaused={isPaused} isMuted={isMuted} />

                    <TouchableOpacity
                        onPress={() => setOverlayVisible(!overlayVisible)}
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
                            <LiveChat commentsQuery={props.commentsQuery} />
                        </>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
};
