import React from 'react';

import {
    createMaterialTopTabNavigator,
    MaterialTopTabScreenProps
} from '@react-navigation/material-top-tabs';

import {
    createStackNavigator,
    StackScreenProps
} from '@react-navigation/stack';

import { CompositeNavigationProp } from '@react-navigation/native';

import Profile from './components/profile/Profile';
import Live from './components/Live/Live';
import Poll from './components/Poll/Poll';
import LiveDashboard from './components/LiveDashboard/LiveDashboard';
import CommentList from './components/comment/CommentList';

import { AppQueryResponse } from './__generated__/AppQuery.graphql';
import { providers } from 'ethers';

export type MainTabsParams = {
    Live: {
        address?: string;
        mainnetProvider: providers.InfuraProvider;
        localProvider: providers.JsonRpcProvider | providers.InfuraProvider;
        injectedProvider: providers.JsonRpcProvider;
        price: number;
        retry: unknown;
    };
    ProfileStack: { address?: string } & AppQueryResponse;
    Poll: {};
};

export type LiveTabProps = MaterialTopTabScreenProps<MainTabsParams, 'Live'>;
export type ProfileTabProps = MaterialTopTabScreenProps<
    MainTabsParams,
    'ProfileStack'
>;

export type ProfileStackParams = {
    Profile: {} & AppQueryResponse;
    LiveDashboard: {};
};

export type ProfileProps = StackScreenProps<ProfileStackParams, 'Profile'>;

export type LiveDashboardProps = StackScreenProps<
    ProfileStackParams,
    'LiveDashboard'
>;

export type LiveTabsParams = {
    Comments: {};
    Election: {};
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
    address,
    mainnetProvider,
    me
}: {
    address: string;
    mainnetProvider: providers.InfuraProvider;
} & AppQueryResponse) {
    return (
        <ProfileStackNavigator.Navigator initialRouteName={'Profile'}>
            <ProfileStackNavigator.Screen
                name="Profile"
                component={Profile}
                initialParams={{ me }}
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
    retry,
    mainnetProvider,
    localProvider,
    injectedProvider,
    price
}: MainTabsParams['Live'] & AppQueryResponse) {
    return (
        <MainTabNavigator.Navigator
            initialRouteName={'Live'}
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
export function LiveTabs() {
    return (
        <LiveTabsNavigator.Navigator initialRouteName={'Comments'}>
            <LiveTabsNavigator.Screen name="Comments" component={CommentList} />
            <LiveTabsNavigator.Screen
                name="Election"
                component={() => <></>}
            />
        </LiveTabsNavigator.Navigator>
    );
}
