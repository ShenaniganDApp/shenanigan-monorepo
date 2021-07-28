import React, { useContext, useState } from 'react';

import { usePaginationFragment, graphql } from 'react-relay';

import {
    MarketList_query,
    MarketList_query$key
} from './__generated__/MarketList_query.graphql';
import { MarketListPaginationQueryVariables } from './__generated__/MarketListPaginationQuery.graphql';

import { View, StyleSheet, FlatList } from 'react-native';
import { MarketCard } from './MarketCard';
import { SwiperContext } from '../../contexts';

type Props = {
    query: MarketList_query$key;
};

const marketsFragmentSpec = graphql`
    fragment MarketList_query on Query
    @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
    )
    @refetchable(queryName: "MarketListQuery") {
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

export const MarketList = ({ query }: Props): React.ReactElement => {
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
    } = usePaginationFragment<MarketList_query, MarketList_query$key>(
        marketsFragmentSpec,
        query
    );
    const { challenges } = data;

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
                    onEndReached={onEndReached}
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
        borderColor: 'rgba(251, 250, 250, 0.7)',
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    contentContainer: {
        paddingVertical: '4%'
    }
});
