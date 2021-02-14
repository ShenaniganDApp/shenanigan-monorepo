import React, { useEffect, useState } from 'react';
import Blockies from '../Web3/Blockie';

import { graphql } from 'react-relay';

import { usePagination } from 'relay-hooks';

import {
    CommentList_query,
    CommentList_query$key
} from './__generated__/CommentList_query.graphql';
import { CommentListPaginationQueryVariables } from './__generated__/CommentListPaginationQuery.graphql';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableHighlight
} from 'react-native';

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
            style={{ backgroundColor: '#e6ffff' }}
            data={comments.edges}
            renderItem={({ item }) => {
                if (!item) return <Text>Not Here</Text>;
                const { node } = item;
                const username =
                    node.creator.username.substr(0, 4) +
                    '...' +
                    node.creator.username.substr(-4);
                return (
                    <TouchableHighlight
                        // onPress={() => this.goToUserDetail(node)}
                        underlayColor="whitesmoke"
                        style={styles.commentTypes}
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
                    </TouchableHighlight>
                );
            }}
            keyExtractor={(item) => item.node._id}
            onEndReached={loadNext}
            onRefresh={refetchList}
            refreshing={isFetchingTop}
            ItemSeparatorComponent={() => <View style={null} />}
            ListFooterComponent={null}
            scrollEnabled={props.chatScroll}
        />
    );
};

const styles = StyleSheet.create({
    commentTypes: {
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    commentList: {
        width: '100%',
        height: '80%'
    },
    comment: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 6,
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
