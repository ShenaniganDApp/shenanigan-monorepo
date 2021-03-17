import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    uri: string;
}

export const OutcomeVideo = ({ uri }: Props): ReactElement => {
    return (
        <View>
            <Video
                source={{
                    uri:
                        // 'https://mdw-cdn.livepeer.com/hls/8197mqr3gsrpeq37/index.m3u8'
                        'https://www.w3schools.com/html/mov_bbb.mp4'
                }}
                muted={true}
                // paused={isPaused}
                // ref={player}
                resizeMode="cover"
                // onBuffer={handleBuffering}
                // onError={() => setIsError(true)}
                // onLoadStart={() => setIsError(false)}
                // onLoad={() => setLoading(false)}
                style={{ aspectRatio: 9 / 16, flex: 1 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({});
