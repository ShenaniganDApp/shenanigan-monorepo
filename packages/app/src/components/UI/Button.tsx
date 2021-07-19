import React, { ReactElement } from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacityProps,
    TextStyle
} from 'react-native';
import { colors, sizes } from './';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = TouchableOpacityProps & {
    color?: 'orange' | 'gray';
    fullWidth?: boolean;
    title: string;
    textStyle?: TextStyle;
};

const Button = ({
    title,
    color,
    fullWidth,
    style,
    textStyle,
    disabled,
    ...rest
}: Props): ReactElement => {
    const backgroundColor = !color
        ? colors.pink
        : color === 'gray'
        ? colors.gray
        : colors.orange;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: disabled ? '#d1d1d1' : backgroundColor,
                    width: fullWidth ? '100%' : 'auto'
                },
                style
            ]}
            activeOpacity={0.7}
            disabled={disabled}
            {...rest}
        >
            <Text
                style={[
                    styles.text,
                    {
                        color: disabled ? '#ECECEC' : 'white'
                    },
                    textStyle
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 10,
        elevation: 8,
        borderRadius: 6,
        alignSelf: 'center',
        paddingVertical: 4,
        paddingHorizontal: sizes.smallScreen ? 20 : 36
    },
    text: {
        fontWeight: '900',
        fontFamily: 'impact',
        textAlign: 'center',
        fontSize: sizes.smallScreen ? 20 : 24,
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 5 },
        textShadowRadius: 5
    }
});
