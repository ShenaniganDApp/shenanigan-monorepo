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

import { AppQueryResponse } from './__generated__/AppQuery.graphql';

export type MainTabsParams = {
    Live: { address: string };
    ProfileStack: { address: string } & AppQueryResponse;
    Poll: {};
};

export type LiveTabsProps = MaterialTopTabScreenProps<MainTabsParams, 'Live'>;
export type ProfileTabsProps = MaterialTopTabScreenProps<
    MainTabsParams,
    'ProfileStack'
>;

export type ProfileStackParams = {
    Profile: {} & AppQueryResponse;
    LiveDashboard: {};
};

export type ProfileProps = StackScreenProps<
    ProfileStackParams,
    'Profile'
>;

export type LiveDashboardProps = StackScreenProps<
    ProfileStackParams,
    'LiveDashboard'
>;

const ProfileStackNavigator = createStackNavigator<ProfileStackParams>();

function ProfileStack({ address, me }: { address: string } & AppQueryResponse) {
    return (
        <ProfileStackNavigator.Navigator initialRouteName={'Profile'}>
            <ProfileStackNavigator.Screen name="Profile" component={Profile} initialParams={{me}} />
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
    retry
}: {
    address: string;
    retry: unknown;
} & AppQueryResponse) {
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
                initialParams={{ address }}
            />
            <MainTabNavigator.Screen name="Poll" component={Poll} />
        </MainTabNavigator.Navigator>
    );
}
