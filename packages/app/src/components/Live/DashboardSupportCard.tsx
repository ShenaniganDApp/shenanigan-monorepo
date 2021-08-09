import React, { ReactElement, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, colors, Title } from '../UI';

type Props = {
    visible: boolean;
};

/*
    @TODO 
    handle large support numbers
    fix elevation showing through card on Android
*/

export const DashboardSupportCard = ({ visible }: Props): ReactElement => {
    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {
                duration: 300
            })
        };
    });

    useEffect(() => {
        opacity.value = visible ? 1 : 0;
    }, [visible]);

    return (
        <Animated.View style={[animatedStyle, styles.cardContainer]}>
            <Card glass noPadding style={styles.card}>
                <View style={styles.cardInner}>
                    <Title size={24} style={styles.cardTitle}>
                        Support
                    </Title>
                    <View style={styles.barContainer}>
                        <View>
                            <LinearGradient
                                colors={[colors.pink, colors.gray]}
                                style={styles.supportBar}
                            />
                            <Icon
                                name="triangle"
                                size={24}
                                color={colors.altWhite}
                                style={styles.barIcon}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <View>
                                <Title size={34} style={styles.supportTitle}>
                                    200
                                    <Text style={{ fontSize: 19 }}>/</Text>
                                </Title>
                                <Title size={19} style={styles.supportTitle}>
                                    500
                                </Title>
                            </View>

                            <View>
                                <Title size={34} style={styles.supportTitle}>
                                    300
                                    <Text style={{ fontSize: 19 }}>/</Text>
                                </Title>
                                <Title size={19} style={styles.supportTitle}>
                                    500
                                </Title>
                            </View>
                        </View>
                    </View>
                </View>
            </Card>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexBasis: '35%'
    },
    card: {
        flexGrow: 1
    },
    cardInner: {
        paddingHorizontal: '10%',
        paddingVertical: '12%',
        flexGrow: 1
    },
    cardTitle: {
        color: 'black',
        marginBottom: 12,
        textAlign: 'center'
    },
    barContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    supportTitle: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2
    },
    supportBar: {
        width: 20,
        flex: 1,
        borderRadius: 5,
        marginLeft: 5
    },
    barIcon: {
        position: 'absolute',
        transform: [{ rotate: '90deg' }, { translateX: -12 }],
        left: -8,
        top: '33%',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 3, height: 0 },
        textShadowRadius: 5
    },
    textContainer: {
        flex: 1,
        justifyContent: 'space-between',
        marginLeft: '6%'
    }
});
