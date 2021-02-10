import {
    createMaterialTopTabNavigator,
    MaterialTopTabScreenProps
} from '@react-navigation/material-top-tabs';
import {
    createStackNavigator,
    StackScreenProps
} from '@react-navigation/stack';
import { providers } from 'ethers';
import React, { ReactElement, useContext, useEffect } from 'react';

import { AppQueryResponse } from './__generated__/AppQuery.graphql';
import { Lineup } from './components/lineup/Lineup';
import { Comments } from './components/comment/Comments';
import { Live } from './components/Live/Live';
import { LiveDashboard } from './components/LiveDashboard/LiveDashboard';
import { Profile } from './components/profile/Profile';
import { Market } from './components/market/Market';
import { ChallengeForm } from './components/challenges/ChallengeForm';
import { ChallengeForm_me$key } from './components/challenges/__generated__/ChallengeForm_me.graphql';
import { TabView, Route } from 'react-native-tab-view';
export type MainTabsParams = {
    Live: {
        mainnetProvider: providers.InfuraProvider;
        localProvider: providers.JsonRpcProvider | providers.InfuraProvider;
        injectedProvider: providers.JsonRpcProvider | null;
        price: number;
    } & AppQueryResponse;
    ProfileStack: { address?: string } & AppQueryResponse;
    Market: Record<string, unknown>;
};

export type LiveProps = {
    mainnetProvider: providers.InfuraProvider;
    localProvider: providers.JsonRpcProvider | providers.InfuraProvider;
    injectedProvider: providers.JsonRpcProvider | null;
    price: number;
} & AppQueryResponse;

export type ProfileStackParams = {
    Profile: Record<string, unknown>;
    ChallengeForm: { me: ChallengeForm_me$key };
    LiveDashboard: Record<string, unknown>;
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

export function LiveTabs({ liveChallenge, me, chatScroll }: any): ReactElement {
    const [index, setIndex] = React.useState(1);

    const [routes] = React.useState<Route[]>([
        { key: 'vote', title: 'Vote' },
        { key: 'chat', title: 'Chat' },

        { key: 'lineup', title: 'Lineup' }
    ]);

    const renderScene = ({ route }: { route: Route }) => {
        switch (route.key) {
            case 'vote':
                return <></>;
            case 'chat':
                return (
                    <Comments
                        liveChallenge={liveChallenge}
                        me={me}
                        chatScroll={chatScroll}
                    />
                );
            case 'lineup':
                return <Lineup me={me} />;
            default:
                return null;
        }
    };
    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
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
    handleIndex
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
