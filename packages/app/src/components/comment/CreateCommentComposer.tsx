import React, { useState } from 'react';
import { graphql } from 'react-relay';
import { TextInput, StyleSheet, View } from 'react-native';
import { useFragment, useMutation } from 'relay-hooks';
import { ROOT_ID } from 'relay-runtime';

import {
    CreateComment,
    updater,
    optimisticUpdater
} from './mutations/CreateCommentMutation';

import { CreateCommentMutation } from './mutations/__generated__/CreateCommentMutation.graphql';
import { CreateCommentComposer_liveChallenge$key } from './__generated__/CreateCommentComposer_liveChallenge.graphql';
import { CreateCommentComposer_me$key } from './__generated__/CreateCommentComposer_me.graphql';
import { RoundButton, colors } from '../UI';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor
} from 'react-native-reanimated';
import { Buttons } from '../Live/Buttons';

type Props = {
    liveChallenge: CreateCommentComposer_liveChallenge$key;
    me: CreateCommentComposer_me$key;
};

export function CreateCommentComposer(props: Props) {
    const [content, setContent] = useState('');
    const [buttonHeight, setButtonHeight] = useState(1);
    const sharedVal = useSharedValue(0);
    const animatedHeight = useSharedValue(1);

    const liveChallenge = useFragment<CreateCommentComposer_liveChallenge$key>(
        graphql`
            fragment CreateCommentComposer_liveChallenge on Challenge {
                id
                _id
                creator {
                    id
                }
            }
        `,
        props.liveChallenge
    );

    const me = useFragment<CreateCommentComposer_me$key>(
        graphql`
            fragment CreateCommentComposer_me on User {
                id
                username
                addresses
            }
        `,
        props.me
    );

    const [createComment, { loading }] = useMutation<CreateCommentMutation>(
        CreateComment
    );

    const handleCreateComment = () => {
        const input = {
            content,
            challengeId: liveChallenge ? liveChallenge._id : ''
        };

        const onError = () => {
            console.log('onErrorCreateComment');
        };
        const config = {
            variables: {
                input
            },
            updater: updater(),
            optimisticUpdater: optimisticUpdater(input, me),
            onCompleted: () => {
                setContent('');
            }
        };

        createComment(config);
    };

    const onFocus = () => {
        sharedVal.value = withTiming(1, { duration: 400 });
        animatedHeight.value = withTiming(1, { duration: 400 });
    };

    const onBlur = () => {
        sharedVal.value = withTiming(0, { duration: 400 });
        animatedHeight.value = withTiming(buttonHeight * -1, { duration: 400 });
    };

    const containerStyles = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            sharedVal.value,
            [0, 1],
            ['rgba(255,255,255, 0)', 'rgba(255,255,255,.5)']
        );

        const borderColor = interpolateColor(
            sharedVal.value,
            [0, 1],
            ['rgba(251, 250, 250, 0)', 'rgba(251, 250, 250, 0.7)']
        );

        return {
            backgroundColor,
            borderColor,
            marginTop: animatedHeight.value
        };
    });

    const inputBgStyles = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            sharedVal.value,
            [0, 1],
            ['rgba(255, 255, 255, .5)', 'rgba(230, 255, 255, 1)']
        );

        const borderColor = interpolateColor(
            sharedVal.value,
            [0, 1],
            ['rgba(255, 255, 255, .7)', 'rgba(230, 255, 255, 1)']
        );

        return {
            backgroundColor,
            borderColor
        };
    });

    const buttonsStyles = useAnimatedStyle(() => {
        return {
            opacity: sharedVal.value
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.background, containerStyles]}>
                <Animated.View
                    style={[buttonsStyles]}
                    onLayout={(e) => {
                        const { height } = e.nativeEvent.layout;
                        setButtonHeight(height);
                        animatedHeight.value = -height;
                    }}
                >
                    <Buttons />
                </Animated.View>
                <View style={styles.inputContainer}>
                    <View>
                        <Animated.View
                            style={[styles.inputBg, inputBgStyles]}
                        />
                        <TextInput
                            placeholder="Your Message"
                            value={content}
                            onChangeText={setContent}
                            style={[styles.input]}
                            placeholderTextColor="white"
                            multiline={true}
                            numberOfLines={1}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                    </View>
                    <RoundButton
                        icon="send"
                        small
                        iconSize={32}
                        iconStyle={{ marginRight: -3 }}
                        onPress={handleCreateComment}
                        disabled={content.trim() === ''}
                        style={styles.sendButton}
                    />
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: '3%'
    },
    background: {
        padding: '3%',
        borderRadius: 10,
        borderWidth: 1
    },
    buttonsContainer: {
        marginBottom: '3%'
    },
    inputContainer: {
        justifyContent: 'center',
        marginTop: '3%'
    },
    inputBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 10,
        borderWidth: 1
    },
    input: {
        color: colors.grayMedium,
        borderRadius: 10,
        paddingLeft: '3%',
        paddingRight: 60,
        paddingBottom: '4.5%',
        paddingTop: '4.5%',
        maxHeight: 80
    },
    sendButton: {
        position: 'absolute',
        right: 10
    }
});
