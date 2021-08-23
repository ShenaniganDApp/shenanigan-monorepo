import React, { useContext, useState } from 'react';

import { usePagination, graphql } from 'relay-hooks';

import {
    MarketList_query,
    MarketList_query$key
} from './__generated__/MarketList_query.graphql';
import { MarketListPaginationQueryVariables } from './__generated__/MarketListPaginationQuery.graphql';

import { View, StyleSheet, FlatList } from 'react-native';
import { MarketCard } from './MarketCard';
import { SwiperContext } from '../../contexts';
import { backgroundStyles } from '../UI';

type Props = {
    query: MarketList_query$key;
};

const marketsFragmentSpec = graphql`
    fragment MarketList_query on Query
    @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
    ) {
        challenges(first: $count, after: $cursor)
            @connection(key: "MarketList_challenges", filters: []) {
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
                    title
                    address
                }
            }
        }
    }
`;

const connectionConfig = {
    getVariables(props: MarketList_query, { count, cursor }) {
        return {
            count,
            cursor
        };
    },
    query: graphql`
        # Pagination query to be fetched upon calling 'loadMore'.
        # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
        query MarketListPaginationQuery($count: Int!, $cursor: String) {
            ...MarketList_query @arguments(count: $count, cursor: $cursor)
        }
    `
};

export const MarketList = ({ query }: Props): React.ReactElement => {
    const { setWalletScroll } = useContext(SwiperContext);
    const [isFetchingTop, setIsFetchingTop] = useState(false);
    const [
        data,
        { isLoading, hasMore, loadMore, refetchConnection }
    ] = usePagination(marketsFragmentSpec, query);
    const { challenges } = data;

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
                console.log(error);
            }
        );
    };
    const test = Array.from(Array(20).keys());
    return (
        //@TODO handle null assertions
        <View style={styles.container}>
            <View style={styles.background}>
                <FlatList
                    // data={challenges.edges}
                    data={test}
                    numColumns={3}
                    contentContainerStyle={styles.contentContainer}
                    onScrollBeginDrag={() => setWalletScroll(false)}
                    onMomentumScrollEnd={() => setWalletScroll(true)}
                    onScrollEndDrag={() => setWalletScroll(true)}
                    renderItem={({ item }) => {
                        // if (!item) return <Text>Not Here</Text>;
                        // const { node } = item;
                        return (
                            <MarketCard
                            // onPress={() => this.goToUserDetail(node)}
                            />
                        );
                    }}
                    // keyExtractor={(item) => item.node._id}
                    onEndReached={loadNext}
                    onRefresh={refetchList}
                    refreshing={isFetchingTop}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '4%',
        flex: 1
    },
    background: {
        paddingHorizontal: '1%',
        marginTop: '4%',
        ...backgroundStyles.fullSheet
    },
    contentContainer: {
        paddingVertical: '4%'
    }
});
