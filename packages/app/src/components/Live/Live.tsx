import React, { ReactElement, useState } from 'react';
import { View, TouchableOpacity, Animated, Text } from 'react-native';
import { graphql, useFragment } from 'relay-hooks';
import { LiveProps } from '../../Navigator';
import { Live_me$key } from './__generated__/Live_me.graphql';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LiveVideo } from './LiveVideo';
import { Header } from './Header';
import { LiveChat } from './LiveChat';
import { Live_liveChallenge$key } from './__generated__/Live_liveChallenge.graphql';
import { LiveDashboard } from './LiveDashboard';
import { Fade } from '../UI';

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
    const [animation, setAnimation] = useState(false);

    const handlePress = () => {
        setAnimation(!animation);
        if (!overlayVisible) {
            setOverlayVisible(true);
        }
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
                        onPress={handlePress}
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
                            <Fade
                                event={animation}
                                afterAnimationOut={setOverlayVisible}
                                down
                            >
                                <Header
                                    isMuted={isMuted}
                                    setIsMuted={setIsMuted}
                                    isPaused={isPaused}
                                    setIsPaused={setIsPaused}
                                />
                            </Fade>

                            <Fade event={animation} up>
                                <LiveChat commentsQuery={props.commentsQuery} />
                            </Fade>
                        </>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
};
