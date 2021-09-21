import React, { useContext, useEffect, useState } from 'react';
import {
    FlatList,
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Blockies from '../Web3/Blockie';
import { graphql, useFragment } from 'react-relay';
import { usePagination } from 'relay-hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineupList_me$key } from './__generated__/LineupList_me.graphql';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
    TabNavSwipeContext,
    SwiperContext,
    TabNavigationContext
} from '../../contexts';
import { LineupListPaginationQueryVariables } from './__generated__/LineupListPaginationQuery.graphql';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import {
    LineupList_query,
    LineupList_query$key
} from './__generated__/LineupList_query.graphql';
import { LineupChallengeInfo } from './LineupChallengeInfo';
import { Card, colors } from '../UI';

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
                    content
                    active
                    totalDonations
                    positiveOptions
                    negativeOptions
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
    me: LineupList_me$key;
};

export const LineupList = (props: Props) => {
    const me = useFragment<LineupList_me$key>(
        graphql`
            fragment LineupList_me on User {
                ...LineupChallengeInfo_me
            }
        `,
        props.me
    );

    const [isFetchingTop, setIsFetchingTop] = useState(false);
    const [
        query,
        { isLoading, hasMore, loadMore, refetchConnection }
    ] = usePagination(lineupFragmentSpec, props.query);
    const { activeChallenges } = query;
    const { lineupId, setLineupId } = useContext(TabNavigationContext);
    const { navigate } = useNavigation();
    const { top } = useSafeAreaInsets();
    const [infoVisible, setInfoVisible] = useState(false);
    const [openedChallenge, setOpenedChallenge] = useState({
        title: '',
        content: '',
        totalDonations: '',
        positiveOptions: [],
        negativeOptions: [],
        creator: { username: '' }
    });
    const { setLiveTabsSwipe } = useContext(TabNavSwipeContext);
    const { setWalletScroll } = useContext(SwiperContext);
    const overlayOpacity = useSharedValue(0);
    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value
    }));

    const listStyle = useAnimatedStyle(() => {
        const opacity = interpolate(overlayOpacity.value, [0, 1], [1, 0.2]);
        return {
            opacity
        };
    });

    useEffect(() => {
        if (infoVisible) {
            setLiveTabsSwipe(false);
            setWalletScroll(false);
        } else {
            setLiveTabsSwipe(true);
            setWalletScroll(true);
        }
        overlayOpacity.value = infoVisible
            ? withTiming(1, { duration: 250 })
            : withTiming(0, { duration: 250 });
    }, [infoVisible]);

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

    const sortLineUp = () => {
        let arr = activeChallenges.edges.slice();
        return arr.sort(
            (a, b) => a.node.totalDonations < b.node.totalDonations
        );
    };

    useEffect(() => {
        const edge = activeChallenges.edges.find(
            (edge) => edge.node.id === lineupId
        );
        if (edge) {
            setLineupId('');
            navigate('Challenge', { node: edge.node });
        }
    }, [lineupId]);

    return (
        //@TODO handle null assertions
        <>
            <Animated.View style={listStyle}>
                <FlatList
                    nestedScrollEnabled={true}
                    data={sortLineUp()}
                    renderItem={({ item, index }) => {
                        if (!item) return <Text>Not Here</Text>;
                        const { node } = item;

                        const username =
                            node.creator.username.substr(0, 4) +
                            '...' +
                            node.creator.username.substr(-4);

                        return (
                            <View style={index === 0 && styles.featured}>
                                <Card
                                    style={styles.card}
                                    noPadding
                                    onPress={() => {
                                        setOpenedChallenge(node);
                                        setInfoVisible(true);
                                    }}
                                >
                                    <View style={styles.cardInner}>
                                        <View style={styles.profile}>
                                            <Blockies
                                                address={
                                                    node.creator.addresses[0]
                                                }
                                                size={10}
                                                scale={4}
                                            />
                                            <Text style={styles.username}>
                                                {username}
                                            </Text>
                                        </View>

                                        <Text style={styles.title}>
                                            {node.title} |{' '}
                                            {node.active.toString()}
                                        </Text>
                                    </View>
                                </Card>
                            </View>
                        );
                    }}
                    keyExtractor={(item) => item.node._id}
                    onEndReached={loadNext}
                    onRefresh={refetchList}
                    refreshing={isFetchingTop}
                    ListFooterComponent={null}
                />
            </Animated.View>
            <Animated.View
                style={[StyleSheet.absoluteFill, overlayStyle]}
                pointerEvents={infoVisible ? 'auto' : 'none'}
            >
                <View style={StyleSheet.absoluteFill}>
                    <TouchableOpacity
                        style={[
                            styles.backButton,
                            {
                                top: top || '2%'
                            }
                        ]}
                        onPress={() => setInfoVisible(false)}
                    >
                        <Icon
                            name="chevron-left"
                            size={42}
                            color={colors.pink}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <LineupChallengeInfo
                        me={me}
                        challenge={openedChallenge}
                        infoVisible={infoVisible}
                    />
                </View>
            </Animated.View>
        </>
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
    },
    backButton: {
        zIndex: 99,
        alignSelf: 'flex-start'
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
