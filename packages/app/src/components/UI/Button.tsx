import React, { ReactElement } from 'react';
import {
    TouchableOpacity,
    ViewStyle,
    Text,
    StyleSheet,
    TouchableOpacityProps
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
                ...styles.button,
                backgroundColor: bgColor ? bgColor : colors.altWhite,
                borderColor: color ? color : colors.pink,
                shadowOpacity: shadow ? 0.3 : 0,
                padding: small ? 10 : 14,
                minWidth: small ? 150 : 200,
                opacity: disabled ? 0.4 : 1,
                ...style
            }}
            activeOpacity={0.8}
        >
            <Text
                style={{
                    ...styles.text,
                    color: color ? color : colors.pink
                }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        borderWidth: 2,
        // width: '100%',
        // maxWidth: 200,
        borderRadius: 10,
        shadowColor: '#000',
        alignSelf: 'center',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 2,

        elevation: 3
    },
    text: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16
    }
});
