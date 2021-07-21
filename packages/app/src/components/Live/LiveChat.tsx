import React, { ReactElement, useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { LiveChatList_query$key } from '../comment/__generated__/LiveChatList_query.graphql';
import { LiveChatList } from '../comment/LiveChatList';
import { colors, Fade,RoundButton  } from '../UI';
import { LiveChatComposer_liveChallenge$key } from './__generated__/LiveChatComposer_liveChallenge.graphql';
import { LiveChatComposer_me$key } from './__generated__/LiveChatComposer_me.graphql';
import { Buttons } from './Buttons';
import { LiveChatComposer } from './LiveChatComposer';

type Props = {
    setBottomSheetVisible: (b: boolean) => void;
    commentsQuery: LiveChatList_query$key;
    animationEvent: boolean;
    overlayVisible: boolean;
    image: string;
};

export const LiveChat = ({
    liveChallenge,
    commentsQuery,
    animationEvent,
    image,
    setBottomSheetVisible,
    me,
    overlayVisible,
    content,
    setContent
}: Props): ReactElement => {
    const [inputVisible, setInputVisible] = useState(false);
    const [animation, setAnimation] = useState(false);
    const [inputHeight, setInputHeight] = useState(62);
    const moveAnimation = useSharedValue(inputHeight);

    const handlePress = () => {
        setAnimation(!animation);
        if (!inputVisible) {
            setInputVisible(true);
        }
    };

    const animationOptions = {
        duration: inputVisible ? 300 : 0,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    };

    useEffect(() => {
        if (inputVisible) {
            moveAnimation.value = 0;
        } else {
            moveAnimation.value = inputHeight;
        }
    }, [inputVisible, inputHeight]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: withTiming(
                        moveAnimation.value,
                        animationOptions
                    )
                }
            ]
        };
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={48}
            pointerEvents={overlayVisible ? 'box-none' : 'none'}
        >
            <Fade
                event={animationEvent}
                up
                pointerEvents="box-none"
                afterAnimationOut={() => {
                    setInputVisible(false);
                    setAnimation(false);
                }}
            >
                <LinearGradient
                    colors={['#00000000', 'black']}
                    style={{ overflow: 'visible' }}
                    pointerEvents="box-none"
                >
                    <View style={styles.container} pointerEvents="box-none">
                        <Animated.View
                            style={animatedStyle}
                            pointerEvents="auto"
                        >
                            <View style={styles.messagesContainer}>
                                <LiveChatList query={commentsQuery} />
                                {!inputVisible && (
                                    <RoundButton
                                        onPress={handlePress}
                                        icon="plus"
                                        style={{ width: 46, height: 46 }}
                                    />
                                )}
                            </View>
                        </Animated.View>

                        <View
                            onLayout={(event) =>
                                setInputHeight(event.nativeEvent.layout.height)
                            }
                            style={{
                                zIndex: inputVisible ? 1 : -3,
                                paddingTop: '4%'
                            }}
                        >
                            <Fade
                                duration={400}
                                event={animation}
                                afterAnimationOut={() => setInputVisible(false)}
                            >
                                <Buttons
                                    onPredictLeft={() => console.log('predict')}
                                    onDonate={() => setBottomSheetVisible(true)}
                                    onPredictRight={() =>
                                        console.log('predict')
                                    }
                                />
                                <LiveChatComposer
                                    image={image}
                                    liveChallenge={liveChallenge}
                                    me={me}
                                    content={content}
                                    setContent={setContent}
                                />
                            </Fade>
                        </View>
                    </View>
                </LinearGradient>
            </Fade>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: 'flex-end'
    },
    messagesContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    plusIcon: {
        backgroundColor: 'rgba(150,150,150, .4)',
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cashBg: {
        backgroundColor: colors.pink,
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cashBgInner: {
        backgroundColor: '#240C15',
        height: 26,
        width: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center'
    },
    donation: {
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8
    },
    donationText: {
        fontWeight: 'bold',
        color: '#240C15'
    },
    image: {
        marginRight: 12
    }
});
