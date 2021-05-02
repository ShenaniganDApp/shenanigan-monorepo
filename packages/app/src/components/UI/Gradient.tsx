import React, { ReactElement, ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import easeGradient from 'react-native-easing-gradient';

type Props = {
    children: ReactNode | ReactNode[];
    style?: ViewStyle;
};

const Gradient = ({ children, style }: Props): ReactElement => {
    const { colors, locations } = easeGradient({
        colorStops: {
            0.02: {
                color: '#03B3FF'
            },
            0.27: {
                color: 'rgba(80, 62, 151, 0.85)'
            },
            0.56: {
                color: 'rgba(223, 45, 113, 0.9)'
            },
            1: {
                color: '#FB7429'
            }
        }
    });

    return (
        <View style={[{ backgroundColor: 'white', flex: 1 }, style]}>
            <LinearGradient
                colors={colors}
                locations={locations}
                style={[{ flex: 1 }, style]}
                useAngle
                angle={220}
            >
                {children}
            </LinearGradient>
        </View>
    );
};

export default Gradient;
