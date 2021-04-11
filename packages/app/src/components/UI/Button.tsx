import React, { ReactElement } from 'react';
import {
    TouchableOpacity,
    ViewStyle,
    Text,
    StyleSheet,
    TouchableOpacityProps,
    View,
    TextStyle
} from 'react-native';
import { colors } from './globalStyles';

type Props = TouchableOpacityProps & {
    color?: 'orange' | 'gray';
    disabled?: boolean;
    fullWidth?: boolean;
    title: string;
    style?: ViewStyle;
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
                    backgroundColor: disabled
                        ? 'rgba(196,196,196,0.35)'
                        : backgroundColor,
                    width: fullWidth ? '100%' : 'auto'
                },
                style
            ]}
            activeOpacity={0.7}
            {...rest}
        >
            <View
                style={[
                    styles.buttonInner,
                    {
                        backgroundColor: disabled
                            ? 'rgba(196,196,196,0.35)'
                            : backgroundColor
                    }
                ]}
            >
                <Text
                    style={[
                        styles.text,
                        {
                            color: disabled ? '#E5E5E5' : 'white'
                        },
                        textStyle
                    ]}
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
        elevation: 3
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
