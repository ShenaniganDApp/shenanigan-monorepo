import React, { ReactElement, ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
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
    style?: ViewStyle;
}

const Card = ({
    children,
    onPress,
    transparent,
    noPadding,
    color,
    bgColor,
    shadowColor,
    shadow,
    style
}: Props): ReactElement => {
    const conditionalStyles = {
        padding: noPadding ? 0 : 16,
        backgroundColor: transparent
            ? 'rgba(255,255,255,.3)'
            : bgColor
            ? bgColor
            : colors.altWhite,
        borderColor: transparent
            ? 'rgba(251,250,250, .7)'
            : color
            ? color
            : 'transparent',
        shadowOpacity: shadow ? 0.25 : 0
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
        borderWidth: 1,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: 10,
        elevation: 3
    }
});
