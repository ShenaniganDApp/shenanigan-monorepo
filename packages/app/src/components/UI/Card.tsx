import React, { ReactElement, ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../globalStyles';

interface CardProps {
    children: ReactNode;
    onPress?: () => void;
    isTouchable: boolean;
    transparent: boolean;
    noPadding: boolean;
    borderColor?: string;
}

const Card = ({
    children,
    onPress,
    isTouchable,
    transparent,
    noPadding,
    borderColor
}: CardProps): ReactElement => {
    const conditionalStyles = {
        padding: noPadding ? 0 : 16,
        backgroundColor: transparent ? 'rgba(255,255,255,.3)' : colors.altWhite,
        borderColor: borderColor ? borderColor : 'transparent'
    };

    return isTouchable ? (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={{
                ...styles.card,
                ...conditionalStyles
            }}
        >
            {children}
        </TouchableOpacity>
    ) : (
        <View
            style={{
                ...styles.card,
                ...conditionalStyles
            }}
        >
            {children}
        </View>
    );
};

export default Card;

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        borderWidth: 3
    }
});
