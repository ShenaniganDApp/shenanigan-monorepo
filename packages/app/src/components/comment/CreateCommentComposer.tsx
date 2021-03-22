import React, { useState } from 'react';
import { graphql } from 'react-relay';
import {
    TextInput,
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    Text
} from 'react-native';
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
import { Blockie } from '../Web3';
import { Card, RoundButton } from '../UI';

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
    const username = me.username.substr(0, 4) + '...' + me.username.substr(-4);
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
            keyboardVerticalOffset={48}
            style={styles.container}
        >
            <Card style={styles.commentTypes} shadowColor="rgba(0,0,0,.3)">
                <View style={styles.comment}>
                    <View style={styles.image}>
                        <Blockie address={me.addresses[0]} size={8} scale={4} />
                    </View>
                    <View style={styles.text}>
                        <Text style={styles.name}>{username}</Text>
                        <TextInput
                            placeholder="Your Message"
                            value={content}
                            onChangeText={(value) => setContent(value)}
                            style={styles.input}
                            placeholderTextColor="#738080"
                            multiline={true}
                            numberOfLines={1}
                        />
                    </View>
                    <RoundButton
                        icon="send"
                        small
                        iconStyle={{ marginRight: -3 }}
                        onPress={handleCreateComment}
                        disabled={content.trim() === ''}
                        style={{
                            ...styles.sendButton,
                            opacity: content.trim() === '' ? 0.5 : 1
                        }}
                    />
                </View>
            </Card>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 6,
        paddingTop: 12
    },
    commentTypes: {
        padding: 6,
        marginBottom: 5
    },
    comment: {
        flexDirection: 'row',
        borderRadius: 6
    },
    image: {
        marginTop: 4,
        marginRight: 4
    },
    text: {
        marginLeft: 10,
        flex: 1
    },
    name: {
        color: '#215757',
        fontWeight: 'bold',
        marginBottom: 6
    },
    input: {
        color: '#2d3636'
    },
    sendButton: {
        alignSelf: 'center',
        marginLeft: 16
    }
});
