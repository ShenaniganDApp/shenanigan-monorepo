import React, { ReactElement } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { graphql, useQuery } from 'relay-hooks';

import { LineupQuery } from './__generated__/LineupQuery.graphql';
import { LineupList } from './LineupList';
import { LineupProps as Props } from '../../Navigator';
import LinearGradient from 'react-native-linear-gradient';

const query = graphql`
    query LineupQuery {
        ...LineupList_query
    }
`;

export const Lineup = (props: Props): ReactElement => {
    // @TODO handle error
    const { props: data, retry } = useQuery<LineupQuery>(query);

    return (
        <LinearGradient
            colors={['#FF016D', '#E6FFFF']}
            style={styles.background}
        >
            {data ? (
                <LineupList query={data} />
            ) : (
                <Button title="Retry" onPress={retry} />
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 15
    },
    title: {
        fontWeight: 'bold',
        fontSize: 32,
        textAlign: 'center',
        marginVertical: 12,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10
    }
});
