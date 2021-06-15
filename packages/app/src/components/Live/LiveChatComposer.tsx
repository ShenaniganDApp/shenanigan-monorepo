import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Blockies from '../Web3/Blockie';

import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { graphql, useFragment, useMutation } from 'relay-hooks';
import { CreateCommentMutation } from '../comment/mutations/__generated__/CreateCommentMutation.graphql';
import {
    CreateComment,
    optimisticUpdater,
    updater
} from '../comment/mutations/CreateCommentMutation';
import { LiveChatComposer_liveChallenge$key } from './__generated__/LiveChatComposer_liveChallenge.graphql';
import { LiveChatComposer_me$key } from './__generated__/LiveChatComposer_me.graphql';
import { colors, RoundButton } from '../UI';

type Props = {
    image: string;
    me: LiveChatComposer_me$key;
    liveChallenge: LiveChatComposer_liveChallenge$key;
};

export const LiveChatComposer = (props: Props) => {
    const [content, setContent] = useState('');
    const [createComment, { loading }] = useMutation<CreateCommentMutation>(
        CreateComment
    );

    const liveChallenge = useFragment<LiveChatComposer_liveChallenge$key>(
        graphql`
            fragment LiveChatComposer_liveChallenge on Challenge {
                id
                _id
                creator {
                    id
                }
            }
        `,
        props.liveChallenge
    );

    const me = useFragment<LiveChatComposer_me$key>(
        graphql`
            fragment LiveChatComposer_me on User {
                id
                username
            }
        `,
        props.me
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
        <View style={styles.inputContainer}>
            <View style={styles.image}>
                <Blockies address={props.image} size={8} scale={4} />
            </View>
            <TextInput
                style={styles.input}
                value={content}
                onChangeText={(text) => setContent(text)}
                placeholder="Type your message..."
                placeholderTextColor="#ddd"
                keyboardType="default"
                multiline={true}
                numberOfLines={1}
            />
            <RoundButton
                disabled={!(content.length > 0)}
                onPress={handleCreateComment}
                icon="send"
                iconSize={32}
                style={{ width: 46, height: 46 }}
                iconStyle={{ marginRight: -4 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 0
    },
    input: {
        color: 'white',
        paddingTop: 6,
        flex: 1,
        marginRight: 12,
        backgroundColor: 'rgba(60,60,60,.25)',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        fontSize: 16,
        maxHeight: 80
    },
    submit: {
        backgroundColor: 'rgba(150,150,150, .4)',
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        marginRight: 12
    }
});
