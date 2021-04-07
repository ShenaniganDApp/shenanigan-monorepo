import React, { ReactElement, ReactNode } from 'react';
import { Text, View, StyleSheet } from 'react-native';

type Props = {
    children: ReactNode;
    size?: number;
    shadow?: boolean;
};

const Title = ({ children, size, shadow }: Props): ReactElement => {
    return (
        <View style={styles.container}>
            <Text
                style={{
                    ...styles.title,
                    fontSize: size ? size : 44,
                    textShadowColor: shadow
                        ? 'rgba(0, 0, 0, 0.3)'
                        : 'rgba(0, 0, 0, 0)'
                }}
            >
                {children}
            </Text>
        </View>
    );
};

export default Title;

const styles = StyleSheet.create({
    container: {},
    title: {
        fontSize: 32,
        color: 'white',
        fontWeight: '900',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 5
    }
});
