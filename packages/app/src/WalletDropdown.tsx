import React, { useContext, useState } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { TabSwipeContext } from './contexts';
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
    const { setCanSwipe } = useContext(TabSwipeContext);

    const handleSwipe = (index: number) => {
        if (index === 0) {
            setCanSwipe(false);
        } else {
            setCanSwipe(true);
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
                <SafeAreaView style={{ flex: 1 }}>
                    <LiveTabs me={me} liveChallenge={liveChallenge} />
                </SafeAreaView>
            )}
        </Swiper>
    );
};
