import React, { ReactElement } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { graphql, useQuery } from 'relay-hooks';

import { LineupQuery } from './__generated__/LineupQuery.graphql';
import { LineupList } from './LineupList';
import { LineupProps as Props } from '../../Navigator';
import { SafeAreaView } from 'react-native-safe-area-context';

const query = graphql`
    query LineupQuery {
        ...LineupList_query
    }
`;

export const Lineup = (props: Props): ReactElement => {
    // @TODO handle error
    const { props: data, retry } = useQuery<LineupQuery>(query);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.background}>
                {data ? (
                    <LineupList query={data} />
                ) : (
                    <Button title="Retry" onPress={retry} />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        padding: 15
    }
});
