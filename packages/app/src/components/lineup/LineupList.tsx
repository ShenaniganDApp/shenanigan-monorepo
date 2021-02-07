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

    const getColor = (index: number) => {
        if (index === 0 || index % 3 === 0) {
            return '#FF016D';
        } else if (index === 1 || index % 3 === 1) {
            return '#80FFFF';
        } else if (index === 2 || index % 3 === 2) {
            return '#B0F489';
        }
    };

    return (
        //@TODO handle null assertions
        <FlatList
            nestedScrollEnabled={true}
            // data={activeChallenges.edges}
            data={testData}
            renderItem={({ item, index }) => {
                if (!item) return <Text>Not Here</Text>;
                const { node } = item;

                const color = getColor(index);

                return (
                    <TouchableHighlight
                        underlayColor="whitesmoke"
                        style={index === 0 ? styles.featured : null}
                    >
                        <View style={styles.container}>
                            <View
                                style={{
                                    ...styles.card,
                                    borderColor: color,
                                    shadowColor:
                                        index === 0 ? 'rgba(0,0,0,.4)' : color
                                }}
                            >
                                <View
                                    style={{
                                        ...styles.donationContainer,
                                        backgroundColor: color
                                    }}
                                >
                                    <Text style={{ ...styles.donation }}>
                                        10 XDai
                                    </Text>
                                </View>

                                <View style={styles.cardInner}>
                                    <View style={styles.profile}>
                                        <View style={styles.image} />
                                        <Text style={styles.username}>
                                            Username
                                        </Text>
                                    </View>

                                    <Text style={styles.title}>
                                        {node.title} Lorem ipsum dolor, sit amet
                                        consectetur adipisicing elit.
                                    </Text>
                                </View>
                                {/* <Text>{node.active.toString()}</Text> */}
                            </View>
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
    featured: {
        borderBottomWidth: 3,
        borderColor: 'black',
        marginTop: 10,
        marginBottom: 20
    },
    container: {
        paddingHorizontal: 15
    },
    card: {
        backgroundColor: '#E6FFFF',
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#80FFFF',
        shadowColor: '#80FFFF',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,

        elevation: 3
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
        fontSize: 20
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
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#000'
    },
    username: {
        fontWeight: 'bold',
        marginLeft: 16,
        fontSize: 16
    },
    title: {
        lineHeight: 20
    }
});
