import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../UI';

type Props = {};

export const PreviousChallenges = (props: Props): ReactElement => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Previous Challenges</Text>
            <View style={styles.divider} />
            <View style={styles.challengeContainer}>
                <View style={styles.challenge} />
                <View style={styles.challenge} />
                <View style={styles.challenge} />
                <View style={styles.challenge} />
                <View style={styles.challenge} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    divider: {
        width: '50%',
        height: 2,
        backgroundColor: colors.green,
        alignSelf: 'center',
        marginVertical: 16
    },
    challengeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    challenge: {
        minWidth: 70,
        height: 130,
        flexBasis: '23%',
        backgroundColor: '#333',
        borderRadius: 10,
        marginBottom: 10
    }
});
