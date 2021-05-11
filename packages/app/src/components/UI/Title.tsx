import React, { ReactElement } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { sizes } from './';

type Props = {
    children: string;
    size?: number;
    shadow?: boolean;
    style?: TextStyle;
};

const Title = ({ children, size, shadow, style }: Props): ReactElement => {
    return (
        <Text
            style={[
                styles.title,
                {
                    fontSize: size ? size : sizes.smallScreen ? 28 : 32,
                    textShadowColor: shadow
                        ? 'rgba(0, 0, 0, 0.3)'
                        : 'rgba(0, 0, 0, 0)'
                },
                style
            ]}
        >
            {children}
        </Text>
    );
};

export default Title;

const styles = StyleSheet.create({
    title: {
        color: 'white',
        fontWeight: '900',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 5,
        fontFamily: 'impact'
    }
});
