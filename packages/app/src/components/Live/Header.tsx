import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { graphql, useFragment } from 'react-relay';
import { Fade } from '../UI';
import { Blockie } from '../Web3';
import { UserInfo } from './UserInfo';
import { Header_liveChallenge$key } from './__generated__/Header_liveChallenge.graphql';

type Props = {
    liveChallenge: Header_liveChallenge$key | null;
    isPaused: boolean;
    isMuted: boolean;
    setIsPaused: (b: boolean) => void;
    setIsMuted: (b: boolean) => void;
    animationEvent: boolean;
    overlayVisible: boolean;
    afterAnimationOut: () => void;
};

export const Header = ({
    isPaused,
    setIsPaused,
    isMuted,
    setIsMuted,
    animationEvent,
    overlayVisible,
    afterAnimationOut,
    ...props
}: Props): ReactElement => {
    const liveChallenge = useFragment<Header_liveChallenge$key>(
        graphql`
            fragment Header_liveChallenge on Challenge {
                ...UserInfo_liveChallenge
            }
        `,
        props.liveChallenge
    );

    const [animation, setAnimation] = useState(false);
    const [visible, setVisible] = useState(false);

    const handlePress = () => {
        setAnimation(!animation);
        if (!visible) {
            setVisible(true);
        }
    };

    return (
        <Fade
            event={animationEvent}
            afterAnimationOut={afterAnimationOut}
            down
            pointerEvents={overlayVisible ? 'box-none' : 'none'}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <UserInfo liveChallenge={liveChallenge} />
                    <Dots onPress={handlePress} />
                </View>
                {visible && (
                    <Fade
                        event={animation}
                        style={styles.buttonContainer}
                        afterAnimationOut={() => setVisible(false)}
                    >
                        <PlayControls
                            onPress={() => setIsPaused(!isPaused)}
                            isPaused={isPaused}
                        />

                        <VolumeControls
                            onPress={() => setIsMuted(!isMuted)}
                            isMuted={isMuted}
                        />
                    </Fade>
                )}
            </View>
        </Fade>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        marginRight: 16
    },
    title: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,.6)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 3
    },
    buttonContainer: {
        backgroundColor: 'rgba(60,60,60,.25)',

        flexDirection: 'row',
        alignSelf: 'flex-end',
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginRight: 16,
        borderRadius: 12
    },
    controlButton: {
        marginHorizontal: 8
    },
    icon: {
        shadowOffset: { width: 0, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 0.5
    }
});

const Dots = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <Icon
            style={styles.icon}
            name="dots-horizontal"
            size={40}
            color="white"
        />
    </TouchableOpacity>
);

const PlayControls = ({ onPress, isPaused }) => (
    <TouchableOpacity onPress={onPress} style={styles.controlButton}>
        {isPaused ? (
            <Icon style={styles.icon} name="play" size={36} color="white" />
        ) : (
            <Icon style={styles.icon} name="pause" size={36} color="white" />
        )}
    </TouchableOpacity>
);

const VolumeControls = ({ onPress, isMuted }) => (
    <TouchableOpacity onPress={onPress} style={styles.controlButton}>
        {isMuted ? (
            <Icon
                style={styles.icon}
                name="volume-high"
                size={36}
                color="white"
            />
        ) : (
            <Icon
                style={styles.icon}
                name="volume-variant-off"
                size={36}
                color="white"
            />
        )}
    </TouchableOpacity>
);
