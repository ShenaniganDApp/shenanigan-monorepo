import React, { ComponentType } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { LiveTabs } from './Navigator';

export const Layout = ({ children, hasLiveTabs, me, liveChallenge }) => (
    <Swiper horizontal={false} showsPagination={false} loop={false} index={1}>
        <SafeAreaView>
            <Text>Top!</Text>
        </SafeAreaView>

        {children}

        {hasLiveTabs && (
            <SafeAreaView style={{ height: '100%' }}>
                <LiveTabs me={me} liveChallenge={liveChallenge} />
            </SafeAreaView>
        )}
    </Swiper>
);
