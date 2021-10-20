import React, { ReactElement } from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from './globalStyles';

type Props = {
    text: string;
    style?: ViewStyle;
};

const Tag = ({ text, style }: Props): ReactElement => {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.tag}>{text}</Text>
        </View>
    );
};

export default Tag;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.altWhite,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5
    },
    tag: {
        textTransform: 'uppercase',
        color: '#333'
    }
});
