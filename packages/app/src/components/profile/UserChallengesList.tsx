import React, { useContext, useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import {
    useFragment,
    usePaginationFragment,
    graphql,
    useMutation
} from 'react-relay';

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
import { UserChallengesList_me$key } from './__generated__/UserChallengesList_me.graphql';
import { UserChallengesListProps } from '../../Navigator';

type Props = UserChallengesListProps;

export const UserChallengesList = (props: Props): React.ReactElement => {
    const {
        data,
        isLoadingNext,
        loadNext,
        hasNext,
        refetch
    } = usePaginationFragment(
        graphql`
            fragment UserChallengesList_me on User
            @argumentDefinitions(
                count: { type: "Int", defaultValue: 20 }
                cursor: { type: "String" }
            )
            @refetchable(queryName: "UserChallengesListRefetchQuery") {
                createdChallenges(first: $count, after: $cursor)
                    @connection(key: "UserChallengesList_createdChallenges") {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    edges {
                        node {
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
        `,
        props.route.params.me
    );

    console.log('prpm: ', props.route.params.me);

    const [index, setIndex] = useState(0);
    const [challenges, setChallenges] = useState([]);
    const [isFetchingTop, setIsFetchingTop] = useState(false);
    const { top } = useSafeAreaInsets();
    const { setMainTabsSwipe } = useContext(TabNavSwipeContext);

    const [toggleActive] = useMutation<ToggleActiveMutation>(ToggleActive);

    // const [
    //     query,
    //     { isLoading, hasMore, loadMore, refetchConnection }
    // ] = usePagination(
    //     userChallengesFragmentSpec,
    //     props.route.params.userChallengeQuery
    // );

    const { createdChallenges } = data;
    const { edges } = createdChallenges;

    const navigation = useNavigation();

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

    useEffect(() => {
        if (!edges) return;
        let arr = edges.slice();
        const sortedData = arr.sort(
            (a, b) => dayjs(a.node.createdAt) - dayjs(b.node.createdAt)
        );
        const sortedDataWithIndex = sortedData.map((object, i) => ({
            ...object,
            node: { ...object['node'], index: i }
        }));
        setChallenges(sortedDataWithIndex);
    }, [edges]);

    const groupedAndFormattedData = () => {
        const groupedData = groupByMonth(challenges, 'createdAt');
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
                onPress={() =>
                    navigation.navigate('UserChallengeDetailList', {
                        me: props.route.params.me,
                        cardIndex: node.index
                    })
                }
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

                <View>
                    <TouchableOpacity
                        style={styles.carouselButton}
                        onPress={() =>
                            navigation.navigate('UserChallengeDetailList', {
                                me: props.route.params.me,
                                cardIndex: 0
                            })
                        }
                    >
                        <Icon
                            name="view-carousel-outline"
                            size={42}
                            color={colors.altWhite}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.background}>
                    <Title style={styles.title}>Challenges</Title>

                    <SectionList
                        sections={groupedAndFormattedData()}
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
    iconsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'red'
        // height: 20
    },
    title: {
        textAlign: 'center',
        fontSize: 34,
        marginVertical: '5%'
    },
    sectionTitle: {
        fontSize: 17,
        color: 'white',
        fontWeight: '500',
        marginTop: '6%',
        marginBottom: '4%'
    },
    cardWrapper: {
        position: 'relative'
        // borderColor: 'white',
        // borderWidth: 3,
        // borderRadius: 5,
        // borderStyle: 'solid',
        // marginBottom: 20
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
    carouselButton: {
        position: 'absolute',
        right: 0,
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