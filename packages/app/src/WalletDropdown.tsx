import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { TabSwipeContext } from './contexts/TabSwipe';
import { LiveTabs } from './Navigator';

interface Props {
    children: any;
    hasLiveTabs?: boolean;
    me?: any;
    liveChallenge?: any;
}

export const WalletDropdown = ({
    children,
    hasLiveTabs,
    me,
    liveChallenge
}: Props) => {
    const { value, setValue } = useContext(TabSwipeContext);

    const handleSwipe = (index) => {
        if (index === 0) {
            setValue(false);
        } else {
            setValue(true);
        }
    };

    return (
        <Swiper
            horizontal={false}
            showsPagination={false}
            loop={false}
            index={1}
            onIndexChanged={(index) => handleSwipe(index)}
        >
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
};
