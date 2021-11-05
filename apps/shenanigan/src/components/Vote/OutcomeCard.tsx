import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Card, Notch, Button, sizes, colors } from '../UI';

type Props = {
    positive?: boolean;
    votesToFlip?: number;
    title: string;
    description: string;
};

export const OutcomeCard = ({
    positive,
    votesToFlip,
    description,
    title
}: Props): ReactElement => {
    return (
        <Card noPadding style={styles.card}>
            <Notch
                title={title}
                pink={positive}
                gradient
                style={[
                    styles.notch,
                    {
                        alignSelf: positive ? 'flex-start' : 'flex-end'
                    }
                ]}
            />
            <View style={styles.cardInner}>
                <Text style={styles.description}>{description}</Text>
                {votesToFlip ? (
                    <Text style={[styles.gray, styles.textMd, styles.center]}>
                        {votesToFlip}{' '}
                        <Text style={styles.textSm}>votes to flip</Text>
                    </Text>
                ) : (
                    <Text style={[styles.pink, styles.textMd, styles.center]}>
                        Leading Outcome
                    </Text>
                )}
                <Button title="VOTE" style={styles.button} />
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: '8%'
    },
    notch: {
        position: 'relative'
    },
    cardInner: {
        padding: sizes.containerPadding
    },
    description: {
        marginBottom: '4%'
    },
    center: {
        textAlign: 'center'
    },
    pink: {
        color: colors.pink
    },
    gray: {
        color: colors.gray
    },
    textMd: {
        fontSize: 24,
        fontWeight: '700'
    },
    textSm: {
        fontSize: 18,
        fontWeight: '700'
    },
    button: {
        marginTop: '2%'
    }
});
