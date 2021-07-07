import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Gradient } from '../UI';

type Props = {};

export const MarketListings = (props: Props): ReactElement => {
    return (
        <Gradient>
            <View style={styles.container}>
                <Text>component</Text>
            </View>
        </Gradient>
    );
};

const styles = StyleSheet.create({
    container: {}
});
