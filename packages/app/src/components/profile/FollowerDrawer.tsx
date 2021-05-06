import React, { ReactElement, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing
} from 'react-native-reanimated';

type Props = {
    drawerOpen: boolean;
    setDrawerOpen: (b: boolean) => void;
};

export const FollowerDrawer = ({
    drawerOpen,
    setDrawerOpen
}: Props): ReactElement => {
    const windowW = Dimensions.get('window').width;
    const x = useSharedValue(-windowW);

    useEffect(() => {
        if (drawerOpen) {
            x.value = 0;
        } else {
            x.value = -windowW;
        }
    }, [drawerOpen]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withTiming(x.value, {
                        duration: 500,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                    })
                }
            ]
        };
    });

    return (
        <Animated.View style={[animatedStyle, styles.container]}>
            <View style={styles.inner}>
                <SafeAreaView>
                    <TouchableOpacity
                        onPress={() => setDrawerOpen(false)}
                        style={{ backgroundColor: 'purple', padding: 10 }}
                    >
                        <Text>X</Text>
                    </TouchableOpacity>
                    <Text>component</Text>
                </SafeAreaView>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    inner: {
        height: '100%',
        width: '66.666%',
        backgroundColor: 'rgba(255,255,255,.7)'
    }
});
