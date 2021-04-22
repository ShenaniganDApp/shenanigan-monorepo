import React, { ReactElement, ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
    children: ReactNode | ReactNode[];
    style?: ViewStyle;
};

const Gradient = ({ children, style }: Props): ReactElement => {
    return (
        <LinearGradient
            colors={[
                '#03B3FF',
                'rgba(80, 62, 151, 0.85)',
                '#rgba(223, 45, 113, 0.9)',
                '#FB7429'
            ]}
            locations={[0.05, 0.27, 0.56, 1]}
            style={[{ flex: 1 }, style]}
            useAngle
            angle={220}
        >
            {children}
        </LinearGradient>
    );
};

export default Gradient;
