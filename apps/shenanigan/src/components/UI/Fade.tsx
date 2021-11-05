import React, { ReactElement, ReactNode, useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS
} from 'react-native-reanimated';

type Props = ViewProps & {
    children: ReactNode;
    event: boolean;
    up?: boolean;
    down?: boolean;
    afterAnimationOut?: () => void;
    duration?: number;
    distance?: number;
    style?: any;
};

const Fade = ({
    children,
    event,
    afterAnimationOut,
    duration = 350,
    distance = 10,
    down,
    up,
    style,
    ...rest
}: Props): ReactElement => {
    const startPosition = !up && !down ? 0 : down ? distance * -1 : distance;
    const moveAnimation = useSharedValue(startPosition);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (event) {
            opacity.value = 1;
            moveAnimation.value = 0;
        } else {
            opacity.value = 0;
            moveAnimation.value = startPosition;
        }
    }, [event]);

    const animationOptions = {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    };

    const animationOut = () => {
        if (afterAnimationOut && !event) {
            afterAnimationOut();
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: withTiming(
                        moveAnimation.value,
                        animationOptions
                    )
                }
            ],
            opacity: withTiming(
                opacity.value,
                animationOptions,
                runOnJS(animationOut)
            )
        };
    });

    return (
        <Animated.View style={[animatedStyle, style]} {...rest}>
            {children}
        </Animated.View>
    );
};

export default Fade;
