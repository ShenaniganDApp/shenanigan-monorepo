import React, { ReactElement } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Card, Button, colors } from '../UI';

type Props = {};

export const GasCard = (props: Props): ReactElement => {
    return (
        <Card style={styles.text}>
            <View style={styles.inner}>
                <Text style={styles.text}>
                    If your transactions aren’t going through, you might need
                    some xDai. xDai is the fuel that powers your Particles, but
                    a little goes a long way. Once per day, you can hit the
                    button below, and we’ll fuel you up, free of charge.
                </Text>
                <Button
                    title="Receive 0.01 xDai"
                    onPress={() => console.log('faucet')}
                />
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    inner: {
        padding: 8
    },
    text: {
        fontSize: 16,
        color: colors.grayDark,
        marginBottom: 24,
        lineHeight: 22
    }
});
