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
import { ChallengeForm } from './components/challenges/ChallengeForm';
import { Challenge } from './components/challenges/Challenge';
import { ChallengeForm_me$key } from './components/challenges/__generated__/ChallengeForm_me.graphql';
import { CommentList_query$key } from './components/comment/__generated__/CommentList_query.graphql';
import { TabView, Route } from 'react-native-tab-view';
import { LiveChatList_query$key } from './components/comment/__generated__/LiveChatList_query.graphql';

export type LiveProps = {
    mainnetProvider: providers.InfuraProvider;
    localProvider: providers.JsonRpcProvider | providers.InfuraProvider;
    injectedProvider: providers.JsonRpcProvider | null;
    price: number;
    commentsQuery: LiveChatList_query$key;
} & AppQueryResponse;

export type ProfileStackParams = {
    Profile: Record<string, unknown>;
    ChallengeForm: { me: ChallengeForm_me$key };
    LiveDashboard: Record<string, unknown>;
};

export type LineupStackParams = {
    Challenge: Record<string, unknown>;
    Lineup: { me: ChallengeForm_me$key };
};

export type ProfileProps = StackScreenProps<ProfileStackParams, 'Profile'>;
export type ChallengeFormProps = StackScreenProps<
    ProfileStackParams,
    'ChallengeForm'
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
    mainnetProvider
}: {
    mainnetProvider: providers.InfuraProvider;
}): ReactElement {
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
                initialParams={{ mainnetProvider }}
            />
            <ProfileStackNavigator.Screen
                name="ChallengeForm"
                component={ChallengeForm}
                options={{
                    headerShown: true,
                    headerBackTitle: 'Go Back',
                    headerTitle: ''
                }}
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
                return <></>;
            case 'chat':
                return (
                    <Compments
                        liveChallenge={liveChallenge}
                        me={me}
                        chatScroll={chatScroll}
                        commentsQuery={commentsQuery}
                    />
                );
            case 'lineup':
                return <LineupStack me={me} setCanSwipe={setCanSwipe} />;
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
    commentsQuery
}: any): ReactElement {
    const [routes] = React.useState<Route[]>([
        { key: 'profile', title: 'Profile' },
        { key: 'live', title: 'Live' },
        { key: 'market', title: 'Market' }
    ]);

    const renderScene = ({ route }: { route: Route }) => {
        switch (route.key) {
            case 'profile':
                return <ProfileStack mainnetProvider={mainnetProvider} />;
            case 'live':
                return (
                    <Live
                        mainnetProvider={mainnetProvider}
                        localProvider={localProvider}
                        injectedProvider={injectedProvider}
                        price={price}
                        liveChallenge={liveChallenge}
                        me={me}
                        commentsQuery={commentsQuery}
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
