import React, { useState } from 'react';
import { graphql } from 'react-relay';
import {
    TextInput,
    StyleSheet,
    View,
    TouchableHighlight,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useFragment, useMutation } from 'relay-hooks';
import { ROOT_ID } from 'relay-runtime';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
            updater: updater(),
            optimisticUpdater: optimisticUpdater(input, me),
            onCompleted: () => {
                setContent('');
            }
        };

        createComment(config);
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
            keyboardVerticalOffset={48}
        >
            <View style={styles.container}>
                <TextInput
                    placeholder="Message"
                    value={content}
                    onChangeText={(value) => setContent(value)}
                    style={styles.input}
                    placeholderTextColor="#ccc"
                    multiline={true}
                    numberOfLines={1}
                />

                <TouchableHighlight
                    onPress={handleCreateComment}
                    disabled={content.trim() === ''}
                    style={{
                        ...styles.sendContainer,
                        opacity: content.trim() === '' ? 0.3 : 1
                    }}
                >
                    <Icon
                        name="send"
                        size={20}
                        color="#121212"
                        style={styles.icon}
                    />
                </TouchableHighlight>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#121212',
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
        height: 36,
        width: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderRadius: 18
    },
    icon: {
        marginRight: -3
    }
});
