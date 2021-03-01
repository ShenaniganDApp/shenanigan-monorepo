import React, { ReactElement, ReactNode, useState } from 'react';
import { Animated } from 'react-native';

interface Props {
    children: ReactNode;
    event: boolean;
    up?: boolean;
    down?: boolean;
    afterAnimationOut?: () => void;
    duration?: number;
    distance?: number;
    style?: any;
}

const Fade = ({
    children,
    event,
    afterAnimationOut,
    duration = 200,
    distance = 10,
    down,
    up,
    style
}: Props): ReactElement => {
    const startPosition = down ? distance * -1 : distance;
    const [fadeAnimation] = useState(() => new Animated.Value(0));
    const [moveAnimation] = useState(() => new Animated.Value(startPosition));

    const fade = (toValue: number, onOut?: boolean) => {
        Animated.timing(fadeAnimation, {
            toValue,
            duration: duration,
            useNativeDriver: true
        }).start(() => onOut && afterAnimationOut && afterAnimationOut());
    };

    const move = (toValue: number) => {
        Animated.timing(moveAnimation, {
            toValue,
            duration: duration,
            useNativeDriver: true
        }).start();
    };

    if (event) {
        fade(1);
        if (up || down) move(0);
    } else {
        fade(0, true);
        if (up || down) move(startPosition);
    }
    return (
        <Animated.View
            style={{
                opacity: fadeAnimation,
                transform: [{ translateY: up || down ? moveAnimation : 0 }],
                ...style
            }}
        >
            {children}
        </Animated.View>
    );
};

export default Fade;
