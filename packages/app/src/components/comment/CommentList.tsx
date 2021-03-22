import React, { useState } from 'react';
import Blockies from '../Web3/Blockie';
import { graphql } from 'react-relay';
import { usePagination } from 'relay-hooks';
import {
    CommentList_query,
    CommentList_query$key
} from './__generated__/CommentList_query.graphql';
import { CommentListPaginationQueryVariables } from './__generated__/CommentListPaginationQuery.graphql';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from '../UI';
import Blockie from '../Web3/Blockie';

type Props = {
    query: CommentList_query$key;
    chatScroll: boolean;
};

const commentsFragmentSpec = graphql`
    fragment CommentList_query on Query
    @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
    ) {
        comments(first: $count, after: $cursor)
            @connection(key: "CommentList_comments", filters: []) {
            endCursorOffset
            startCursorOffset
            count
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            edges {
                node {
                    _id
                    content
                    creator {
                        id
                        username
                        addresses
                    }
                }
            }
        }
    }
`;

const connectionConfig = {
    getVariables(
        props: CommentList_query,
        { count, cursor }: CommentListPaginationQueryVariables
    ) {
        return {
            count,
            cursor
        };
    },
    query: graphql`
        # Pagination query to be fetched upon calling 'loadMore'.
        # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
        query CommentListPaginationQuery($count: Int!, $cursor: String) {
            ...CommentList_query @arguments(count: $count, cursor: $cursor)
        }
    `
};

export const CommentList = (props: Props): React.ReactElement => {
    const [isFetchingTop, setIsFetchingTop] = useState(false);
    const [
        query,
        { isLoading, hasMore, loadMore, refetchConnection }
    ] = usePagination(commentsFragmentSpec, props.query);
    const { comments } = query;

    const refetchList = () => {
        if (isLoading()) {
            return;
        }
        setIsFetchingTop(true);
        refetchConnection(
            connectionConfig,
            10, // Fetch the next 10 feed items
            (error) => {
                setIsFetchingTop(false);
                console.log(error);
            }
        );
    };
    const loadNext = () => {
        if (!hasMore() || isLoading()) {
            return;
        }

        loadMore(
            connectionConfig,
            10, // Fetch the next 10 feed items
            (error) => {
                if (error) console.log(error);
            }
        );
    };
    return (
        //@TODO handle null assertions
        <FlatList
            nestedScrollEnabled={true}
            data={comments.edges}
            renderItem={({ item }) => {
                if (!item) return <Text>Not Here</Text>;
                const { node } = item;
                const username =
                    node.creator.username.substr(0, 4) +
                    '...' +
                    node.creator.username.substr(-4);
                return (
                    <Card
                        // onPress={() => this.goToUserDetail(node)}
                        style={styles.commentTypes}
                        shadowColor="rgba(0,0,0,.3)"
                    >
                        <View style={styles.comment}>
                            <View style={styles.image}>
                                <Blockies
                                    address={node.creator.addresses[0]}
                                    size={8}
                                    scale={4}
                                />
                            </View>
                            <View style={styles.text}>
                                <Text style={styles.name}>{username}</Text>
                                <Text style={styles.message}>
                                    {node.content}
                                </Text>
                            </View>
                        </View>
                    </Card>
                );
            }}
            keyExtractor={(item) => item.node._id}
            onEndReached={loadNext}
            onRefresh={refetchList}
            refreshing={isFetchingTop}
            ItemSeparatorComponent={() => <View style={null} />}
            ListFooterComponent={null}
            scrollEnabled={props.chatScroll}
            style={styles.list}
            ListHeaderComponent={() => (
                <Card
                    bgColor="#FCFBC1"
                    shadowColor="rgba(0,0,0,.2)"
                    style={styles.headerCard}
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
            )}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 16
    },
    headerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
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
    message: {
        color: '#2d3636',
        lineHeight: 20
    }
});
