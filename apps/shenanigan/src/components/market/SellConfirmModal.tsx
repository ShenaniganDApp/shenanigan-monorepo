import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, sizes, Title } from '../UI';

type Props = {
    quantity: string;
    price: string;
};

export const SellConfirmModal = ({ quantity, price }: Props): ReactElement => {
    return (
        <View style={styles.container}>
            <Title style={styles.title}>Review and Confirm</Title>
            <View style={styles.row}>
                <Text style={styles.label}>Quantity:</Text>
                <Text style={styles.textLarge}>{quantity}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Unit Price:</Text>
                <Text style={styles.textLarge}>
                    {price}
                    <Text style={styles.small}> xDai</Text>
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
    button: {
        marginTop: '16%'
    }
});
