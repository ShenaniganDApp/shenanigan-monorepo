import React, { ReactElement, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { graphql, useFragment } from 'relay-hooks';
import { LiveProps } from '../../Navigator';
import { Live_me$key } from './__generated__/Live_me.graphql';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { LiveChat } from './LiveChat';
import { Live_liveChallenge$key } from './__generated__/Live_liveChallenge.graphql';
import { LiveDashboard } from './LiveDashboard';
import { BottomSheet, Card } from '../UI';

type Props = LiveProps & {
    isMuted: boolean;
    isPaused: boolean;
    setIsMuted: () => void;
    setIsPaused: () => void;
};

export const Live = (props: Props): ReactElement => {
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

    const me = useFragment<Live_me$key>(
        graphql`
            fragment Live_me on User {
                _id
                addresses
                burner
                ...LiveChatComposer_me
            }
        `,
        props.me
    );

    const liveChallenge = useFragment<Live_liveChallenge$key>(
        graphql`
            fragment Live_liveChallenge on Challenge {
                _id
                title
                creator {
                    _id
                }
                ...LiveChatComposer_liveChallenge
            }
        `,
        props.liveChallenge
    );

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [animation, setAnimation] = useState(false);

    const handlePress = () => {
        setAnimation(!animation);
        if (!overlayVisible) {
            setOverlayVisible(true);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* {liveChallenge.creator._id === me._id ? (
                <LiveDashboard />
            ) : ( */}
            <View style={styles.inner}>
                <TouchableOpacity
                    onPress={handlePress}
                    style={styles.absolute}
                />
                {overlayVisible && (
                    <>
                        <Header
                            isMuted={props.isMuted}
                            setIsMuted={props.setIsMuted}
                            isPaused={props.isPaused}
                            setIsPaused={props.setIsPaused}
                            animationEvent={animation}
                            image={me.addresses[0]}
                            title={liveChallenge.title}
                            afterAnimationOut={() => setOverlayVisible(false)}
                        />

                        <LiveChat
                            animationEvent={animation}
                            commentsQuery={props.commentsQuery}
                            image={me.addresses[0]}
                            setBottomSheetVisible={setBottomSheetVisible}
                            me={me}
                            liveChallenge={liveChallenge}
                        />
                    </>
                )}
            </View>
            {/* )} */}
            <BottomSheet
                bottomSheetVisible={bottomSheetVisible}
                setBottomSheetVisible={setBottomSheetVisible}
            >
                <Card>
                    <Text>hi</Text>
                </Card>
            </BottomSheet>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderBottomWidth: 4
    },
    inner: {
        flex: 1,
        justifyContent: 'space-between',
        marginBottom: -4
    },
    absolute: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
});
