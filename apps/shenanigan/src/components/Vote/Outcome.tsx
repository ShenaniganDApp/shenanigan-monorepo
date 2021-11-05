import React, { ReactElement, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabNavSwipeContext, SwiperContext } from '../../contexts';
import { OutcomeCard } from './OutcomeCard';

import { Video, Gradient, Title, colors, sizes, backgroundStyles } from '../UI';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

export const Outcome = (props: any): ReactElement => {
    const navigation = useNavigation();
    const { setWalletScroll } = useContext(SwiperContext);
    const { setLiveTabsSwipe } = useContext(TabNavSwipeContext);
    const { top } = useSafeAreaInsets();

    useEffect(() => {
        setLiveTabsSwipe(false);
        setWalletScroll(false);
    }, []);

    return (
        <Gradient>
            <View
                style={{
                    flex: 1,
                    paddingTop: top || '4%'
                }}
            >
                <ScrollView
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={[
                            styles.container,
                            { marginBottom: top || '4%' }
                        ]}
                    >
                        <View style={styles.backButton}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                            >
                                <Icon
                                    name="chevron-left"
                                    size={42}
                                    color={colors.pink}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.videoContainer}>
                            <Video
                                source={{
                                    uri:
                                        'https://www.w3schools.com/html/mov_bbb.mp4'
                                }}
                                style={{ alignSelf: 'center', borderRadius: 5 }}
                                controls={true}
                            />
                        </View>

                        <Title size={30} style={styles.center}>
                            This is the one time I’m going to be able to land
                            this trick shot, watch now!
                        </Title>

                        <View style={styles.background}>
                            <Title size={24} style={styles.center}>
                                5 Hours left to vote
                            </Title>

                            <OutcomeCard
                                positive
                                votesToFlip={17}
                                title="I'll crush it"
                                description="I lift it with one hand, I’m amazing. This description goes on and on and on and should wrap around."
                            />
                            <OutcomeCard
                                title="I drop the weight oh no"
                                description="I lift it with one hand, I’m amazing. This description goes on and on and on and should wrap around."
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Gradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '4%'
    },
    backButton: {
        position: 'absolute',
        left: '2%',
        top: 0,
        zIndex: 10
    },
    icon: {
        textShadowColor: 'rgba(0,0,0,.3)',
        textShadowOffset: {
            width: 0,
            height: 3
        },
        textShadowRadius: 5
    },
    videoContainer: {
        height: sizes.windowH * 0.33,
        alignItems: 'center',
        alignSelf: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: 10,
        elevation: 10,
        backgroundColor: '#444',
        borderRadius: 5,
        marginBottom: '4%'
    },
    center: {
        textAlign: 'center'
    },
    background: {
        ...backgroundStyles.basic,
        padding: '4%',
        marginTop: '4%',
        borderRadius: 10
    }
});
