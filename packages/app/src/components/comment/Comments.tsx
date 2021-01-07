import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { graphql, useFragment, useQuery } from 'relay-hooks';

import { CommentsQuery } from './__generated__/CommentsQuery.graphql';
import { CommentList } from './CommentList';
import { CreateCommentComposer } from './CreateCommentComposer';
import { CommentsTabProps as Props } from '../../Navigator';

const styles = StyleSheet.create({
    background: { backgroundColor: '#e6ffff', height: '100%' }
});

const query = graphql`
    query CommentsQuery {
        ...CommentList_query
    }
`;

export const Comments = (props: Props): React.ReactElement => {
    // @TODO handle error
    const { props: data, retry } = useQuery<CommentsQuery>(query);
    const liveChallenge = useFragment(
        graphql`
            fragment Comments_liveChallenge on Challenge {
                id
                creator {
                    id
                    username
                }
                ...CreateCommentComposer_liveChallenge
            }
        `,
        props.route.params.liveChallenge
    );
    const me = useFragment(
        graphql`
            fragment Comments_me on User {
                ...CreateCommentComposer_me
            }
        `,
        props.route.params.me
    );
    return data ? (
        <View style={styles.background}>
            <CommentList query={data} />
            <CreateCommentComposer me={me} liveChallenge={liveChallenge} />
        </View>
    ) : (
        <Button title="Retry" onPress={retry} />
    );
};
