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

import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

import { LiveChatList } from '../comment/LiveChatList';
import { LiveChatList_query$key } from '../comment/__generated__/LiveChatList_query.graphql';

type Props = { commentsQuery: LiveChatList_query$key };
export const LiveChat = ({ commentsQuery }: Props): ReactElement => {
    const [inputVisible, setInputVisible] = useState(false);
    const [fadeAnimation] = useState(() => new Animated.Value(0));

    const fadeIn = () => {
        Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
        }).start();
    };

    const handlePress = () => {
        setInputVisible(true);
        fadeIn();
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={48}
        >
            <LinearGradient colors={['#00000000', 'black']}>
                <View style={styles.container}>
                    <Pinned />
                    <View style={styles.messagesContainer}>
                        <LiveChatList query={commentsQuery} />
                        {!inputVisible && <Plus onPress={handlePress} />}
                    </View>
                    {inputVisible && (
                        <Animated.View style={{ opacity: fadeAnimation }}>
                            <ChatInput />
                        </Animated.View>
                    )}
                </View>
            </LinearGradient>
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
    pinnedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12
    },
    pinnedTextContainer: {
        backgroundColor: 'rgba(255,255,255,.3)',
        flex: 1,
        justifyContent: 'center',
        padding: 12
    },
    pinnedTitle: {
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 6
    },
    pinnedIconBg: {
        backgroundColor: colors.pink,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 12
    },
    pinnedText: {
        color: 'white'
    },
    inputContainer: {
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        borderColor: 'white',
        color: 'white',
        paddingTop: 6,
        flex: 1,
        marginRight: 12,
        backgroundColor: 'rgba(255,255,255,.3)',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        fontSize: 16
    },
    submit: {
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
    }
});

const Plus = ({ onPress }) => (
    <TouchableOpacity style={styles.plusIcon} onPress={onPress}>
        <Icon name="plus" size={40} color="white" />
    </TouchableOpacity>
);

const Pinned = () => (
    <View style={styles.pinnedContainer}>
        <View style={styles.pinnedTextContainer}>
            <Text style={styles.pinnedTitle}>This is pinned info</Text>
            <Text style={styles.pinnedText}>
                Information about the stream or something
            </Text>
        </View>
        <View style={styles.pinnedIconBg}>
            <Icon name="pin" size={32} color="white" />
        </View>
    </View>
);

const ChatInput = () => {
    const [message, setMessage] = useState('');

    return (
        <View style={styles.inputContainer}>
            <View style={styles.image} />
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={(text) => setMessage(text)}
                placeholder="Type your message..."
                placeholderTextColor="#ddd"
                keyboardType="default"
                multiline={true}
                numberOfLines={4}
            />
            <TouchableOpacity
                style={styles.submit}
                disabled={!(message.length > 0)}
            >
                <Icon
                    name="send"
                    size={24}
                    color="white"
                    style={{
                        marginRight: -3,
                        opacity: message.length > 0 ? 1 : 0.4
                    }}
                />
            </TouchableOpacity>
        </View>
    );
};

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
