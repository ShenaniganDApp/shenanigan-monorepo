import React, { useState } from 'react';

import { usePagination, graphql } from 'relay-hooks';

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
                }
            }
        }
    }
`;

const connectionConfig = {
    getVariables(
        props: CommentList_query,
        {count, cursor}: CommentListPaginationQueryVariables
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
            error => {
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
            error => {
                console.log(error);
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

                return (
                    <TouchableHighlight
                        // onPress={() => this.goToUserDetail(node)}
                        underlayColor="whitesmoke"
                        style={styles.commentTypes}
                    >
                        <View>
                            <Text>{node.content}</Text>
                        </View>
                    </TouchableHighlight>
                );
            }}
            keyExtractor={item => item.node._id}
            onEndReached={loadNext}
            onRefresh={refetchList}
            refreshing={isFetchingTop}
            ItemSeparatorComponent={() => <View style={null} />}
            ListFooterComponent={null}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6ffff',
        width: '100%',
        height: '100%'
    },
    commentTypes: {
        width: '80%',
        paddingVertical: '5%',
        marginRight: '10%',
        marginLeft: '10%',
    },
    commentList: {
        width: '100%',
        height: '80%'
    }
});
