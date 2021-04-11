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
            colors={['#03B3FF', '#38234A', '#DF2D71', '#FB7429']}
            locations={[0.09, 0.25, 0.65, 1]}
            style={[{ flex: 1 }, style]}
            useAngle
            angle={202}
        >
            {children}
        </LinearGradient>
    );
};

export default Gradient;
