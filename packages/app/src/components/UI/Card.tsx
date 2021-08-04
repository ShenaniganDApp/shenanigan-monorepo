import React, { ReactElement, ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { colors, sizes } from './';

interface Props {
    children: ReactNode | ReactNode[];
    onPress?: () => void;
    glass?: boolean;
    noPadding?: boolean;
    style?: ViewStyle | ViewStyle[];
}

const Card = ({
    glass,
    noPadding,
    children,
    onPress,
    style
}: Props): ReactElement => {
    const content = (
        <View style={[styles.overflow]}>
            {glass && (
                <>
                    <BlurView
                        style={styles.absolute}
                        blurType="light"
                        blurAmount={4}
                        reducedTransparencyFallbackColor="rgba(255,255,255,.5)"
                    />

                    <View style={[styles.absolute, styles.overlay]} />
                </>
            )}

            <View
                style={{
                    padding: noPadding ? 0 : sizes.containerPadding,
                    flexGrow: 1
                }}
            >
                {children}
            </View>
        </View>
    );
    const wrapperStyles = [
        styles.shadow,
        { backgroundColor: glass ? 'transparent' : colors.altWhite },
        style
    ];

    return onPress ? (
        <TouchableOpacity
            style={[wrapperStyles, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {content}
        </TouchableOpacity>
    ) : (
        <View style={[wrapperStyles, style]}>{content}</View>
    );
};

export default Card;

const styles = StyleSheet.create({
    shadow: {
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    overflow: {
        borderRadius: 10,
        overflow: 'hidden',
        flexGrow: 1
    },
    overlay: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.7)',
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,.2)'
    }
});
