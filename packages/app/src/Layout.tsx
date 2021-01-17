import React, { useEffect, useState, useRef } from 'react';
import Swiper from 'react-native-swiper';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LiveTabProps, LiveTabs } from './Navigator';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
    children?: React.ReactChild | React.ReactChild[];
};

const Layout = ({
    children,
    bottom,
    me,
    liveChallenge
}: Props): React.ReactElement => {
    const [index, setIndex] = useState(1);
    const refContainer = useRef(null);

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            console.log('swiper');
            refContainer.current.scrollBy(1);
            setIndex(1);
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    return (
        <Swiper
            horizontal={false}
            showsPagination={false}
            loop={false}
            index={index}
            onIndexChanged={(index) => console.log(index)}
            ref={refContainer}
        >
            <SafeAreaView>
                <Text>top</Text>
            </SafeAreaView>
            {children}
            {bottom && (
                <SafeAreaView style={{ height: '100%' }}>
                    <LiveTabs me={me} liveChallenge={liveChallenge} />
                </SafeAreaView>
            )}
        </Swiper>
    );
};

export default Layout;
