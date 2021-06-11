import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Card, colors } from '../UI';
import Blockie from '../Web3/Blockie';
import { graphql, useFragment } from 'relay-hooks';
import { ChatComment_comment$key } from './__generated__/ChatComment_comment.graphql';

type Props = {
    comment: ChatComment_comment$key;
};

export const ChatComment = (props: Props): ReactElement => {
    // @TODO handle possible null
    const comment = useFragment<ChatComment_comment$key>(
        graphql`
            fragment ChatComment_comment on Comment {
                _id
                content
                creator {
                    id
                    username
                    addresses
                }
            }
        `,
        props.comment
    );

    const username =
        comment.creator.username.substr(0, 4) +
        '...' +
        comment.creator.username.substr(-4);

    return (
        <Card style={styles.card} noPadding>
            <View style={styles.cardInner}>
                <View>
                    <Blockie
                        address={comment.creator.addresses[0]}
                        size={8}
                        scale={4}
                    />
                </View>
                <View style={styles.text}>
                    <Text style={styles.message}>
                        <Text style={styles.name}>{username}: </Text>
                        {comment.content}
                    </Text>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: '4%',
        padding: '3%'
    },
    cardInner: {
        flexDirection: 'row'
    },
    text: {
        marginLeft: '3%',
        marginTop: 5,
        flex: 1
    },
    name: {
        color: '#215757',
        fontWeight: 'bold'
    },
    message: {
        color: colors.grayMedium,
        lineHeight: 20,
        fontWeight: '500'
    }
});
