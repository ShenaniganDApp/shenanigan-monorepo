import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { graphql, useFragment, useQuery } from 'relay-hooks';

import { CommentsQuery } from './__generated__/CommentsQuery.graphql';
import { CommentList } from './CommentList';
import { CreateCommentComposer } from './CreateCommentComposer';
import { ChatProps as Props } from '../../Navigator';
import { Comments_me$key } from './__generated__/Comments_me.graphql';
import { useCommentAddedSubscription } from '../../hooks/useCommentAddedSubscription';
import {
    Comments_liveChallenge,
    Comments_liveChallenge$key
} from './__generated__/Comments_liveChallenge.graphql';
const styles = StyleSheet.create({
    background: { backgroundColor: '#e6ffff', flex: 1, paddingTop: 60 }
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
        props.liveChallenge as Comments_liveChallenge$key
    );

    const me = useFragment(
        graphql`
            fragment Comments_me on User {
                ...CreateCommentComposer_me
            }
        `,
        props.me as Comments_me$key
    );

    useCommentAddedSubscription();

    return data ? (
        <View style={styles.background}>
            <CommentList
                query={data}
                chatScroll={props.chatScroll}
                setWalletScroll={props.setWalletScroll}
            />
            <CreateCommentComposer me={me} liveChallenge={liveChallenge} />
        </View>
    ) : (
        <View style={styles.background}>
            <Button title="Retry" onPress={retry} />
        </View>
    );
};
