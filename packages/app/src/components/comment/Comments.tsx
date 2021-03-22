import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { graphql, useFragment } from 'relay-hooks';

import { CommentList } from './CommentList';
import { CreateCommentComposer } from './CreateCommentComposer';
import { ChatProps as Props } from '../../Navigator';
import { Comments_me$key } from './__generated__/Comments_me.graphql';
import { useCommentAddedSubscription } from '../../hooks/useCommentAddedSubscription';
import { Comments_liveChallenge$key } from './__generated__/Comments_liveChallenge.graphql';

import { Card, colors } from '../UI';
import { Blockie } from '../Web3';

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
        <View style={styles.container}>
            <View style={styles.header}>
                <Card
                    bgColor="#FCFBC1"
                    shadowColor="rgba(0,0,0,.2)"
                    style={styles.card}
                >
                    <Text style={styles.title}>Top Donators:</Text>
                    <View style={styles.topContainer}>
                        {[1, 2, 3].map((n, i) => (
                            <View
                                style={[
                                    styles.topImageBg,
                                    { transform: [{ translateX: -10 * i }] }
                                ]}
                                key={i}
                            >
                                <Blockie
                                    address={
                                        '0x9d69631bdeeB04bAC2AC64C2C96aDD63079CB1f' +
                                        n
                                    }
                                    size={10}
                                    scale={4}
                                />
                            </View>
                        ))}
                    </View>
                </Card>
            </View>
            <View style={styles.listContainer}>
                <CommentList
                    query={props.commentsQuery}
                    chatScroll={props.chatScroll}
                    setWalletScroll={props.setWalletScroll}
                />
            </View>

            <CreateCommentComposer me={me} liveChallenge={liveChallenge} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        padding: 16
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        textTransform: 'uppercase',
        marginRight: 16
    },
    topContainer: {
        flexDirection: 'row'
    },
    topImageBg: {
        padding: 3,
        backgroundColor: '#F0F0F0',
        borderRadius: 6,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 3,
        elevation: 2
    },
    listContainer: {
        backgroundColor: colors.altWhite,
        marginHorizontal: 16,
        borderRadius: 6,
        flex: 1,
        flexGrow: 1
    }
});
