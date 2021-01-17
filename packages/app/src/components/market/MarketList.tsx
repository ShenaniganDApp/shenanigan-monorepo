import React, { useState } from 'react';

import { usePagination, graphql } from 'relay-hooks';

import {
    MarketList_query,
    MarketList_query$key
} from './__generated__/MarketList_query.graphql';
import { MarketListPaginationQueryVariables } from './__generated__/MarketListPaginationQuery.graphql';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableHighlight
} from 'react-native';

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
    getVariables(
        props: MarketList_query,
        { count, cursor }
    ) {
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
            style={{ backgroundColor: '#e6ffff', height: '100%' }}
            data={challenges.edges}
            numColumns={3}
            renderItem={({ item }) => {
                if (!item) return <Text>Not Here</Text>;
                const { node } = item;

                return (
                    <TouchableHighlight
                        // onPress={() => this.goToUserDetail(node)}
                        style={styles.challengeTypes}
                    >
                        <View>
                            <Text>{node.title}</Text>
                            <Text>{node.address}</Text>
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#e6ffff',
        width: '100%',
        height: '100%'
    },
    challengeTypes: {
        width: '25%',
        backgroundColor: 'white',
        height: '100%',
        marginRight: '10%',
        marginBottom: '10%',
        marginLeft: '10%',
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 5,
        shadowColor: '#5E3D70',
        shadowOpacity: 1.0
    },
    challengeList: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        flexWrap: 'wrap'
    }
});
