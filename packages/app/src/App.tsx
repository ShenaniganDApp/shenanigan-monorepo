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
import { GetOrCreateUser } from './contexts/Web3Context/mutations/GetOrCreateUserMutation';
import { Web3Context } from './contexts';
import { GetOrCreateUserMutationResponse } from './contexts/Web3Context/mutations/__generated__/GetOrCreateUserMutation.graphql';

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
    const [getOrCreateUser, isInFlight] = useMutation(GetOrCreateUser);
    const { connectDID, connector, burner } = useContext(Web3Context);

    const setupUserSession = useCallback(async () => {
        //@TODO handle expired tokens
        await connectDID(connector, burner);

        const address = connector.accounts[0]
            ? connector.accounts[0]
            : await burner.getAddress();

        const config = {
            variables: {
                input: {
                    address,
                    burner: !connector.connected
                }
            },

            onCompleted: ({
                GetOrCreateUser: user
            }: GetOrCreateUserMutationResponse) => {
                if (user.error) {
                    console.log(user.error);
                }
            }
        };
        getOrCreateUser(config);
    }, [burner, connector, connectDID, getOrCreateUser]);

    useEffect(() => {
        burner && setupUserSession();
    }, [burner]);

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

    const refetch = useCallback(() => {
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
    }, [environment, isRefetching, loadAppQuery]);

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
