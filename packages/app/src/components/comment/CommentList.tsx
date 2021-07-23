import React, { useContext, useState } from 'react';
import { graphql, usePaginationFragment } from 'react-relay';
import {
    CommentList_query,
    CommentList_query$key
} from './__generated__/CommentList_query.graphql';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SwiperContext } from '../../contexts';
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
    )
    @refetchable(queryName: "CommentListQuery") {
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
                    ...ChatComment_comment
                    _id
                }
            }
        }
    }
`;

export const CommentList = (props: Props): React.ReactElement => {
    const { setWalletScroll } = useContext(SwiperContext);
    const [isFetchingTop, setIsFetchingTop] = useState(false);
    const {
        data,
        loadNext,
        loadPrevious,
        hasNext,
        hasPrevious,
        isLoadingNext,
        isLoadingPrevious,
        refetch // For refetching connection
    } = usePaginationFragment<CommentList_query, CommentList_query$key>(
        commentsFragmentSpec,
        props.query
    );
    const { comments } = data;

    const refetchList = () => {
        if (isLoadingNext) {
            return;
        }
        setIsFetchingTop(true);
        refetch(10, { onComplete: () => setIsFetchingTop(false) });
    };

    const onEndReached = () => {
        if (!hasNext || isLoadingNext) {
            return;
        }

        loadNext(10);
    };

    return (
        //@TODO handle null assertions
        <View style={styles.container}>
            <View style={styles.background}>
                <FlatList
                    nestedScrollEnabled={true}
                    data={comments?.edges}
                    inverted
                    onScrollBeginDrag={() => setWalletScroll(false)}
                    onMomentumScrollEnd={() => setWalletScroll(true)}
                    onScrollEndDrag={() => setWalletScroll(true)}
                    renderItem={({ item }) => {
                        return item && item.node ? (
                            <ChatComment comment={item.node} />
                        ) : (
                            <Text>Text not here</Text>
                        );
                    }}
                    keyExtractor={(item) => item?.node?._id}
                    onEndReached={onEndReached}
                    onRefresh={refetchList}
                    refreshing={isFetchingTop}
                    scrollEnabled={props.chatScroll}
                    bounces={false}
                    contentContainerStyle={styles.list}
                />
            </View>
        </View>
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
