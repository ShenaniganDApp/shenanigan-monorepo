import React, { ReactElement, ReactNode, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

interface Props {
    children: ReactNode;
    duration?: number;
}

const FadeIn = ({
    duration = 500,
    children,
    navigation
}: Props): ReactElement => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true
        }).start();
    };

    useEffect(() => {
        const focus = navigation.addListener('focus', () => fadeIn());
        const blur = navigation.addListener('blur', () => fadeAnim.setValue(0));
        return () => {
            blur();
            focus();
        };
    }, [navigation]);

    return (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            {children}
        </Animated.View>
    );
};

export default FadeIn;
