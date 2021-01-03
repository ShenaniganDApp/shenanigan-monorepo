import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { graphql, useQuery } from 'relay-hooks';

import { CommentsQuery } from './__generated__/CommentsQuery.graphql';
import { CommentList } from './CommentList';

const styles = StyleSheet.create({
    background: { backgroundColor: '#e6ffff' }
});

const query = graphql`
    query CommentsQuery {
        ...CommentList_query
    }
`;

export const Comments = (): React.ReactElement => {
    // @TODO handle error
    const { props: data, retry } = useQuery<CommentsQuery>(query);
    return data ? (
        <View style={styles.background}>
            <CommentList query={data} />
        </View>
    ) : (
        <Button title="Retry" onPress={retry} />
    );
};
