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
import CommentList from './components/comment/CommentList';
import Live from './components/Live/Live';
import LiveDashboard from './components/LiveDashboard/LiveDashboard';
import Poll from './components/Poll/Poll';
import Profile from './components/profile/Profile';

export type MainTabsParams = {
    Live: {
        address?: string;
        mainnetProvider: providers.InfuraProvider;
        localProvider: providers.JsonRpcProvider | providers.InfuraProvider;
        injectedProvider: providers.JsonRpcProvider | null;
        price: number;
        retry: unknown;
    };
    ProfileStack: { address?: string } & AppQueryResponse;
    Poll: Record<string, unknown>;
};

export type LiveTabProps = MaterialTopTabScreenProps<MainTabsParams, 'Live'>;
export type ProfileTabProps = MaterialTopTabScreenProps<
    MainTabsParams,
    'ProfileStack'
>;

export type ProfileStackParams = {
    Profile: Record<string, unknown> & AppQueryResponse;
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
    mainnetProvider,
    me
}: {
    mainnetProvider: providers.InfuraProvider;
} & AppQueryResponse): ReactElement {
    return (
        <ProfileStackNavigator.Navigator initialRouteName="Profile">
            <ProfileStackNavigator.Screen
                name="Profile"
                component={Profile}
                initialParams={{ me, mainnetProvider }}
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
    address,
    me,
    mainnetProvider,
    localProvider,
    injectedProvider,
    price
}: MainTabsParams['Live'] & AppQueryResponse): ReactElement {
    return (
        <MainTabNavigator.Navigator
            initialRouteName="Live"
            tabBarOptions={{ style: { display: 'none' } }}
        >
            <MainTabNavigator.Screen
                name="ProfileStack"
                component={ProfileStack}
                initialParams={{ address, me }}
            />
            <MainTabNavigator.Screen
                name="Live"
                component={Live}
                initialParams={{
                    address,
                    mainnetProvider,
                    localProvider,
                    injectedProvider,
                    price
                }}
            />
            <MainTabNavigator.Screen name="Poll" component={Poll} />
        </MainTabNavigator.Navigator>
    );
}

const LiveTabsNavigator = createMaterialTopTabNavigator<LiveTabsParams>();
export function LiveTabs(): ReactElement {
    return (
        <LiveTabsNavigator.Navigator initialRouteName="Comments">
            <LiveTabsNavigator.Screen name="Comments" component={CommentList} />
            <LiveTabsNavigator.Screen name="Election" component={() => <></>} />
        </LiveTabsNavigator.Navigator>
    );
}
