import React, { ReactElement, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import Video, { VideoProperties } from 'react-native-video';
import { LoadingSpinner } from './index';

type Props = {
    paused: boolean;
    muted: boolean;
    uri: string;
    style?: ViewStyle;
};

const VideoPlayer = (props: VideoProperties): ReactElement => {
    const [buffering, setBuffering] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const handleBuffering = ({ isBuffering }: { isBuffering: boolean }) => {
        setBuffering(isBuffering);
    };

    return (
        <View style={styles.container}>
            <Video
                {...props}
                resizeMode="cover"
                onBuffer={handleBuffering}
                onError={() => setIsError(true)}
                onLoadStart={() => setIsError(false)}
                onLoad={() => setLoading(false)}
                style={{ aspectRatio: 9 / 16, flex: 1, ...(props.style as {}) }}
            />
            {(buffering || loading) && !isError && <LoadingSpinner />}

            {isError && (
                <View style={styles.errorContainer}>
                    <View style={styles.errorIconBg}>
                        <Icon
                            name="exclamation-thick"
                            size={20}
                            color="black"
                        />
                    </View>
                    <Text style={styles.errorText}>
                        There was a problem playing the video.
                    </Text>
                </View>
            )}
        </View>
    );
};

export default VideoPlayer;

const styles = StyleSheet.create({
    container: {
        flex: 1
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
