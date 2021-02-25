import React, { ReactElement } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { graphql, useFragment } from 'relay-hooks';
import Blockies from '../Web3/Blockie';

import { Comment_comment$key } from './__generated__/Comment_comment.graphql';

export const Comment = (props): ReactElement => {
    const comment = useFragment<Comment_comment$key>(
        graphql`
            fragment Comment_comment on Comment {
                id
                content
                creator {
                    username
                    addresses
                }
            }
        `,
        props.comment
    );
    return (
        <View style={styles.message}>
            <View style={styles.image}>
                <Blockies
                    address={comment.creator.addresses[0]}
                    size={8}
                    scale={4}
                />
            </View>
            <View style={styles.messageTextContainer}>
                <Text style={styles.messageText}>{comment.content}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    message: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    image: {
        marginRight: 12
    },
    messageTextContainer: {
        backgroundColor: 'rgba(255,255,255,.3)',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        flex: 1,
        marginRight: 12
    },
    messageText: {
        color: 'white',
        fontSize: 16
    }
});