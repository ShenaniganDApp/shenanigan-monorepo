import React, { ReactElement, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../UI';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LiveChatList } from '../comment/LiveChatList';
import { LiveChatList_query$key } from '../comment/__generated__/LiveChatList_query.graphql';
import { Fade } from '../UI';
import { LiveChatComposer } from './LiveChatComposer';
import { LiveChatComposer_liveChallenge$key } from './__generated__/LiveChatComposer_liveChallenge.graphql';
import { LiveChatComposer_me$key } from './__generated__/LiveChatComposer_me.graphql';

type Props = {
    commentsQuery: LiveChatList_query$key;
    animationEvent: boolean;
    image: string;
};

export const LiveChat = ({
    liveChallenge,
    commentsQuery,
    animationEvent,
    image,
    me
}: Props): ReactElement => {
    const [inputVisible, setInputVisible] = useState(false);
    const [animation, setAnimation] = useState(false);
    const [moveAnimation] = useState(() => new Animated.Value(0));

    const handlePress = () => {
        setAnimation(!animation);
        if (!inputVisible) {
            moveUp(-55);
            setInputVisible(true);
        }
    };

    const moveUp = (toValue: number) => {
        Animated.timing(moveAnimation, {
            toValue,
            duration: 400,
            useNativeDriver: true
        }).start();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={48}
        >
            <Fade event={animationEvent} up>
                <LinearGradient
                    colors={['#00000000', 'black']}
                    style={{ overflow: 'visible' }}
                >
                    <View style={styles.container}>
                        <Animated.View
                            style={{
                                transform: [{ translateY: moveAnimation }]
                            }}
                        >
                            <View style={styles.messagesContainer}>
                                <LiveChatList query={commentsQuery} />
                                {!inputVisible && (
                                    <Plus onPress={handlePress} />
                                )}
                            </View>
                        </Animated.View>

                        {inputVisible && (
                            <Fade
                                up
                                duration={400}
                                event={animation}
                                afterAnimationOut={() => setInputVisible(false)}
                            >
                                <LiveChatComposer
                                    image={image}
                                    liveChallenge={liveChallenge}
                                    me={me}
                                />
                            </Fade>
                        )}
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

const Plus = ({ onPress }) => (
    <TouchableOpacity style={styles.plusIcon} onPress={onPress}>
        <Icon name="plus" size={40} color="white" />
    </TouchableOpacity>
);

const Cash = () => (
    <View style={styles.cashBg}>
        <View style={styles.cashBgInner}>
            <Icon name="currency-usd" size={22} color={colors.pink} />
        </View>
    </View>
);

const Donation = () => (
    <View style={styles.donation}>
        <Text style={styles.donationText}>$5.00</Text>
    </View>
);
