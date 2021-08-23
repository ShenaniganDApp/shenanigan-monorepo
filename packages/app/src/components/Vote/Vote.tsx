import React, { ReactElement, useContext, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { backgroundStyles, Title } from '../UI';
import { useNavigation } from '@react-navigation/native';
import { graphql } from 'relay-runtime';
import { usePagination } from 'relay-hooks';
import { Vote_query, Vote_query$key } from './__generated__/Vote_query.graphql';
import { VotePaginationQueryVariables } from './__generated__/VotePaginationQuery.graphql';
import { ChallengeListCard } from './ChallengeListCard';
import { SwiperContext, TabNavSwipeContext } from '../../contexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const votesFragmentSpec = graphql`
    fragment Vote_query on Query
    @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
    ) {
        challenges(first: $count, after: $cursor)
            @connection(key: "Vote_challenges", filters: []) {
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
                    image
                    content
                    creator {
                        username
                    }
                }
            }
        }
    }
`;

const connectionConfig = {
    getVariables(
        props: Vote_query,
        { count, cursor }: VotePaginationQueryVariables
    ) {
        return {
            count,
            cursor
        };
    },
    query: graphql`
        # Pagination query to be fetched upon calling 'loadMore'.
        # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
        query VotePaginationQuery($count: Int!, $cursor: String) {
            ...Vote_query @arguments(count: $count, cursor: $cursor)
        }
    `
};

// type Props = {
//     voteQuery: Vote_query$key;
// };

export const Vote = (props): ReactElement => {
    const [isFetchingTop, setIsFetchingTop] = useState(false);
    const navigation = useNavigation();
    const { setWalletScroll } = useContext(SwiperContext);
    const { setLiveTabsSwipe } = useContext(TabNavSwipeContext);
    const { top } = useSafeAreaInsets();
    const [
        query,
        { isLoading, hasMore, loadMore, refetchConnection }
    ] = usePagination(votesFragmentSpec, props.route.params.voteQuery);

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

    useEffect(() => {
        const focus = navigation.addListener('focus', () => {
            setLiveTabsSwipe(true);
            setWalletScroll(true);
            console.log('setWalletScroll: ');
        });
        return focus;
    }, [navigation]);

    const data = [
        {
            id: '1',
            percent: '95',
            title: '1 Handed Pushup',
            leadingOutcome: 'I crushed it',
            username: 'YoungKidWarrior',
            votesToFlip: 17,
            hoursToVote: 5
        },
        {
            id: '2',
            percent: '55',
            title: '3 Handed Pushup',
            leadingOutcome: 'I completely whiffed it',
            username: 'YoungKidWarrior',
            votesToFlip: 87,
            hoursToVote: 10
        },
        {
            id: '3',
            percent: '95',
            title: '1 Handed Pushup',
            leadingOutcome: 'I crushed it',
            username: 'YoungKidWarrior',
            votesToFlip: 17,
            hoursToVote: 5
        }
    ];

    return (
        <View style={[styles.container, { paddingTop: top }]}>
            <Title style={styles.title} shadow>
                Judge Past Challenges
            </Title>
            <View style={styles.background}>
                <FlatList
                    data={data}
                    nestedScrollEnabled={true}
                    contentContainerStyle={styles.contentContainer}
                    onScrollBeginDrag={() => setWalletScroll(false)}
                    onMomentumScrollEnd={() => setWalletScroll(true)}
                    onScrollEndDrag={() => setWalletScroll(true)}
                    renderItem={({ item }) => {
                        // if (!item) return <Text>Not Here</Text>;
                        // const { node } = item;
                        return (
                            <ChallengeListCard
                                title={item.title}
                                username={item.username}
                                leadingOutcome={item.leadingOutcome}
                                percent={item.percent}
                                votesToFlip={item.votesToFlip}
                                hoursToVote={item.hoursToVote}
                            />
                        );
                    }}
                    keyExtractor={(item) => item.id}
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
        flex: 1,
        paddingHorizontal: '4%'
    },
    title: {
        textAlign: 'center'
    },
    background: {
        ...backgroundStyles.fullSheet,
        paddingHorizontal: '1%',
        marginTop: '4%'
    },
    contentContainer: {
        padding: '4%'
    }
});
