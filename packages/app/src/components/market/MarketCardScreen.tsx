import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';

type Props = {};

export const MarketCardScreen = (props: Props): ReactElement => {
    return (
        <View style={styles.container}>
            <Text>CardScreen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});
