import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const StreamControls = (): ReactElement => {
    return (
        <View>
            <Dots />
        </View>
    );
};

const Dots = () => (
    <TouchableOpacity>
        <Icon
            style={styles.icon}
            name="dots-horizontal"
            size={40}
            color="white"
        />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    icon: {
        shadowOffset: { width: 0, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 0.5
    }
});
