import React, { useState } from 'react';
import {
    FlatList,
    Text,
    TouchableHighlight,
    View,
    StyleSheet
} from 'react-native';
import { graphql } from 'react-relay';
import { usePagination } from 'relay-hooks';
import { LineupListPaginationQueryVariables } from './__generated__/LineupListPaginationQuery.graphql';

import {
    LineupList_query,
    LineupList_query$key
} from './__generated__/LineupList_query.graphql';

const lineupFragmentSpec = graphql`
    fragment LineupList_query on Query
        @argumentDefinitions(
            count: { type: "Int", defaultValue: 20 }
            cursor: { type: "String" }
        ) {
        activeChallenges(first: $count, after: $cursor)
            @connection(key: "LineupList_activeChallenges", filters: []) {
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
                    id
                    _id
                    title
                    active
                }
            }
        }
    }
`;

const connectionConfig = {
    getVariables(props: LineupList_query, { count, cursor }) {
        return {
            count,
            cursor
        };
    },
    query: graphql`
        # Pagination query to be fetched upon calling 'loadMore'.
        # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
        query LineupListPaginationQuery($count: Int!, $cursor: String) {
            ...LineupList_query @arguments(count: $count, cursor: $cursor)
        }
    `
};

type Props = {
    query: LineupList_query$key;
};

const testData = [
    {
        cursor: 'bW9uZ286MA==',
        node: {
            __typename: 'Challenge',
            _id: '601b213734494a19ced7a2ef',
            active: true,
            id: 'Q2hhbGxlbmdlOjYwMWIyMTM3MzQ0OTRhMTljZWQ3YTJlZg==',
            title: 'New'
        }
    },
    {
        cursor: 'bW9uZ286MQ==',
        node: {
            __typename: 'Challenge',
            _id: '600bd2b0751b7f72edeae118',
            active: true,
            id: 'Q2hhbGxlbmdlOjYwMGJkMmIwNzUxYjdmNzJlZGVhZTExOA==',
            title: 'Aacacs'
        }
    },
    {
        cursor: 'bW9uZ286Mg==',
        node: {
            __typename: 'Challenge',
            _id: '5ffce55c6e8fa0f177dd0fe6',
            active: true,
            id: 'Q2hhbGxlbmdlOjVmZmNlNTVjNmU4ZmEwZjE3N2RkMGZlNg==',
            title: 'Iddi'
        }
    },
    {
        cursor: 'bW9uZ286MA==',
        node: {
            __typename: 'Challenge',
            _id: '601b213734494a19ced7a2ef',
            active: true,
            id: 'Q2hhbGxlbmdlOjYwMWIyMTM3MzQ0OTRhMTljZWQ3YTJlZg==',
            title: 'New'
        }
    },
    {
        cursor: 'bW9uZ286MQ==',
        node: {
            __typename: 'Challenge',
            _id: '600bd2b0751b7f72edeae118',
            active: true,
            id: 'Q2hhbGxlbmdlOjYwMGJkMmIwNzUxYjdmNzJlZGVhZTExOA==',
            title: 'Aacacs'
        }
    },
    {
        cursor: 'bW9uZ286Mg==',
        node: {
            __typename: 'Challenge',
            _id: '5ffce55c6e8fa0f177dd0fe6',
            active: true,
            id: 'Q2hhbGxlbmdlOjVmZmNlNTVjNmU4ZmEwZjE3N2RkMGZlNg==',
            title: 'Iddi'
        }
    }
];

export const LineupList = (props: Props) => {
    const [isFetchingTop, setIsFetchingTop] = useState(false);
    const [
        query,
        { isLoading, hasMore, loadMore, refetchConnection }
    ] = usePagination(lineupFragmentSpec, props.query);
    const { activeChallenges } = query;
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
    console.log(activeChallenges.edges);

    return (
        //@TODO handle null assertions
        <FlatList
            nestedScrollEnabled={true}
            // data={activeChallenges.edges}
            data={testData}
            renderItem={({ item, index }) => {
                if (!item) return <Text>Not Here</Text>;
                const { node } = item;

                return (
                    <TouchableHighlight underlayColor="whitesmoke">
                        <View style={styles.card}>
                            <View style={styles.donationContainer}>
                                <Text style={styles.donation}>10 XDai</Text>
                            </View>

                            <View style={styles.cardInner}>
                                <View style={styles.profile}>
                                    <View style={styles.image} />
                                    <Text style={styles.title}>Username</Text>
                                </View>

                                <Text>
                                    {node.title} Lorem ipsum dolor, sit amet
                                    consectetur adipisicing elit. Veritatis
                                    delectus ad dignissimos?
                                </Text>
                            </View>
                            {/* <Text>{node.active.toString()}</Text> */}
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
    card: {
        backgroundColor: '#E6FFFF',
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#80FFFF',
        overflow: 'hidden'
    },
    donationContainer: {
        backgroundColor: '#80FFFF',
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    donation: {
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        fontSize: 16
    },
    cardInner: {
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    image: {
        height: 40,
        width: 40,
        backgroundColor: 'hotpink',
        borderRadius: 20
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8
    }
});
