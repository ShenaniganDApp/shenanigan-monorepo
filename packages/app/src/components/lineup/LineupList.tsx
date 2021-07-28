import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import Blockies from '../Web3/Blockie';
import { Card } from '../UI';
import { graphql, usePaginationFragment } from 'react-relay';
import { useNavigation } from '@react-navigation/native';

import {
    LineupList_query,
    LineupList_query$key
} from './__generated__/LineupList_query.graphql';
import { TabNavigationContext } from '../../contexts';

type Props = {
    query: LineupList_query$key;
};

const lineupFragmentSpec = graphql`
    fragment LineupList_query on Query
    @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
    )
    @refetchable(queryName: "LineupListQuery") {
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
                    totalDonations
                    creator {
                        username
                        addresses
                    }
                    ...Challenge_challenge
                }
            }
        }
    }
`;

export const LineupList = (props: Props) => {
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
    } = usePaginationFragment<LineupList_query, LineupList_query$key>(
        lineupFragmentSpec,
        props.query
    );
    const { activeChallenges } = data;
    const { lineupId, setLineupId } = useContext(TabNavigationContext);
    const { navigate } = useNavigation();

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

    const sortLineUp = () => {
        let arr = activeChallenges.edges.slice();
        return arr.sort(
            (a, b) => a.node.totalDonations < b.node.totalDonations
        );
    };

    useEffect(() => {
        const color = `hsl(${360 * Math.random()}, 100%, 55%)`;
        const edge = activeChallenges.edges.find(
            (edge) => edge.node.id === lineupId
        );
        if (edge) {
            setLineupId('');
            navigate('Challenge', { node: edge.node, color });
        }
    }, [lineupId]);

    return (
        //@TODO handle null assertions
        <FlatList
            nestedScrollEnabled={true}
            data={sortLineUp()}
            renderItem={({ item, index }) => {
                if (!item) return <Text>Not Here</Text>;
                const { node } = item;
                const color = `hsl(${360 * Math.random()}, 100%, 55%)`;

                const username =
                    node.creator.username.substr(0, 4) +
                    '...' +
                    node.creator.username.substr(-4);

                return (
                    <View style={index === 0 && styles.featured}>
                        <Card
                            style={styles.card}
                            color={color}
                            shadowColor={color}
                            noPadding
                            onPress={() =>
                                navigate('Challenge', { node, color })
                            }
                        >
                            <View
                                style={{
                                    ...styles.donationContainer,
                                    backgroundColor: color
                                }}
                            >
                                <Text style={{ ...styles.donation }}>
                                    {node.totalDonations} XDai
                                </Text>
                            </View>

                            <View style={styles.cardInner}>
                                <View style={styles.profile}>
                                    <Blockies
                                        address={node.creator.addresses[0]}
                                        size={10}
                                        scale={4}
                                    />
                                    <Text style={styles.username}>
                                        {username}
                                    </Text>
                                </View>

                                <Text style={styles.title}>
                                    {node.title} | {node.active.toString()}
                                </Text>
                            </View>
                        </Card>
                    </View>
                );
            }}
            keyExtractor={(item) => item.node._id}
            onEndReached={onEndReached}
            onRefresh={refetchList}
            refreshing={isFetchingTop}
            ItemSeparatorComponent={() => <View style={null} />}
            ListFooterComponent={null}
        />
    );
};

const styles = StyleSheet.create({
    featured: {
        borderBottomWidth: 1,
        borderColor: '#444',
        marginTop: 10,
        marginBottom: 20
    },
    card: {
        marginBottom: 20
    },
    donationContainer: {
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
        padding: 16
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
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
