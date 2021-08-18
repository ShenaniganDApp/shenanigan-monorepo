import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, colors, ImageCard, Title } from '../UI';

type Props = {
    title: string;
    username: string;
    leadingOutcome: string;
    percent: string;
    votesToFlip: number;
    hoursToVote: number;
};

export const ChallengeCard = ({
    title,
    username,
    leadingOutcome,
    percent,
    votesToFlip,
    hoursToVote
}: Props): ReactElement => {
    const { navigate } = useNavigation();

    return (
        <View style={styles.container}>
            <Title size={24} style={styles.center}>
                {title}
            </Title>
            <Text style={[styles.username, styles.textMd, styles.center]}>
                {username}
            </Text>
            <View style={styles.row}>
                <ImageCard
                    height={205}
                    source={{
                        uri:
                            'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                    }}
                />
                <View style={styles.cardContainer}>
                    <Card style={styles.card}>
                        <Title style={[styles.pink, styles.center]} size={45}>
                            {percent}
                            <Title size={30} style={styles.pink}>
                                %
                            </Title>
                        </Title>
                        <Text
                            style={[styles.pink, styles.textMd, styles.center]}
                        >
                            {leadingOutcome}
                        </Text>
                        <Text
                            style={[styles.gray, styles.textMd, styles.center]}
                        >
                            {votesToFlip}{' '}
                            <Text style={styles.textSm}>votes to flip</Text>
                        </Text>
                        <Button
                            title="VOTE"
                            style={styles.button}
                            onPress={() => navigate('Outcome')}
                        />
                        <Text
                            style={[styles.gray, styles.textMd, styles.center]}
                        >
                            {hoursToVote}{' '}
                            <Text style={styles.textSm}>hours to vote</Text>
                        </Text>
                    </Card>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: '10%'
    },
    username: {
        color: 'white',
        marginTop: '1%',
        marginBottom: '4%'
    },
    row: {
        flexDirection: 'row'
    },
    cardContainer: {
        marginLeft: '6%',
        flex: 1
    },
    card: {
        width: '100%'
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
        fontSize: 18,
        fontWeight: '700'
    },
    textSm: {
        fontSize: 14,
        fontWeight: '700'
    },
    button: {
        marginVertical: '4%'
    }
});
