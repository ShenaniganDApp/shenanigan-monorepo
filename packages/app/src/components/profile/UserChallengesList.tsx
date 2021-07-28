import React, { useState } from 'react';

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
                    }
                }
            }
        }
    }
`;

export const UserChallengesList = (props: Props): React.ReactElement => {
    const [isFetchingTop, setIsFetchingTop] = useState(false);

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
    // const { createdChallenges } = me;

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

    return (
        //@TODO handle null assertions
        <FlatList
            nestedScrollEnabled={true}
            style={{ backgroundColor: '#e6ffff' }}
            data={me?.createdChallenges.edges}
            renderItem={({ item }) => {
                if (!item) return <Text>Not Here</Text>;
                const { node } = item;

                return (
                    <TouchableHighlight
                        onPress={() => handleToggleActive(node)}
                        underlayColor="whitesmoke"
                        style={styles.challengeTypes}
                    >
                        <View>
                            <Text>{node?.title}</Text>
                            <Text>{node?.content}</Text>
                            <Text>{node?.active.toString()}</Text>
                        </View>
                    </TouchableHighlight>
                );
            }}
            keyExtractor={(item) => item?.node?._id}
            onEndReached={onEndReached}
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
