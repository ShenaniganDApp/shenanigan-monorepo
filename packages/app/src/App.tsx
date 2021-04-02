import React, {
    ReactElement,
    Suspense,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react';
import { Text } from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import {
    graphql,
    useMutation,
    fetchQuery,
    useRelayEnvironment,
    useQueryLoader,
    PreloadedQuery,
    loadQuery
} from 'react-relay';
import { Main } from './Main';
import type { AppQuery as AppQueryType } from './__generated__/AppQuery.graphql';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const AppQuery = graphql`
    query AppQuery {
        me {
            ...Comments_me
            ...Live_me
            ...WalletDropdown_me
            ...Profile_me
            burner
        }
        liveChallenge {
            ...Comments_liveChallenge
            ...Live_liveChallenge
        }
        ...CommentList_query
        ...LiveChatList_query
        ...UserChallengesList_query
    }
`;

export const App = (): ReactElement => {
    const environment = useRelayEnvironment();
    const [queryRef, loadAppQuery] = useQueryLoader<AppQueryType>(
        AppQuery,
        loadQuery(
            environment,
            AppQuery,
            {},
            {
                fetchPolicy: 'network-only'
            }
        )
    );
    const [isRefetching, setIsRefetching] = useState(false);

    const refetch = useCallback(
        () => {
            if (isRefetching) {
                return;
            }
            setIsRefetching(true);

            // fetchQuery will fetch the query and write
            // the data to the Relay store. This will ensure
            // that when we re-render, the data is already
            // cached and we don't suspend
            fetchQuery(environment, AppQuery, {}).subscribe({
                complete: () => {
                    setIsRefetching(false);

                    // *After* the query has been fetched, we call
                    // loadQuery again to re-render with a new
                    // queryRef.
                    // At this point the data for the query should
                    // be cached, so we use the 'store-only'
                    // fetchPolicy to avoid suspending.
                    loadAppQuery(
                        { id: 'different-id' },
                        { fetchPolicy: 'store-only' }
                    );
                },
                error: (error) => {
                    setIsRefetching(false);
                }
            });
        },
        [
            /* ... */
        ]
    );

    return (
        <Suspense
            fallback={
                <SafeAreaView>
                    <Text>Loading query...</Text>
                </SafeAreaView>
            }
        >
            <Main
                isRefetching={isRefetching}
                refetch={refetch}
                queryRef={queryRef}
            />
        </Suspense>
    );
};
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 }); // 380 is magic number, not made for production
