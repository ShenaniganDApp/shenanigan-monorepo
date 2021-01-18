import {
    createMaterialTopTabNavigator,
    MaterialTopTabScreenProps
} from '@react-navigation/material-top-tabs';
import {
    createStackNavigator,
    StackScreenProps
} from '@react-navigation/stack';
import { providers } from 'ethers';
import React, { ReactElement, useContext } from 'react';

import { AppQueryResponse } from './__generated__/AppQuery.graphql';
import { Lineup } from './components/lineup/Lineup';
import { Comments } from './components/comment/Comments';
import { Live } from './components/Live/Live';
import { LiveDashboard } from './components/LiveDashboard/LiveDashboard';
import { Profile } from './components/profile/Profile';
import { Market } from './components/market/Market';
import { ChallengeForm } from './components/challenges/ChallengeForm';
import { TabSwipeContext } from './contexts/TabSwipe';

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
    Lineup: AppQueryResponse;
};

export type CommentsTabProps = MaterialTopTabScreenProps<
    LiveTabsParams,
    'Comments'
>;
export type LineupTabProps = MaterialTopTabScreenProps<
    LiveTabsParams,
    'Lineup'
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
}: LiveTabsParams['Comments'] & LiveTabsParams['Lineup']): ReactElement {
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
            <LiveTabsNavigator.Screen
                name="Lineup"
                component={Lineup}
                initialParams={{ me }}
            />
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
    const { value } = useContext(TabSwipeContext);

    return (
        <MainTabNavigator.Navigator
            initialRouteName="Live"
            tabBarOptions={{ style: { display: 'none' } }}
            swipeEnabled={value}
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
