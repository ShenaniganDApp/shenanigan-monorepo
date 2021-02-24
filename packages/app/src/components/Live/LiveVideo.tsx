import React, { useRef, ReactElement, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text, View, Animated, Easing, StyleSheet } from 'react-native';
import Video from 'react-native-video';

export const LiveVideo = (): ReactElement => {
    const player = useRef(null);
    const [buffering, setBuffering] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleBuffering = ({ isBuffering }: { isBuffering: boolean }) => {
        setBuffering(isBuffering);
    };
    return (
        <View
            style={{
                position: 'absolute',
                backgroundColor: 'darkred',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                flex: 1
            }}
        >
            <Video
                source={{
                    uri: 'https://www.w3schools.com/html/mov_bbb.mp4'
                    // will produce error
                    // uri: 'https://www.youtube.com/watch?v=wupToqz1e2g'
                }}
                muted
                ref={player}
                resizeMode="cover"
                onBuffer={handleBuffering}
                onError={() => setIsError(true)}
                onLoadStart={() => setIsError(false)}
                style={{
                    aspectRatio: 9 / 16,
                    flex: 1
                }}
            />
            {buffering && <Buffer />}

            {isError && <Error />}
        </View>
    );
};

const styles = StyleSheet.create({});

const Buffer = () => {
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
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ rotate: spin }]
            }}
        >
            <Icon
                name="loading"
                size={60}
                color="white"
                style={{
                    textShadowColor: 'rgba(0,0,0,.3)',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 3,
                    zIndex: 4
                }}
            />
        </Animated.View>
    );
};

const Error = () => (
    <View
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
        <View
            style={{
                backgroundColor: 'white',
                height: 30,
                width: 30,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12
            }}
        >
            <Icon name="exclamation-thick" size={20} color="black" />
        </View>
        <Text
            style={{
                color: 'white',
                fontWeight: 'bold',
                textShadowColor: 'rgba(0,0,0,.6)',
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: 3
            }}
        >
            There was a problem playing the video.
        </Text>
    </View>
);
