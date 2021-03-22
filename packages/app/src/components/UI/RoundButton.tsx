import React, { ReactElement } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '.';

interface Props {
    style?: ViewStyle;
    onPress: () => void;
}

const RoundButton = ({ style, onPress }: Props): ReactElement => {
    return (
        <TouchableOpacity
            style={[styles.container, { ...(style && style) }]}
            onPress={onPress}
        >
            <Icon name="plus" size={40} color="#121212" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(230, 255, 255, 1)',
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: colors.yellow
    }
});

export default RoundButton;
