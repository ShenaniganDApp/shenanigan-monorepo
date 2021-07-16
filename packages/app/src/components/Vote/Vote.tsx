import React, { ReactElement, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, Card } from '../UI';
import { useNavigation } from '@react-navigation/native';
import { graphql } from 'relay-runtime';
import { usePagination } from 'relay-hooks';
import { Vote_query, Vote_query$key } from './__generated__/Vote_query.graphql';
import { VotePaginationQueryVariables } from './__generated__/VotePaginationQuery.graphql';

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

type Props = {
    query: Vote_query$key;
};

export const Vote = (props: Props): ReactElement => {
    const [isFetchingTop, setIsFetchingTop] = useState(false);
    const [
        query,
        { isLoading, hasMore, loadMore, refetchConnection }
    ] = usePagination(votesFragmentSpec, props.query);

    console.log('xzxz', query);

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

    const data = [
        {
            id: '1',
            type: 'positive',
            title: 'Leading Outcome 1',
            percent: 25,
            content:
                'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti a, quidem dignissimos adipisci est.'
        },
        {
            id: '2',
            type: 'negative',
            title: 'Leading Outcome 2',
            percent: 25,
            content:
                'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti a, quidem dignissimos adipisci est.'
        },
        {
            id: '3',
            type: 'positive',
            title: 'Leading Outcome 3',
            percent: 25,
            content:
                'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti a, quidem dignissimos adipisci est.'
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.shadow}>
                <ResultsCard
                    title={'Live Challenge Title'}
                    skipPercent={20}
                    stayPercent={50}
                    viewerPercent={25}
                    totalViewers={120}
                    skipOnPress={() => console.log('skip')}
                    stayOnPress={() => console.log('stay')}
                />
            </View>

            <View style={styles.largeDivider} />

            <FlatList
                data={data}
                scrollEnabled={true}
                renderItem={({ item }) => (
                    <Outcome
                        positive={item.type === 'positive'}
                        title={item.title}
                        percent={item.percent}
                        content={item.content}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginVertical: 30,
        flex: 1
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3
    },
    resultsCard: {
        padding: 6,
        borderRadius: 16
    },
    resultsCardInner: {},
    challengeTitle: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 20
    },
    resultsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    result: {
        flex: 1
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    resultPercent: {
        fontSize: 32,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginVertical: 6
    },
    resultDivider: {
        height: 4,
        marginBottom: 30
    },
    resultButton: {
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 40,
        borderWidth: 2
    },
    resultButtonText: {
        textAlign: 'center',
        color: 'white',
        textTransform: 'capitalize',
        fontSize: 16
    },
    viewers: {
        flex: 1,
        paddingHorizontal: 8
    },
    viewersTop: {
        marginBottom: 30
    },
    viewersText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8
    },
    viewersPercent: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        color: '#555'
    },
    largeDivider: {
        height: 4,
        width: '66.66%',
        marginBottom: 30,
        backgroundColor: 'black',
        alignSelf: 'center',
        marginVertical: 40
    },
    outcome: {
        marginBottom: 30,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 3
    },
    outcomeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    outcomeTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    outcomeDivider: {
        height: 2,
        width: 150,
        marginVertical: 12
    },
    outcomePercent: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    outcomeContent: {
        lineHeight: 20
    }
});

type ResultsCardProps = {
    title: string;
    skipPercent: number;
    stayPercent: number;
    totalViewers: number;
    viewerPercent: number;
    skipOnPress: () => void;
    stayOnPress: () => void;
};

const ResultsCard = ({
    title,
    skipPercent,
    stayPercent,
    totalViewers,
    viewerPercent,
    skipOnPress,
    stayOnPress
}: ResultsCardProps): ReactElement => (
    <LinearGradient
        colors={[
            colors.pink,
            colors.green,
            colors.yellow,
            colors.pink,
            colors.yellow
        ]}
        style={styles.resultsCard}
        useAngle={true}
        angle={10}
    >
        <Card style={styles.resultsCardInner}>
            <Text style={styles.challengeTitle}>{title}</Text>
            <View style={styles.resultsContainer}>
                <VoteResult
                    type={'skip'}
                    percent={skipPercent}
                    color={colors.pink}
                    onPress={skipOnPress}
                />
                <Viewers
                    viewerCount={totalViewers}
                    viewerPercent={viewerPercent}
                />
                <VoteResult
                    type={'stay'}
                    percent={stayPercent}
                    color={colors.green}
                    onPress={stayOnPress}
                />
            </View>
        </Card>
    </LinearGradient>
);

type VoteResultProps = {
    type: string;
    color: string;
    onPress: () => void;
    percent: number;
};

const VoteResult = ({
    type,
    percent,
    color,
    onPress
}: VoteResultProps): ReactElement => (
    <View style={styles.result}>
        <Text style={[styles.resultTitle, { color: color }]}>{type}</Text>
        <Text style={[styles.resultPercent, { color: color }]}>
            {percent}
            <Text style={{ fontSize: 20 }}>%</Text>
        </Text>
        <View style={[styles.resultDivider, { backgroundColor: color }]} />
        <TouchableOpacity
            onPress={onPress}
            style={[styles.resultButton, { borderColor: color }]}
        >
            <Text style={[styles.resultButtonText, { color: color }]}>
                {type}
            </Text>
        </TouchableOpacity>
    </View>
);

type ViewersProps = {
    viewerCount: number;
    viewerPercent: number;
};

const Viewers = ({
    viewerCount,
    viewerPercent
}: ViewersProps): ReactElement => (
    <View style={styles.viewers}>
        <View style={styles.viewersTop}>
            <Text style={styles.viewersText}>Total Viewers</Text>
            <Text style={styles.viewersText}>{viewerCount}</Text>
        </View>
        <Text style={styles.viewersPercent}>
            {viewerPercent}
            <Text style={{ fontSize: 16 }}>%</Text>
        </Text>
    </View>
);

type OutcomeProps = {
    positive: boolean;
    title: string;
    content: string;
    percent: number;
};

const Outcome = ({
    positive,
    title,
    content,
    percent
}: OutcomeProps): ReactElement => {
    const { navigate } = useNavigation();

    const color = positive ? colors.green : colors.pink;

    return (
        <TouchableOpacity
            style={[styles.outcome, { shadowColor: color }]}
            onPress={() =>
                navigate('Outcome', { color, title, content, percent })
            }
        >
            <Card color={color}>
                <View style={styles.outcomeHeader}>
                    <View>
                        <Text style={styles.outcomeTitle}>{title}</Text>
                        <View
                            style={[
                                styles.outcomeDivider,
                                { backgroundColor: color }
                            ]}
                        />
                    </View>

                    <Text style={styles.outcomePercent}>
                        {percent}
                        <Text style={{ fontSize: 18 }}>%</Text>
                    </Text>
                </View>

                <Text style={styles.outcomeContent}>{content}</Text>
            </Card>
        </TouchableOpacity>
    );
};
