import React, { ReactElement } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, sizes } from '../UI';

type Props = {
    onPress: () => void;
};

export const FollowListButton = (props: Props): ReactElement => {
    return (
        <TouchableOpacity onPress={props.onPress} style={styles.container}>
            <Icon
                name={'menu'}
                size={sizes.smallScreen ? 42 : 48}
                color={colors.altWhite}
                style={styles.button}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 4
    },
    button: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 5
    }
});
