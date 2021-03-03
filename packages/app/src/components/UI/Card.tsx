import React, { ReactElement, ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from './globalStyles';

interface Props {
    children: ReactNode;
    onPress?: () => void;
    isTouchable?: boolean;
    transparent?: boolean;
    noPadding?: boolean;
    color?: string;
    bgColor?: string;
    shadowColor?: string;
    style?: object;
}

const Card = ({
    children,
    onPress,
    transparent,
    noPadding,
    color,
    bgColor,
    shadowColor,
    style
}: Props): ReactElement => {
    const conditionalStyles = {
        padding: noPadding ? 0 : 16,
        backgroundColor: transparent
            ? 'rgba(255,255,255,.5)'
            : bgColor
            ? bgColor
            : colors.altWhite,
        borderColor: color ? color : 'transparent',
        shadowColor: shadowColor ? shadowColor : 'transparent',
        shadowOpacity: shadowColor ? 0.7 : 0
    };

    return onPress ? (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[styles.card, conditionalStyles, style]}
        >
            {children}
        </TouchableOpacity>
    ) : (
        <View style={[styles.card, conditionalStyles, style]}>{children}</View>
    );
};

export default Card;

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        borderWidth: 3,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 4,
        elevation: 3
    }
});
