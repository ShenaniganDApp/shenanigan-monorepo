import React from 'react';

import {
    createMaterialTopTabNavigator,
    MaterialTopTabScreenProps
} from '@react-navigation/material-top-tabs';

import Profile from './components/profile/Profile';
import Live from './components/Live/Live';
import Poll from './components/Poll/Poll';

import { AppQueryResponse } from './__generated__/AppQuery.graphql';

export type MainTabsParams = {
    Live: { address: string };
    Profile: { address: string } & AppQueryResponse;
    Poll: {};
};

export type LiveTabsProps = MaterialTopTabScreenProps<MainTabsParams, 'Live'>;
export type ProfileTabsProps = MaterialTopTabScreenProps<
    MainTabsParams,
    'Profile'
>;

const MainTabNavigator = createMaterialTopTabNavigator<MainTabsParams>();
export function MainTabsStack({
    address,
    me,
    retry
}: {
    address: string;
    retry : unknown
} & AppQueryResponse) {
    return (
        <MainTabNavigator.Navigator
            initialRouteName={'Live'}
            tabBarOptions={{ style: { display: 'none' } }}
        >
            <MainTabNavigator.Screen
                name="Profile"
                component={Profile}
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
