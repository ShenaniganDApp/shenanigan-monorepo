import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Animated, Easing, StyleSheet } from 'react-native';

const LoadingSpinner = () => {
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
                ...styles.loading,
                transform: [{ rotate: spin }]
            }}
        >
            <Icon
                name="loading"
                size={60}
                color="white"
                style={styles.loadingIcon}
            />
        </Animated.View>
    );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingIcon: {
        textShadowColor: 'rgba(0,0,0,.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3,
        zIndex: 4
    }
});
