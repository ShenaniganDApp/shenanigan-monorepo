import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { graphql, useFragment } from 'relay-hooks';
import { CommentList } from './CommentList';
import { CreateCommentComposer } from './CreateCommentComposer';
import { ChatProps as Props } from '../../Navigator';
import { Comments_me$key } from './__generated__/Comments_me.graphql';
import { useCommentAddedSubscription } from '../../hooks/useCommentAddedSubscription';
import { Comments_liveChallenge$key } from './__generated__/Comments_liveChallenge.graphql';
import { ChatHeader } from './ChatHeader';

export const Comments = (props: Props): React.ReactElement => {
    const [inputVisible, setInputVisible] = useState(false);
    const [animation, setAnimation] = useState(false);

    const handlePress = () => {
        setAnimation(!animation);
        if (!inputVisible) {
            setInputVisible(true);
        }
    };

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
        <View style={{ flex: 1 }}>
            <ChatHeader />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
                keyboardVerticalOffset={48}
                contentContainerStyle={{ flex: 1 }}
                style={{ flex: 1 }}
            >
                <CommentList
                    query={props.commentsQuery}
                    chatScroll={props.chatScroll}
                />

                <CreateCommentComposer me={me} liveChallenge={liveChallenge} />
            </KeyboardAvoidingView>
        </View>
    );
};
