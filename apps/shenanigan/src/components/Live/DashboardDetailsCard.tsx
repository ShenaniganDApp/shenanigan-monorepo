import React, { ReactElement, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { Card, Title, XdaiBanner } from '../UI';

type Props = {
    visible: boolean;
};

export const DashboardDetailsCard = ({ visible }: Props): ReactElement => {
    const opacity = useSharedValue(0);

    const animatedOpacity = useAnimatedStyle(() => {
        return {
            opacity: opacity.value
        };
    });

    useEffect(() => {
        opacity.value = visible
            ? withTiming(1, { duration: 300 })
            : withTiming(0, { duration: 300 });
    }, [visible]);

    return (
        <Animated.View style={[animatedOpacity, styles.cardContainer]}>
            <Card glass noPadding style={styles.card}>
                <View style={styles.cardInner}>
                    <Title size={24} style={styles.cardTitle}>
                        Details
                    </Title>
                    <Text>Viewers:</Text>
                    <Text style={styles.cardBody}>160</Text>
                    <Text>Time:</Text>
                    <Text style={styles.cardBody}>1:08:04</Text>
                    <Text>Remaining:</Text>
                    <Text style={styles.cardBody}>1:08:04</Text>
                    <Text style={{ marginBottom: 4 }}>Donations:</Text>
                    <XdaiBanner amount={420} />
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
    cardBody: {
        fontWeight: '900',
        marginBottom: 10
    }
});
