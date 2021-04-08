import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Card } from '../UI';

type Props = {};

export const ButtonNav = (props: Props): ReactElement => {
    const cards = ['current challenge', 'challenge history', 'card collection'];
    return (
        <View style={styles.container}>
            {cards.map((card) => (
                <Card style={styles.card} shadowColor="rgba(0,0,0,.4)">
                    <Text style={styles.cardText}>{card}</Text>
                </Card>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16
    },
    card: {
        padding: 8,
        flexBasis: '30%',
        minHeight: 120,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#333'
    }
});
