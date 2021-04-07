import React, { ReactElement } from 'react';
import {
    TouchableOpacity,
    ViewStyle,
    Text,
    StyleSheet,
    TouchableOpacityProps,
    View
} from 'react-native';
import { colors } from './globalStyles';

type Props = TouchableOpacityProps & {
    color?: string;
    bgColor?: string;
    small?: boolean;
    shadow?: boolean;
    title: string;
    style?: ViewStyle;
};

const Button = (props: Props): ReactElement => {
    const { color, bgColor, small, shadow, title, style, disabled } = props;
    return (
        <TouchableOpacity
            {...props}
            style={{
                ...styles.button
            }}
            activeOpacity={0.8}
        >
            <View style={styles.buttonInner}>
                <Text
                    style={{
                        ...styles.text
                    }}
                >
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.pink,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 10,
        elevation: 3,
        borderRadius: 6,
        alignSelf: 'center'
    },
    buttonInner: {
        borderRadius: 6,
        paddingHorizontal: 36,
        paddingVertical: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 5,
        elevation: 3,
        backgroundColor: colors.pink
    },
    text: {
        fontWeight: '900',
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 5 },
        textShadowRadius: 5
    }
});
