import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Button, sizes, Title } from '../UI';

type Props = {};

export const SellConfirmModal = (props: Props): ReactElement => {
    const [number, onChangeNumber] = useState('1');

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Review and Confirm</Title>
            <View style={styles.row}>
                <Text style={styles.label}>Quantity:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeNumber}
                    value={number}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Unit Price:</Text>
                <Text style={styles.textLarge}>
                    99,999<Text style={styles.small}> xDai</Text>
                </Text>
            </View>

            <Button
                title="List This Card"
                fullWidth
                onPress={() => console.log('list')}
                style={styles.button}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '6%',
        paddingTop: '2%',
        paddingBottom: '10%'
    },
    title: {
        color: 'rgba(0,0,0,.7)',
        textAlign: 'center',
        marginBottom: '2%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: '2%'
    },
    divider: {
        borderTopColor: '#38234A',
        borderTopWidth: 2,
        paddingTop: '2%'
    },
    label: {
        fontSize: 16,
        fontWeight: '500'
    },
    textLarge: {
        fontSize: sizes.smallScreen ? 22 : 24
    },
    textXLarge: {
        fontSize: sizes.smallScreen ? 28 : 30
    },
    small: {
        fontSize: 16
    },
    input: {
        fontSize: sizes.smallScreen ? 22 : 24,
        paddingTop: 0,
        paddingBottom: 0,
        flexBasis: '35%',
        textAlign: 'center'
    },
    button: {
        marginTop: '16%'
    }
});
