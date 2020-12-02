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
import {Comments} from './components/comment/Comments';
import Live from './components/Live/Live';
import LiveDashboard from './components/LiveDashboard/LiveDashboard';
// import Poll from './components/market/Market';
import Profile from './components/profile/Profile';

export type MainTabsParams = {
    Live: {
        mainnetProvider: providers.InfuraProvider;
        localProvider: providers.JsonRpcProvider | providers.InfuraProvider;
        injectedProvider: providers.JsonRpcProvider | null;
        price: number;
    };
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
    LiveDashboard: Record<string, unknown>;
};

export type ProfileProps = StackScreenProps<ProfileStackParams, 'Profile'>;

export type LiveDashboardProps = StackScreenProps<
    ProfileStackParams,
    'LiveDashboard'
>;

export type LiveTabsParams = {
    Comments: Record<string, unknown>;
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

function ProfileStack({
    mainnetProvider
}: {
    mainnetProvider: providers.InfuraProvider;
}): ReactElement {
    return (
        <ProfileStackNavigator.Navigator initialRouteName="Profile">
            <ProfileStackNavigator.Screen
                name="Profile"
                component={Profile}
                initialParams={{ mainnetProvider }}
            />
            <ProfileStackNavigator.Screen
                name="LiveDashboard"
                component={LiveDashboard}
            />
        </ProfileStackNavigator.Navigator>
    );
}

const MainTabNavigator = createMaterialTopTabNavigator<MainTabsParams>();
export function MainTabsStack({
    mainnetProvider,
    localProvider,
    injectedProvider,
    price
}: MainTabsParams['Live']): ReactElement {
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
                    price
                }}
            />
            <MainTabNavigator.Screen name="Market" >{()=><></>}</MainTabNavigator.Screen>
        </MainTabNavigator.Navigator>
    );
}

const LiveTabsNavigator = createMaterialTopTabNavigator<LiveTabsParams>();
export function LiveTabs(): ReactElement {
    return (
        <LiveTabsNavigator.Navigator initialRouteName="Comments">
            <LiveTabsNavigator.Screen name="Comments" component={Comments} />
            <LiveTabsNavigator.Screen name="Election" component={() => <></>} />
        </LiveTabsNavigator.Navigator>
    );
}
