import React, { ReactElement } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    onPress: () => void;
};

export const FollowListButton = (props: Props): ReactElement => {
    return (
        <TouchableOpacity onPress={props.onPress} style={styles.container}>
            <Icon name={'menu'} size={28} color="black" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: 'black',
        shadowOpacity: 0.4,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 4,
        elevation: 3
    }
});
