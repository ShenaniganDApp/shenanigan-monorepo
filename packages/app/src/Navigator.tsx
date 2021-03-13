import {
    createStackNavigator,
    StackScreenProps
} from '@react-navigation/stack';
import { providers } from 'ethers';
import React, { ReactElement } from 'react';

import { AppQueryResponse } from './__generated__/AppQuery.graphql';
import { Lineup } from './components/lineup/Lineup';
import { Comments } from './components/comment/Comments';
import { Live } from './components/Live/Live';
import { LiveDashboard } from './components/Live/LiveDashboard';
import { Profile } from './components/profile/Profile';
import { Market } from './components/market/Market';
import { Challenge } from './components/challenges/Challenge';
import { Vote } from './components/Vote/Vote';
import { Outcome } from './components/Vote/Outcome';
import { ChallengeForm_me$key } from './components/challenges/__generated__/ChallengeForm_me.graphql';
import { CommentList_query$key } from './components/comment/__generated__/CommentList_query.graphql';
import { TabView, Route } from 'react-native-tab-view';
import { LiveChatList_query$key } from './components/comment/__generated__/LiveChatList_query.graphql';
import { NavigationContainer } from '@react-navigation/native';

import { CreateChallengeScreen } from './components/challenges/CreateChallengeScreen';
import { UserChallengesList_query$key } from './components/profile/__generated__/UserChallengesList_query.graphql';

export type LiveProps = {
    mainnetProvider: providers.InfuraProvider;
    localProvider: providers.JsonRpcProvider | providers.InfuraProvider;
    injectedProvider: providers.JsonRpcProvider | null;
    price: number;
    commentsQuery: LiveChatList_query$key;
} & AppQueryResponse;

export type ProfileStackParams = {
    Profile: {
        userChallengeQuery: UserChallengesList_query$key;
        me: ChallengeForm_me$key;
        mainnetProvider: providers.InfuraProvider;
    };
    CreateChallengeScreen: { jumpTo: (s: string) => void };
    LiveDashboard: Record<string, unknown>;
};

export type LineupStackParams = {
    Challenge: Record<string, unknown>;
    Lineup: { me: ChallengeForm_me$key };
};

export type VoteStackParams = {
    Vote: Record<string, unknown>;
    Outcome: Record<string, unknown>;
};

export type ProfileProps = StackScreenProps<ProfileStackParams, 'Profile'>;
export type ChallengeFormProps = StackScreenProps<
    ProfileStackParams,
    'CreateChallengeScreen'
>;

export type LiveDashboardProps = StackScreenProps<
    ProfileStackParams,
    'LiveDashboard'
>;

export type ChatProps = AppQueryResponse & {
    chatScroll: boolean;
    commentsQuery: CommentList_query$key;
    setWalletScroll: () => void;
};
export type LineupProps = AppQueryResponse;

const ProfileStackNavigator = createStackNavigator<ProfileStackParams>();

export function ProfileStack({
    mainnetProvider,
    me,
    jumpTo,
    userChallengeQuery
}: any): ReactElement {
    return (
        <ProfileStackNavigator.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerShown: false
            }}
        >
            <ProfileStackNavigator.Screen
                name="Profile"
                component={Profile}
                initialParams={{ mainnetProvider, me, userChallengeQuery }}
            />
            <ProfileStackNavigator.Screen
                name="CreateChallengeScreen"
                component={CreateChallengeScreen}
                initialParams={{ jumpTo }}
            />
            <ProfileStackNavigator.Screen
                name="LiveDashboard"
                component={LiveDashboard}
            />
        </ProfileStackNavigator.Navigator>
    );
}

const LineupStackNavigator = createStackNavigator<LineupStackParams>();

