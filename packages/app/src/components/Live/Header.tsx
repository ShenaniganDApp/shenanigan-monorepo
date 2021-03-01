import React, { ReactElement, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fade } from '../UI';

type Props = {
    isPaused: boolean;
    isMuted: boolean;
    setIsPaused: (b: boolean) => void;
    setIsMuted: (b: boolean) => void;
};

export const Header = ({
    isPaused,
    setIsPaused,
    isMuted,
    setIsMuted
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
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.infoContainer}>
                    <View style={styles.image} />
                    <Text style={styles.title}>
                        This is the title of the stream
                    </Text>
                </View>

                <Dots onPress={handlePress} />
            </View>
            {visible && (
                <Fade
                    event={animation}
                    style={styles.buttonContainer}
                    afterAnimationOut={setVisible}
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
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#333',
        marginRight: 16
    },
    title: {
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
