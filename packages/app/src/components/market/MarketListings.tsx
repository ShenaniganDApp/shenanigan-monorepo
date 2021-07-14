import React, { ReactElement, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Card, colors, LoadingSpinner, Title, XdaiBanner } from '../UI';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

type Props = {
    setAnimation: (b: boolean) => void;
};

export const MarketListings = ({ setAnimation }: Props): ReactElement => {
    const insets = useSafeAreaInsets();
    const opacity = useSharedValue(0);

    // test data and placeholder loading functionality
    const test = Array.from(Array(6).keys());
    const [data, setData] = useState(false);
    setTimeout(() => {
        setData(true);
        opacity.value = 1;
    }, 200);
    // end test data

    const style = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {
                duration: 500
            })
        };
    });

    return (
        <View style={[StyleSheet.absoluteFill, styles.flex]}>
            <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={4}
                reducedTransparencyFallbackColor="rgba(255,255,255,.5)"
            />
            <View style={[styles.flex, { paddingTop: insets.top }]}>
                <View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => setAnimation(false)}>
                            <Icon
                                name="chevron-left"
                                size={52}
                                color={colors.pink}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                    <Title style={styles.title} shadow>
                        Other Sellers
                    </Title>
                </View>

                {data ? (
                    <Animated.View style={[styles.box, style]}>
                        <FlatList
                            data={test}
                            style={styles.list}
                            contentContainerStyle={styles.contentContainer}
                            renderItem={({ item }) => {
                                return (
                                    <Card style={styles.card}>
                                        <Title
                                            size={18}
                                            style={[
                                                styles.grayColor,
                                                styles.cardText
                                            ]}
                                        >
                                            from prettyscone shans
                                        </Title>
                                        <Text
                                            style={[
                                                styles.grayColor,
                                                styles.cardText
                                            ]}
                                        >
                                            Current price
                                        </Text>
                                        <View style={styles.row}>
                                            <XdaiBanner amount="99,999" />
                                            <Title
                                                size={18}
                                                style={styles.grayColor}
                                            >
                                                15/15 Available
                                            </Title>
                                        </View>
                                        <Button
                                            title="Buy Now"
                                            fullWidth
                                            style={styles.cardButton}
                                        />
                                    </Card>
                                );
                            }}
                            // keyExtractor={(item) => item.node._id}
                        />
                    </Animated.View>
                ) : (
                    <LoadingSpinner />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    grayColor: {
        color: colors.gray
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    flex: {
        flex: 1
    },
    iconContainer: {
        position: 'absolute',
        left: '4%',
        top: 0,
        zIndex: 1
    },
    icon: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 5
    },
    title: {
        textAlign: 'center'
    },
    list: {
        marginTop: '4%'
    },
    contentContainer: {
        paddingHorizontal: '4%',
        paddingBottom: '4%'
    },
    card: {
        backgroundColor: 'rgba(255,255,255,.75)',
        marginBottom: '4%'
    },
    cardText: {
        marginBottom: '1%'
    },
    cardButton: {
        marginTop: '3%'
    }
});
