import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fade } from '../UI';
import { Blockie } from '../Web3';

type Props = {
    image: string;
    title: string;
    isPaused: boolean;
    isMuted: boolean;
    setIsPaused: (b: boolean) => void;
    setIsMuted: (b: boolean) => void;
    animationEvent: boolean;
    animationHandler: () => void;
};

export const Header = ({
    image,
    title,
    isPaused,
    setIsPaused,
    isMuted,
    setIsMuted,
    animationEvent,
    animationHandler
}: Props): ReactElement => {
    const [animation, setAnimation] = useState(false);
    const [visible, setVisible] = useState(false);

    const handlePress = () => {
        setAnimation(!animation);
        if (!visible) {
            setVisible(true);
        }
    };

    return (
        <Fade event={animationEvent} afterAnimationOut={animationHandler} down>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.infoContainer}>
                        <View style={styles.image}>
                            <Blockie size={12} scale={4} address={image} />
                        </View>
                        <Text style={styles.title}>{title}</Text>
                    </View>

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
        backgroundColor: 'rgba(255,255,255,.3)',
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
