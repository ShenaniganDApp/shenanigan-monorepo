import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { graphql, usePaginationFragment } from 'react-relay';
import {
    LiveChatList_query,
    LiveChatList_query$key
} from './__generated__/LiveChatList_query.graphql';
import { Comment } from './Comment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../UI';

type Props = {
    query: LiveChatList_query$key;
};

const commentsFragmentSpec = graphql`
    fragment LiveChatList_query on Query
    @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
    )
    @refetchable(queryName: "LiveChatListPaginationQuery") {
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

export const LiveChatList = (props: Props): React.ReactElement => {
    const renderItem = ({ item }) => <Comment comment={item.node} />;
    const {
        data,
        loadNext,
        loadPrevious,
        hasNext,
        hasPrevious,
        isLoadingNext,
        isLoadingPrevious,
        refetch // For refetching connection
    } = usePaginationFragment<LiveChatList_query, LiveChatList_query$key>(
        commentsFragmentSpec,
        props.query
    );
    const { comments } = data;
    const [isFetchingTop, setIsFetchingTop] = useState(false);

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
        <View style={{ flex: 1 }}>
            <FlatList
                ListHeaderComponent={() => <Pinned />}
                nestedScrollEnabled={true}
                data={comments.edges}
                renderItem={renderItem}
                keyExtractor={(item) => item?.node?._id}
                onEndReached={onEndReached}
                onRefresh={refetchList}
                refreshing={isFetchingTop}
                style={{ maxHeight: 300 }}
            />
        </View>
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
