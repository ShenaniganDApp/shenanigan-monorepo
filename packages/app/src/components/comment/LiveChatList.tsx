import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { graphql, usePagination } from 'relay-hooks';
import { LiveChatListPaginationQueryVariables } from './__generated__/LiveChatListPaginationQuery.graphql';
import { LiveChatList_query } from './__generated__/LiveChatList_query.graphql';
import { Comment } from './Comment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../UI';

const commentsFragmentSpec = graphql`
    fragment LiveChatList_query on Query
    @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
    ) {
        comments(first: $count, after: $cursor)
            @connection(key: "LiveChatList_comments", filters: []) {
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
                    ...Comment_comment
                }
            }
        }
    }
`;

const connectionConfig = {
    getVariables(
        props: LiveChatList_query,
        { count, cursor }: LiveChatListPaginationQueryVariables
    ) {
        return {
            count,
            cursor
        };
    },
    query: graphql`
        # Pagination query to be fetched upon calling 'loadMore'.
        # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
        query LiveChatListPaginationQuery($count: Int!, $cursor: String) {
            ...LiveChatList_query @arguments(count: $count, cursor: $cursor)
        }
    `
};

export const LiveChatList = (props): React.ReactElement => {
    const renderItem = ({ item }) => <Comment comment={item.node} />;
    const [
        query,
        { isLoading, hasMore, loadMore, refetchConnection }
    ] = usePagination(commentsFragmentSpec, props.query);
    const { comments } = query;
    const [isFetchingTop, setIsFetchingTop] = useState(false);

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
        <FlatList
            ListHeaderComponent={() => <Pinned />}
            nestedScrollEnabled={true}
            data={comments.edges}
            renderItem={renderItem}
            keyExtractor={(item) => item.node._id}
            onEndReached={loadNext}
            onRefresh={refetchList}
            refreshing={isFetchingTop}
            style={{ maxHeight: 300 }}
        />
    );
};

const Pinned = () => (
    <View style={styles.pinnedContainer}>
        <View style={styles.pinnedTextContainer}>
            <Text style={styles.pinnedTitle}>This is pinned info</Text>
            <Text style={styles.pinnedText}>
                Information about the stream or something
            </Text>
        </View>
        <View style={styles.pinnedIconBg}>
            <Icon name="pin" size={32} color="white" />
        </View>
    </View>
);

const styles = StyleSheet.create({
    pinnedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12
    },
    pinnedTextContainer: {
        backgroundColor: 'rgba(60,60,60,.25)',

        flex: 1,
        justifyContent: 'center',
        padding: 12
    },
    pinnedTitle: {
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 6
    },
    pinnedIconBg: {
        backgroundColor: colors.pink,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 12
    },
    pinnedText: {
        color: 'white'
    }
});
