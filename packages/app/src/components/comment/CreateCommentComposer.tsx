import React, { useState } from 'react';
import { graphql } from 'react-relay';
import {
    Button,
    TextInput,
    StyleSheet,
    View,
    Text,
    TouchableHighlight
} from 'react-native';
import { useFragment, useMutation } from 'relay-hooks';
import { ROOT_ID } from 'relay-runtime';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
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
        const input = {
            content,
            challengeId: liveChallenge ? liveChallenge._id : ''
        };

        const onError = () => {
            console.log('onErrorCreateComment');
        };
        const config = {
            variables: {
                input
            },
            updater: updater(ROOT_ID),
            optimisticUpdater: optimisticUpdater(input, me),
            onCompleted: () => {
                setContent('');
            }
        };

        createComment(config);
    };
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="content"
                value={content}
                onChangeText={(value) => setContent(value)}
                style={styles.input}
                placeholderTextColor="#ccc"
                multiline={true}
                numberOfLines={2}
            />

            {console.log('icons: ', <EvilIcons name="bell" />)}
            <EvilIcons name="bell" />

            {/* <TouchableHighlight
                onPress={handleCreateComment}
                disabled={content.trim() === ''}
                style={styles.sendContainer}
            >

            </TouchableHighlight> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#111',
        // position: 'relative',
        // justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        backgroundColor: '#333',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 12,
        borderRadius: 20,
        color: 'white',
        maxHeight: 86,
        overflow: 'hidden',
        flex: 1
    },
    sendContainer: {
        backgroundColor: 'lightblue',
        // position: 'absolute',
        height: 36,
        width: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderRadius: 18
        // right: 16
        // top: 15
    }
});
