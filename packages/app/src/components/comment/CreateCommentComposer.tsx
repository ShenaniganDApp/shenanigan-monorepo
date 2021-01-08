import React, { useState } from 'react';
import { graphql } from 'react-relay';
import { Button, TextInput } from 'react-native';
import { useFragment, useMutation } from 'relay-hooks';
import { ROOT_ID } from 'relay-runtime';

import {
    CreateComment,
    updater,
    optimisticUpdater
} from './mutations/CreateCommentMutation';

import { CreateCommentMutation } from './mutations/__generated__/CreateCommentMutation.graphql';
import { CreateCommentComposer_liveChallenge$key } from './__generated__/CreateCommentComposer_liveChallenge.graphql';
import { CreateCommentComposer_me$key } from './__generated__/CreateCommentComposer_me.graphql';

type Props = {
    liveChallenge: CreateCommentComposer_liveChallenge$key;
    me: CreateCommentComposer_me$key;
};

export function CreateCommentComposer(props: Props) {
    const liveChallenge = useFragment<CreateCommentComposer_liveChallenge$key>(
        graphql`
            fragment CreateCommentComposer_liveChallenge on Challenge {
                id
                _id
                creator {
                    id
                }
            }
        `,
        props.liveChallenge
    );

    const me = useFragment<CreateCommentComposer_me$key>(
        graphql`
            fragment CreateCommentComposer_me on User {
                id
                username
            }
        `,
        props.me
    );

    const [content, setContent] = useState('');

    const [createComment, { loading }] = useMutation<CreateCommentMutation>(
        CreateComment
    );

    const handleCreateComment = () => {
        console.log('liveChallenge: ', liveChallenge);
        const input = {
            content,
            challengeId: liveChallenge._id
        };

        const onError = () => {
            console.log('onErrorCreateComment');
        };
        const config = {
            variables: {
                input
            },
            updater: updater(ROOT_ID),
            optimisticUpdater: optimisticUpdater(liveChallenge.id, input, me),
            onCompleted: () => {
                setContent('');
            }
        };

        createComment(config);
    };
    return (
        <>
            <TextInput
                placeholder="content"
                value={content}
                onChangeText={(value) => setContent(value)}
            />
            <Button
                title="Create"
                onPress={handleCreateComment}
                disabled={content.trim() === ''}
            ></Button>
        </>
    );
}
