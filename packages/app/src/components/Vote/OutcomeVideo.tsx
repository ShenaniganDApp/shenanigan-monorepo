import React, { ReactElement, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Video, Fade } from '../UI';

interface Props {
    uri: string;
}

export const OutcomeVideo = ({ uri }: Props): ReactElement => {
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [animation, setAnimation] = useState(false);

    const handlePress = () => {
        setAnimation(!animation);
        if (!overlayVisible) {
            setOverlayVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <Video
                uri={uri}
                style={{ alignSelf: 'center' }}
                paused={isPaused}
                muted={isMuted}
            />
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
                <Fade
                    event={animation}
                    style={styles.iconContainer}
                    afterAnimationOut={() => setOverlayVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.iconBg}
                        onPress={() => setIsPaused(!isPaused)}
                    >
                        {isPaused ? (
                            <Icon
                                style={styles.icon}
                                name="play"
                                size={42}
                                color="white"
                            />
                        ) : (
                            <Icon
                                style={styles.icon}
                                name="pause"
                                size={42}
                                color="white"
                            />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.iconBg}
                        onPress={() => setIsMuted(!isMuted)}
                    >
                        {isMuted ? (
                            <Icon
                                style={styles.icon}
                                name="volume-high"
                                size={42}
                                color="white"
                            />
                        ) : (
                            <Icon
                                style={styles.icon}
                                name="volume-variant-off"
                                size={42}
                                color="white"
                            />
                        )}
                    </TouchableOpacity>
                </Fade>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        position: 'absolute',
        backgroundColor: 'darkred',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    iconContainer: {
        position: 'absolute',
        flexDirection: 'row'
    },
    iconBg: {
        backgroundColor: 'rgba(0,0,0,.4)',
        height: 58,
        width: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8
    },
    icon: {}
});
