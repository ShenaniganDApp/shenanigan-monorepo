import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import { graphql, useQuery } from 'relay-hooks';
import { CommentList } from './CommentList';
import { CommentsQuery } from './__generated__/CommentsQuery.graphql';

const styles = StyleSheet.create({
    background: { backgroundColor: '#e6ffff' }
});

const query = graphql`
    query CommentsQuery {
        ...CommentList_query
    }
`;

export const Comments = (): React.ReactElement => {
    //@TODO handle error and retry
    const { props: data } = useQuery<CommentsQuery>(query);
    return data ? (
        <View style={styles.background}>
            <CommentList query={data} />
        </View>
    ) : (
        <Text> Loading...</Text>
    );
};