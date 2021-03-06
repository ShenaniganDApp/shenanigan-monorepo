import React, { ReactElement, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from '../UI';

type Props = {
    children: ReactNode;
    isMuted: boolean;
    isPaused: boolean;
};

export const Stream = ({
    children,
    isMuted,
    isPaused
}: Props): ReactElement => {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.absolute}>
                <Video
                    source={{
                        uri: 'https://www.w3schools.com/html/mov_bbb.mp4'
                    }}
                    muted={isMuted}
                    paused={isPaused}
                />
            </SafeAreaView>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
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
