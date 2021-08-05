import React, { useContext, useState } from 'react';

import { usePagination, graphql, useMutation } from 'relay-hooks';

import {
    UserChallengesList_query,
    UserChallengesList_query$key
} from './__generated__/UserChallengesList_query.graphql';
import { UserChallengesListPaginationQueryVariables } from './__generated__/UserChallengesListPaginationQuery.graphql';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableHighlight
} from 'react-native';
import {
    ToggleActive,
    toggleActiveOptimisticResponse
} from '../challenges/mutations/ToggleActiveMutation';
import {
    ToggleActiveMutation,
    ToggleActiveMutationResponse
} from '../challenges/mutations/__generated__/ToggleActiveMutation.graphql';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import dayjs from 'dayjs';
import { colors, Title } from '../UI';
import { TouchableOpacity } from 'react-native';
import { TabNavSwipeContext } from '../../contexts';

type Props = {
    query: UserChallengesList_query$key;
};

const userChallengesFragmentSpec = graphql`
    fragment UserChallengesList_query on Query
    @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
    ) {
        me {
            createdChallenges(first: $count, after: $cursor)
                @connection(
                    key: "UserChallengesList_createdChallenges"
                    filters: []
                ) {
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
                        content
                        title
                        active
                        createdAt
                        challengeCards {
                            edges {
                                node {
                                    createdAt
                                    resultType
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

const connectionConfig = {
    getVariables(
        props: UserChallengesList_query,
        { count, cursor }: UserChallengesListPaginationQueryVariables
    ) {
        return {
            count,
            cursor
        };
    },
    query: graphql`
        # Pagination query to be fetched upon calling 'loadMore'.
        # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
        query UserChallengesListPaginationQuery($count: Int!, $cursor: String) {
            ...UserChallengesList_query
                @arguments(count: $count, cursor: $cursor)
        }
    `
};

export const UserChallengesList = (props: Props): React.ReactElement => {
    const [index, setIndex] = useState(0);
    const [isFetchingTop, setIsFetchingTop] = useState(false);
    const { setMainTabsSwipe } = useContext(TabNavSwipeContext);

    const [toggleActive] = useMutation<ToggleActiveMutation>(ToggleActive);
    const [
        query,
        { isLoading, hasMore, loadMore, refetchConnection }
    ] = usePagination(
        userChallengesFragmentSpec,
        props.route.params.userChallengeQuery
    );

    const { me } = query;

    const groupByMonth = (arr, property) => {
        return arr.reduce(function (accumulator, currentValue) {
            const { node } = currentValue;
            const month = dayjs(node[property]).format('MMMM');
            if (!accumulator[month]) {
                accumulator[month] = [];
            }
            accumulator[month].push(currentValue);
            return accumulator;
        }, {});
    };

    const sortChallengesData = () => {
        let arr = me.createdChallenges.edges.slice();
        const sortedData = arr.sort(
            (a, b) => dayjs(b.createdAt) - dayjs(a.createdAt)
        );
        const groupedData = groupByMonth(sortedData, 'createdAt');
        const formattedData = Object.keys(groupedData).map((item) => ({
            [item]: groupedData[item]
        }));
        return formattedData;
    };

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

    const handleToggleActive = (node) => {
        const input = {
            challengeId: node._id
        };

        const onError = () => {
            console.log('onErrorCreateChallenge');
        };

        const config = {
            variables: {
                input
            },
            optimisticResponse: toggleActiveOptimisticResponse(node),

            onCompleted: ({
                ToggleActive: { challenge, error }
            }: ToggleActiveMutationResponse) => {
                console.log('challenge: ', challenge);
            }
        };

        toggleActive(config);
    };

    const returnToProfile = () => {
        setMainTabsSwipe(true);
        props.navigation.goBack();
    };

    const renderItem = ({ item }) => {
        if (!item) return <Text>Not Here</Text>;
        for (const month in item) {
            for (const { node } of item[month]) {
                const { edges } = node.challengeCards;
                const { node: challengeCardsNode } =
                    edges.length && edges[edges.length - 1];
                return (
                    <TouchableHighlight
                        onPress={() => handleToggleActive(node)}
                        underlayColor="whitesmoke"
                        style={styles.challengeTypes}
                    >
                        <View>
                            <Text>{month}</Text>
                            <Text>{node.title}</Text>
                            <Text>{node.content}</Text>
                            <Text>{node.active.toString()}</Text>
                            {Boolean(challengeCardsNode) && (
                                <Text>
                                    {Boolean(challengeCardsNode.resultType)
                                        ? 'Success'
                                        : 'Failure'}
                                </Text>
                            )}
                        </View>
                    </TouchableHighlight>
                );
            }
        }
    };

    return (
        //@TODO handle null assertions
        <View>
            <Title>User Challenges</Title>

            {index === 0 && (
                <TouchableOpacity
                    // style={styles.backButton}
                    onPress={returnToProfile}
                >
                    <Icon
                        name="chevron-left"
                        size={42}
                        color={colors.pink}
                        // style={styles.icon}
                    />
                </TouchableOpacity>
            )}
            <FlatList
                nestedScrollEnabled={true}
                style={{ backgroundColor: '#e6ffff' }}
                data={sortChallengesData()}
                renderItem={renderItem}
                // keyExtractor={(item) => item.node._id}
                onEndReached={loadNext}
                onRefresh={refetchList}
                refreshing={isFetchingTop}
                ItemSeparatorComponent={() => <View style={null} />}
                ListFooterComponent={null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6ffff',
        width: '100%',
        height: '100%'
    },
    challengeTypes: {
        width: '80%',
        paddingVertical: '5%',
        marginRight: '10%',
        marginLeft: '10%'
    },
    commentList: {
        width: '100%',
        height: '80%'
    }
});
