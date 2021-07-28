import React, { useContext, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMutation } from 'relay-hooks';
import { usePaginationFragment, graphql } from 'react-relay';

import {
    UserChallengesList_query,
    UserChallengesList_query$key
} from './__generated__/UserChallengesList_query.graphql';

import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    FlatList,
    SectionList
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
import { colors, Gradient, ImageCard, sizes, XdaiBanner, Title } from '../UI';
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
    )
    @refetchable(queryName: "UserChallengesListQuery") {
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

export const UserChallengesList = (props: Props): React.ReactElement => {
    const [index, setIndex] = useState(0);
    const [isFetchingTop, setIsFetchingTop] = useState(false);
    const { top } = useSafeAreaInsets();
    const { setMainTabsSwipe } = useContext(TabNavSwipeContext);

    const [toggleActive] = useMutation<ToggleActiveMutation>(ToggleActive);
    const {
        data,
        loadNext,
        loadPrevious,
        hasNext,
        hasPrevious,
        isLoadingNext,
        isLoadingPrevious,
        refetch // For refetching connection
    } = usePaginationFragment<
        UserChallengesList_query,
        UserChallengesList_query$key
    >(userChallengesFragmentSpec, props.query);
    const { me } = data;
    
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
            (a, b) => dayjs(a.node.createdAt) - dayjs(b.node.createdAt)
        );
        const groupedData = groupByMonth(sortedData, 'createdAt');
        const formattedData = Object.keys(groupedData).map((item) => ({
            title: item,
            data: [groupedData[item]]
        }));
        return formattedData;
    };

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
        return (
            <FlatList
                data={item}
                numColumns={3}
                renderItem={renderListItem}
                //   keyExtractor={this.keyExtractor}
            />
        );
    };

    const renderListItem = ({ item }) => {
        if (!item) return <Text>Not Here</Text>;

        const { node } = item;
        const { edges } = node.challengeCards;
        const { node: challengeCardsNode } =
            edges.length && edges[edges.length - 1];

        return (
            <TouchableHighlight
                onPress={() => handleToggleActive(node)}
                underlayColor="whitesmoke"
                // style={styles.challengeTypes}
            >
                <View style={styles.cardWrapper}>
                    <XdaiBanner
                        style={{
                            position: 'absolute',
                            top: '-4%',
                            left: '-6%',
                            zIndex: 1
                        }}
                        amount="420"
                    />
                    <ImageCard
                        height={sizes.smallScreen ? 140 : 180}
                        source={{
                            uri:
                                'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                        }}
                        success={Boolean(challengeCardsNode?.resultType)}
                    />
                </View>
            </TouchableHighlight>
        );
    };

    return (
        //@TODO handle null assertions
        <Gradient>
            <View style={[styles.container, { paddingTop: top }]}>
                <View>
                    {index === 0 && (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={returnToProfile}
                        >
                            <Icon
                                name="chevron-left"
                                size={42}
                                color={colors.pink}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.background}>
                    <Title style={styles.title}>Challenges</Title>

                    <SectionList
                        sections={sortChallengesData()}
                        renderItem={renderItem}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.sectionTitle}>{title}</Text>
                        )}
                        // keyExtractor={(item) => item.node._id}
                        onEndReached={loadNext}
                        onRefresh={refetchList}
                        refreshing={isFetchingTop}
                        ItemSeparatorComponent={() => <View style={null} />}
                        ListFooterComponent={null}
                    />
                </View>
            </View>
        </Gradient>
    );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 34,
        marginVertical: '5%'
    },
    sectionTitle: {
        fontSize: 17,
        color: 'white',
        fontWeight: '500',
        marginBottom: '4%'
    },
    cardWrapper: {
        position: 'relative',
        borderColor: 'white',
        borderWidth: 3,
        borderRadius: 5,
        borderStyle: 'solid',
        marginBottom: 20
    },
    container: {
        paddingHorizontal: '4%',
        flex: 1
    },
    background: {
        flex: 1,
        paddingHorizontal: '5%',
        marginTop: '15%',
        borderColor: 'rgba(251, 250, 250, 0.7)',
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    contentContainer: {
        paddingVertical: '4%'
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 9
    },
    icon: {
        textShadowColor: 'rgba(0,0,0,.3)',
        textShadowOffset: {
            width: 0,
            height: 3
        },
        textShadowRadius: 5
    }
});
