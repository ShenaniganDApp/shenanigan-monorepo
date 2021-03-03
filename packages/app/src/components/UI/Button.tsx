import React, { ReactElement } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from './globalStyles';

interface Props {
    color?: string;
    onPress: () => void;
    small?: boolean;
    shadow?: boolean;
    title: string;
}

const Button = ({
    color,
    small,
    shadow,
    title,
    onPress
}: Props): ReactElement => {
    return (
        <TouchableOpacity
            style={{
                ...styles.button,
                borderColor: color ? color : colors.pink,
                shadowOpacity: shadow ? 0.3 : 0,
                padding: small ? 10 : 14,
                maxWidth: small ? 180 : 200
            }}
            onPress={onPress}
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
        backgroundColor: colors.altWhite,
        padding: 14,
        width: '100%',
        maxWidth: 200,
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
