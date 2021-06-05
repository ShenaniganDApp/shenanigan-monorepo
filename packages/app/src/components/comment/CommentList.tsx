import React, { useContext, useState } from 'react';
import { graphql } from 'react-relay';
import { usePagination } from 'relay-hooks';
import {
    CommentList_query,
    CommentList_query$key
} from './__generated__/CommentList_query.graphql';
import { CommentListPaginationQueryVariables } from './__generated__/CommentListPaginationQuery.graphql';
import { View, StyleSheet, FlatList } from 'react-native';
import { SwiperContext } from '../../contexts';
import { ChatHeader } from './ChatHeader';
import { ChatComment } from './ChatComment';

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
    const { setWalletScroll } = useContext(SwiperContext);
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
        <>
            <ChatHeader />
            <View style={styles.container}>
                <View style={styles.background}>
                    <FlatList
                        nestedScrollEnabled={true}
                        data={comments.edges}
                        inverted
                        onScrollBeginDrag={() => setWalletScroll(false)}
                        onMomentumScrollEnd={() => setWalletScroll(true)}
                        onScrollEndDrag={() => setWalletScroll(true)}
                        renderItem={({ item }) => <ChatComment item={item} />}
                        keyExtractor={(item) => item.node._id}
                        onEndReached={loadNext}
                        onRefresh={refetchList}
                        refreshing={isFetchingTop}
                        ItemSeparatorComponent={() => <View style={null} />}
                        ListFooterComponent={null}
                        scrollEnabled={props.chatScroll}
                        bounces={false}
                        contentContainerStyle={styles.list}
                    />
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '3%',
        flex: 1
    },
    background: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,.5)',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: 'rgba(251, 250, 250, 0.7)'
    },
    list: {
        paddingHorizontal: '3%',
        paddingBottom: '3%'
    }
});
