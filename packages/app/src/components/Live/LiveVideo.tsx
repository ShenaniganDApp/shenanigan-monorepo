import React, { useRef, ReactElement, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text, View, Animated, Easing, StyleSheet } from 'react-native';
import Video from 'react-native-video';

type Props = {
    isPaused: boolean;
    isMuted: boolean;
};

export const LiveVideo = ({ isPaused, isMuted }: Props): ReactElement => {
    const player = useRef(null);
    const [buffering, setBuffering] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const handleBuffering = ({ isBuffering }: { isBuffering: boolean }) => {
        setBuffering(isBuffering);
    };

    return (
        <View style={styles.container}>
            <Video
                source={{
                    uri:
                        // 'https://mdw-cdn.livepeer.com/hls/8197mqr3gsrpeq37/index.m3u8'
                        'https://www.w3schools.com/html/mov_bbb.mp4'
                }}
                muted={isMuted}
                paused={isPaused}
                ref={player}
                resizeMode="cover"
                onBuffer={handleBuffering}
                onError={() => setIsError(true)}
                onLoadStart={() => setIsError(false)}
                onLoad={() => setLoading(false)}
                style={{ aspectRatio: 9 / 16, flex: 1 }}
            />
            {(buffering || loading) && !isError && <Loading />}

            {isError && <Error />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        flex: 1
    },
    loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingIcon: {
        textShadowColor: 'rgba(0,0,0,.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3,
        zIndex: 4
    },
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorIconBg: {
        backgroundColor: 'white',
        height: 30,
        width: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    errorText: {
        color: 'white',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,.6)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 3
    }
});

const Loading = () => {
    const spinValue = new Animated.Value(0);

    Animated.loop(
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
        })
    ).start();

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <Animated.View
            style={{
                ...styles.loading,
                transform: [{ rotate: spin }]
            }}
        >
            <Icon
                name="loading"
                size={60}
                color="white"
                style={styles.loadingIcon}
            />
        </Animated.View>
    );
};

const Error = () => (
    <View style={styles.errorContainer}>
        <View style={styles.errorIconBg}>
            <Icon name="exclamation-thick" size={20} color="black" />
        </View>
        <Text style={styles.errorText}>
            There was a problem playing the video.
        </Text>
    </View>
);
