import React, { ReactElement } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { graphql, useQuery } from 'relay-hooks';

import { LineupQuery } from './__generated__/LineupQuery.graphql';
import { LineupList } from './LineupList';
import { LineupProps as Props } from '../../Navigator';
import { useFragment } from 'react-relay';
import { Lineup_me$key } from './__generated__/Lineup_me.graphql';

const query = graphql`
    query LineupQuery {
        ...LineupList_query
    }
`;

export const Lineup = (props: Props): ReactElement => {
    // @TODO handle error
    const { props: data, retry } = useQuery<LineupQuery>(query);

    const me = useFragment<Lineup_me$key>(
        graphql`
            fragment Lineup_me on User {
                ...LineupList_me
            }
        `,
        props.route.params.me
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.background}>
                {data ? (
                    <LineupList query={data} me={me} />
                ) : (
                    <Button title="Retry" onPress={retry} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        padding: 15
    }
});
