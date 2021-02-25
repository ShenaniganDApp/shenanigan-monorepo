import React from 'react';
import { StyleSheet, View } from 'react-native';
import { graphql, useFragment } from 'relay-hooks';

import { CommentList } from './CommentList';
import { CreateCommentComposer } from './CreateCommentComposer';
import { ChatProps as Props } from '../../Navigator';
import { Comments_me$key } from './__generated__/Comments_me.graphql';
import { useCommentAddedSubscription } from '../../hooks/useCommentAddedSubscription';
import { Comments_liveChallenge$key } from './__generated__/Comments_liveChallenge.graphql';

export const Comments = (props: Props): React.ReactElement => {
    // @TODO handle error

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

    return (
        <View style={styles.background}>
            <CommentList
                query={props.commentsQuery}
                chatScroll={props.chatScroll}
                setWalletScroll={props.setWalletScroll}
            />
            <CreateCommentComposer me={me} liveChallenge={liveChallenge} />
        </View>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1 }
});
