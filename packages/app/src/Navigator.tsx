import {
    createMaterialTopTabNavigator,
    MaterialTopTabScreenProps
} from '@react-navigation/material-top-tabs';
import {
    createStackNavigator,
    StackScreenProps
} from '@react-navigation/stack';
import { providers } from 'ethers';
import React, { ReactElement } from 'react';

import { AppQueryResponse } from './__generated__/AppQuery.graphql';
import { Comments_liveChallenge$key } from './components/comment/__generated__/Comments_liveChallenge.graphql';
import { Comments_me$key } from './components/comment/__generated__/Comments_me.graphql';
import { Live_me$key } from './components/Live/__generated__/Live_me.graphql';
import { Comments } from './components/comment/Comments';
import { Live } from './components/Live/Live';
import { LiveDashboard } from './components/LiveDashboard/LiveDashboard';
// import Poll from './components/market/Market';
import { Profile } from './components/profile/Profile';
import { Market } from './components/market/Market';
import { ChallengeForm } from './components/challenges/ChallengeForm';

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

export type LiveTabProps = MaterialTopTabScreenProps<MainTabsParams, 'Live'>;
export type ProfileTabProps = MaterialTopTabScreenProps<
    MainTabsParams,
    'ProfileStack'
>;

export type ProfileStackParams = {
    Profile: Record<string, unknown>;
    ChallengeForm: Record<string, unknown>;
    LiveDashboard: Record<string, unknown>;
};

export type ProfileProps = StackScreenProps<ProfileStackParams, 'Profile'>;

export type LiveDashboardProps = StackScreenProps<
    ProfileStackParams,
    'LiveDashboard'
>;

export type LiveTabsParams = {
    Comments: AppQueryResponse;
    Election: Record<string, unknown>;
};

export type CommentsTabProps = MaterialTopTabScreenProps<
    LiveTabsParams,
    'Comments'
>;
export type ElectionTabsProps = MaterialTopTabScreenProps<
    LiveTabsParams,
    'Election'
>;

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
            />
            <ProfileStackNavigator.Screen
                name="LiveDashboard"
                component={LiveDashboard}
            />
        </ProfileStackNavigator.Navigator>
    );
}

const LiveTabsNavigator = createMaterialTopTabNavigator<LiveTabsParams>();

export function LiveTabs({
    liveChallenge,
    me
}: LiveTabsParams['Comments'] & LiveTabsParams['Election']): ReactElement {
    return (
        <LiveTabsNavigator.Navigator initialRouteName="Comments">
            <LiveTabsNavigator.Screen
                name="Comments"
                component={Comments}
                initialParams={{
                    liveChallenge,
                    me
                }}
            />
            <LiveTabsNavigator.Screen name="Election">
                {() => <></>}
            </LiveTabsNavigator.Screen>
        </LiveTabsNavigator.Navigator>
    );
}

const MainTabNavigator = createMaterialTopTabNavigator<MainTabsParams>();
export function MainTabsStack({
    mainnetProvider,
    localProvider,
    injectedProvider,
    price,
    liveChallenge,
    me
}: any): ReactElement {
    return (
        <MainTabNavigator.Navigator
            initialRouteName="Live"
            tabBarOptions={{ style: { display: 'none' } }}
        >
            <MainTabNavigator.Screen
                name="ProfileStack"
                component={ProfileStack}
            />
            <MainTabNavigator.Screen
                name="Live"
                component={Live}
                initialParams={{
                    mainnetProvider,
                    localProvider,
                    injectedProvider,
                    price,
                    liveChallenge,
                    me
                }}
            />
            <MainTabNavigator.Screen name="Market" component={Market} />
        </MainTabNavigator.Navigator>
    );
}
