import React, { ComponentType } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { LiveTabs } from './Navigator';

function withLayout<T>(
    WrappedComponent: ComponentType<T>,
    hasLiveTabs?: boolean
) {
    const HOC = (props: T) => {
        return (
            <Swiper
                horizontal={false}
                showsPagination={false}
                loop={false}
                index={1}
            >
                <SafeAreaView>
                    <Text>Top!</Text>
                </SafeAreaView>

                <SafeAreaView style={{ height: '100%' }}>
                    <WrappedComponent {...props} />
                </SafeAreaView>

                {hasLiveTabs && (
                    <SafeAreaView style={{ height: '100%' }}>
                        <LiveTabs />
                    </SafeAreaView>
                )}
            </Swiper>
        );
    };
    return HOC;
}

export default withLayout;
