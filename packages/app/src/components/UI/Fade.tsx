import React, { ReactElement, ReactNode, useState } from 'react';
import { Animated } from 'react-native';

interface Props {
    children: ReactNode;
    event: boolean;
    up?: boolean;
    down?: boolean;
    afterAnimationOut?: (b: boolean) => void;
    duration?: number;
    style?: any;
}

const Fade = ({
    children,
    event,
    afterAnimationOut,
    duration = 200,
    down,
    up,
    style
}: Props): ReactElement => {
    const [fadeAnimation] = useState(() => new Animated.Value(0));
    const [downAnimation] = useState(() => new Animated.Value(-10));
    const [upAnimation] = useState(() => new Animated.Value(10));

    const fade = (toValue, onEnd) => {
        Animated.timing(fadeAnimation, {
            toValue,
            duration: duration,
            useNativeDriver: true
        }).start(() => {
            if (onEnd) {
                onEnd();
            } else {
                return;
            }
        });
    };

    const inDown = (toValue) => {
        Animated.timing(downAnimation, {
            toValue,
            duration: duration,
            useNativeDriver: true
        }).start();
    };

    const inUp = (toValue) => {
        Animated.timing(upAnimation, {
            toValue,
            duration: duration,
            useNativeDriver: true
        }).start();
    };

    if (event) {
        fade(1);
        if (down) inDown(0);
        if (up) inUp(0);
    } else {
        fade(0, afterAnimationOut);
        if (down) inDown(-10);
        if (up) inUp(10);
    }
    return (
        <Animated.View
            style={{
                ...style,
                opacity: fadeAnimation,
                transform: [{ translateY: up ? upAnimation : downAnimation }]
            }}
        >
            {children}
        </Animated.View>
    );
};

export default Fade;