export function LineupStack({ me, setCanSwipe }: any): ReactElement {
    return (
        <NavigationContainer independent={true}>
            <LineupStackNavigator.Navigator
                initialRouteName="Lineup"
                screenOptions={{
                    headerShown: false,
                    cardStyle: {
                        backgroundColor: 'transparent'
                    }
                }}
            >
                <LineupStackNavigator.Screen
                    name="Lineup"
                    component={Lineup}
                    me={me}
                />
                <LineupStackNavigator.Screen
                    name="Challenge"
                    component={Challenge}
                    initialParams={{ setCanSwipe }}
                />
            </LineupStackNavigator.Navigator>
        </NavigationContainer>
    );
}

const VoteStackNavigator = createStackNavigator<VoteStackParams>();

export function VoteStack(): ReactElement {
    return (
        <NavigationContainer independent={true}>
            <VoteStackNavigator.Navigator
                initialRouteName="Vote"
                screenOptions={{
                    headerShown: false,
                    cardStyle: {
                        backgroundColor: 'transparent'
                    }
                }}
            >
                <VoteStackNavigator.Screen name="Vote" component={Vote} />
                <VoteStackNavigator.Screen name="Outcome" component={Outcome} />
            </VoteStackNavigator.Navigator>
        </NavigationContainer>
    );
}

const VoteStackNavigator = createStackNavigator<VoteStackParams>();

export function VoteStack(): ReactElement {
    return (
        <VoteStackNavigator.Navigator
            initialRouteName="Vote"
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: 'transparent'
                }
            }}
        >
            <VoteStackNavigator.Screen name="Vote" component={Vote} />
            <VoteStackNavigator.Screen name="Outcome" component={Outcome} />
        </VoteStackNavigator.Navigator>
    );
}

export function LiveTabs({
    liveChallenge,
    me,
    chatScroll,
    position,
    commentsQuery
}: any): ReactElement {
    const [index, setIndex] = React.useState(1);
    const [routes] = React.useState<Route[]>([
        { key: 'vote', title: 'Vote' },
        { key: 'chat', title: 'Chat' },
        { key: 'lineup', title: 'Lineup' }
    ]);
    const [canSwipe, setCanSwipe] = React.useState(true);

    const renderScene = ({ route }: { route: Route }) => {
        switch (route.key) {
            case 'vote':
                return <VoteStack />;
            case 'chat':
                return (
                    <Comments
                        liveChallenge={liveChallenge}
                        me={me}
                        chatScroll={chatScroll}
                        commentsQuery={commentsQuery}
                    />
                );
            case 'lineup':
                // return <LineupStack me={me} setCanSwipe={setCanSwipe} />;
                return;
            default:
                return null;
        }
    };
    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            position={position}
            swipeEnabled={canSwipe}
            renderTabBar={() => <></>}
        />
    );
}

export function MainTabs({
    mainnetProvider,
    localProvider,
    injectedProvider,
    price,
    liveChallenge,
    me,
    setWalletScroll,
    index,
    handleIndex,
    query
}: any): ReactElement {
    const [routes] = React.useState<Route[]>([
        { key: 'profile', title: 'Profile' },
        { key: 'live', title: 'Live' },
        { key: 'market', title: 'Market' }
    ]);

    const renderScene = ({ route, jumpTo }: { route: Route }) => {
        switch (route.key) {
            case 'profile':
                return (
                    <ProfileStack
                        mainnetProvider={mainnetProvider}
                        me={me}
                        jumpTo={jumpTo}
                        userChallengeQuery={query}
                    />
                );
            case 'live':
                return (
                    <Live
                        mainnetProvider={mainnetProvider}
                        localProvider={localProvider}
                        injectedProvider={injectedProvider}
                        price={price}
                        liveChallenge={liveChallenge}
                        me={me}
                        commentsQuery={query}
                    />
                );
            case 'market':
                return <Market />;
            default:
                return null;
        }
    };
    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={handleIndex}
            onSwipeStart={() => setWalletScroll(false)}
            renderTabBar={() => <></>}
        />
    );
}
