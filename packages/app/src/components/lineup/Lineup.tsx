import React, { ReactElement } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { graphql, useQuery } from 'relay-hooks';

import { LineupQuery } from './__generated__/LineupQuery.graphql';
import { LineupList } from './LineupList';
import { LineupProps as Props } from '../../Navigator';

const styles = StyleSheet.create({
    background: { backgroundColor: '#e6ffff', height: '100%' }
});

const query = graphql`
    query LineupQuery {
        ...LineupList_query
    }
`;

export const Lineup = (props: Props): ReactElement => {
    // @TODO handle error
    const { props: data, retry } = useQuery<LineupQuery>(query);

    return data ? (
        <View style={styles.background}>
            <LineupList query={data} />
        </View>
    ) : (
        <Button title="Retry" onPress={retry} />
    );
};
