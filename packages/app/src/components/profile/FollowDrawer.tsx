import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, Platform } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from '@react-native-community/blur';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS
} from 'react-native-reanimated';
import { FollowCard } from './FollowCard';
import { colors, sizes } from '../UI';
import { SwiperContext } from '../../contexts';

type Props = {
    drawerOpen: boolean;
    setMainTabSwipe: (b: boolean) => void;
    setDrawerOpen: (b: boolean) => void;
};

export const FollowDrawer = ({
    drawerOpen,
    setDrawerOpen,
    setMainTabSwipe
}: Props): ReactElement => {
    const { setWalletScroll } = useContext(SwiperContext);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const windowW = Dimensions.get('window').width;
    const x = useSharedValue(-windowW);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (drawerOpen) {
            setMainTabSwipe(false);
            setOverlayVisible(true);
            setWalletScroll(false);
        } else {
            setMainTabSwipe(true);
            setWalletScroll(true);
            x.value = -windowW;
            opacity.value = 0;
        }
    }, [drawerOpen]);

    useEffect(() => {
        if (overlayVisible) {
            x.value = 0;
            opacity.value = 1;
        }
    }, [overlayVisible]);

    const animationOut = () => {
        if (!drawerOpen) {
            setOverlayVisible(false);
        }
    };

    const animatedDrawerStyle = useAnimatedStyle(() => {
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

    const animatedOverlayStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(
                opacity.value,
                {
                    duration: 300,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                },
                runOnJS(animationOut)
            )
        };
    });

    return (
        <>
            {overlayVisible && (
                <Animated.View style={[animatedOverlayStyle, styles.absolute]}>
                    <BlurView
                        style={styles.absolute}
                        blurType="light"
                        blurAmount={4}
                        reducedTransparencyFallbackColor="rgba(255,255,255,.5)"
                    />
                </Animated.View>
            )}
            <Animated.View style={[animatedDrawerStyle, styles.absolute]}>
                <View style={styles.inner}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={styles.button}>
                            <TouchableOpacity
                                onPress={() => setDrawerOpen(false)}
                            >
                                <Icon
                                    name={'close'}
                                    size={38}
                                    color="white"
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>Following</Text>
                        <FlatList
                            data={Array.from(Array(20).keys())}
                            renderItem={({ item }) => (
                                <FollowCard username={item.toString()} />
                            )}
                        />
                    </SafeAreaView>
                </View>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    inner: {
        flex: 1,
        width: '66.666%',
        backgroundColor: 'rgba(255,255,255,.85)',
        padding: sizes.containerPadding,
        paddingTop: Platform.OS === 'ios' ? 0 : sizes.containerPadding
    },
    button: {
        width: 38,
        height: 38,
        alignSelf: 'flex-end',
        overflow: 'hidden'
    },
    icon: {
        color: colors.gray
    },
    title: {
        fontWeight: '900',
        fontSize: 18,
        marginBottom: sizes.containerPadding,
        textAlign: 'center'
    }
});
