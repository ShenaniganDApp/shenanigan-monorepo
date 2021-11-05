import React, { ReactElement, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { colors, Title } from '../UI';

type Props = {
    live: boolean;
};

export const DashboardToggle = ({ live }: Props): ReactElement => {
    const circlePosition = useSharedValue(0);

    const circleStyles = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            circlePosition.value,
            [0, 12],
            [colors.gray, colors.pink]
        );

        return {
            transform: [
                {
                    translateX: circlePosition.value
                }
            ],
            backgroundColor
        };
    });

    const bgStyles = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            circlePosition.value,
            [0, 12],
            [colors.gray, 'white']
        );

        return {
            backgroundColor
        };
    });

    useEffect(() => {
        circlePosition.value = live
            ? withTiming(12, { duration: 300 })
            : withTiming(0, { duration: 300 });
    }, [live]);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.toggleContainer}>
                    <Animated.View style={[bgStyles, styles.background]} />
                    <Animated.View style={[circleStyles, styles.circle]} />
                </View>
                <Title size={19} shadow>
                    {live ? 'Live' : 'Ready'}
                </Title>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexBasis: '24%'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    toggleContainer: {
        width: 26,
        height: 14,
        justifyContent: 'center',
        marginRight: 6
    },
    background: {
        height: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white'
    },
    circle: {
        height: 14,
        width: 14,
        position: 'absolute',
        borderRadius: 40,
        left: 0,
        top: 0
    }
});
