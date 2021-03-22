import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface Props {}

export const Buttons = (props: Props): ReactElement => {
    return (
        <View style={styles.container}>
            <Text>component</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});
