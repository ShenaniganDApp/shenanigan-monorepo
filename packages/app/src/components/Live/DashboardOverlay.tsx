import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { LiveChatList } from '../comment/LiveChatList';
import { DashboardButtons } from './DashboardButtons';
import { DashboardDetailsCard } from './DashboardDetailsCard';
import { DashboardSupportCard } from './DashboardSupportCard';
import { DashboardToggle } from './DashboardToggle';
import { LiveChatList_query$key } from '../comment/__generated__/LiveChatList_query.graphql';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    commentsQuery: LiveChatList_query$key;
};

export const DashboardOverlay = ({ commentsQuery }: Props): ReactElement => {
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [supportVisible, setSupportVisible] = useState(false);
    const [footerHeight, setFooterHeight] = useState(0);
    const commentsOpacity = useSharedValue(0);
    const { bottom } = useSafeAreaInsets();

    const commentsStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(commentsOpacity.value, {
                duration: 300
            })
        };
    });

    useEffect(() => {
        commentsOpacity.value = commentsVisible ? 1 : 0;
    }, [commentsVisible]);

    return (
        <View style={styles.container}>
            <View style={[styles.header, styles.padding]}>
                <DashboardToggle live={false} />
                <DashboardSupportCard
                    visible={supportVisible}
                    positiveVotes={300}
                    negativeVotes={200}
                />
                <DashboardDetailsCard visible={detailsVisible} />
            </View>

            <View>
                <Animated.View
                    style={commentsStyle}
                    pointerEvents={commentsVisible ? 'auto' : 'none'}
                >
                    <LinearGradient
                        colors={['#00000000', '#000000a4']}
                        style={[
                            styles.padding,
                            { paddingBottom: footerHeight + bottom }
                        ]}
                    >
                        <LiveChatList query={commentsQuery} />
                    </LinearGradient>
                </Animated.View>

                <DashboardButtons
                    commentsVisible={commentsVisible}
                    setCommentsVisible={setCommentsVisible}
                    detailsVisible={detailsVisible}
                    setDetailsVisible={setDetailsVisible}
                    supportVisible={supportVisible}
                    setSupportVisible={setSupportVisible}
                    setFooterHeight={setFooterHeight}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    padding: {
        paddingHorizontal: '4%'
    },
    flex: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        marginTop: '4%'
    }
});
