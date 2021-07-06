import React, { ReactElement, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { graphql, useFragment } from 'relay-hooks';
import { LiveProps } from '../../Navigator';
import { Live_me$key } from './__generated__/Live_me.graphql';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { LiveChat } from './LiveChat';
import { Live_liveChallenge$key } from './__generated__/Live_liveChallenge.graphql';
import { LiveDashboard } from './LiveDashboard';
import { BottomSheet } from '../UI';
import { DonationModal } from './DonationModal';
import BottomSheetType from '@gorhom/bottom-sheet';

type Props = LiveProps & {
    isMuted: boolean;
    isPaused: boolean;
    setIsMuted: () => void;
    setIsPaused: () => void;
};

export const Live = (props: Props): ReactElement => {
    const me = useFragment<Live_me$key>(
        graphql`
            fragment Live_me on User {
                _id
                addresses
                burner
                ...LiveChatComposer_me
                ...DonationModal_profile
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
                ...Header_liveChallenge
                ...DonationModal_liveChallenge
            }
        `,
        props.liveChallenge
    );

    const [overlayVisible, setOverlayVisible] = useState(true);
    const [animation, setAnimation] = useState(true);
    const sheetRef = useRef<BottomSheetType | null>(null);

    const handlePress = () => {
        setAnimation(!animation);
        if (animation) {
            setOverlayVisible(false);
        } else {
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
                <Header
                    overlayVisible={overlayVisible}
                    isMuted={props.isMuted}
                    setIsMuted={props.setIsMuted}
                    isPaused={props.isPaused}
                    setIsPaused={props.setIsPaused}
                    animationEvent={animation}
                    afterAnimationOut={() => setOverlayVisible(false)}
                    liveChallenge={liveChallenge}
                />
                <LiveChat
                    overlayVisible={overlayVisible}
                    animationEvent={animation}
                    commentsQuery={props.commentsQuery}
                    image={me.addresses[0]}
                    setBottomSheetVisible={() => sheetRef.current?.expand()}
                    me={me}
                    liveChallenge={liveChallenge}
                />
            </View>
            {/* )} */}
            <BottomSheet ref={sheetRef}>
<<<<<<< HEAD
                <DonationModal me={me} />
=======
                <DonationModal liveChallenge={liveChallenge} />
>>>>>>> ee43fd15 (Fetch challenge data for donation modal)
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
