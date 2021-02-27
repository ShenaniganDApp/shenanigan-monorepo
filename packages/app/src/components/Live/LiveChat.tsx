import React, { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../UI';

import {
    FlatList,
    TextInput,
    TouchableOpacity
} from 'react-native-gesture-handler';

export const LiveChat = (): ReactElement => {
    return (
        <LinearGradient colors={['#00000000', 'black']}>
            <View
                style={{
                    paddingHorizontal: 16,
                    paddingVertical: 28
                }}
            >
                <Pinned />
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between'
                    }}
                >
                    <MessageList />
                    <Plus />
                </View>
                <ChatInput />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({});
const MessageList = () => {
    const testMsgs = [
        { id: '1', message: 'this is a test.' },
        { id: '2', message: 'this is a second test.' }
    ];

    const renderItem = ({ item }) => <Message message={item.message} />;

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={testMsgs}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const Message = ({ message }) => (
    <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6
        }}
    >
        <View
            style={{
                height: 36,
                width: 36,
                borderRadius: 18,
                backgroundColor: '#777',
                marginRight: 12
            }}
        />
        <View
            style={{
                backgroundColor: 'rgba(255,255,255,.3)',
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 10,
                flex: 1,
                marginRight: 12
            }}
        >
            <Text style={{ color: 'white', fontSize: 16 }}>{message}</Text>
        </View>
    </View>
);

const Plus = () => (
    <TouchableOpacity
        style={{
            backgroundColor: 'rgba(150,150,150, .4)',
            height: 50,
            width: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
        <Icon name="plus" size={40} color="white" />
    </TouchableOpacity>
);

const Pinned = () => (
    <View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 12
        }}
    >
        <View
            style={{
                backgroundColor: 'rgba(255,255,255,.3)',
                flex: 1,
                justifyContent: 'center',
                padding: 12
            }}
        >
            <Text
                style={{
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: 6
                }}
            >
                This is pinned info
            </Text>
            <Text style={{ color: 'white' }}>
                Information about the stream or something
            </Text>
        </View>
        <View
            style={{
                backgroundColor: colors.pink,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 8,
                paddingVertical: 12
            }}
        >
            <Icon name="pin" size={32} color="white" />
        </View>
    </View>
);

const ChatInput = () => (
    <View
        style={{
            marginTop: 12,
            flexDirection: 'row',
            alignItems: 'center'
        }}
    >
        <TextInput
            style={{
                borderColor: 'white',
                borderWidth: 2,
                borderRadius: 20,
                color: 'white',
                paddingVertical: 8,
                paddingHorizontal: 12,
                paddingTop: 8,
                flex: 1,
                marginRight: 12
            }}
            // value={field}
            // onChangeText={text => handleTextChange(label, text)}
            placeholder="Chat..."
            placeholderTextColor="#ddd"
            keyboardType="default"
            multiline={true}
            numberOfLines={4}
        />
        <TouchableOpacity
            style={{
                backgroundColor: 'rgba(150,150,150, .4)',
                height: 50,
                width: 50,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Icon
                name="send"
                size={24}
                color="white"
                style={{ marginRight: -3 }}
            />
        </TouchableOpacity>
    </View>
);

const Cash = () => (
    <View
        style={{
            backgroundColor: colors.pink,
            height: 40,
            width: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
        <View
            style={{
                backgroundColor: '#240C15',
                height: 26,
                width: 26,
                borderRadius: 13,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Icon name="currency-usd" size={22} color={colors.pink} />
        </View>
    </View>
);

const Donation = () => (
    <View
        style={{
            backgroundColor: 'white',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8
        }}
    >
        <Text
            style={{
                fontWeight: 'bold',
                color: '#240C15'
            }}
        >
            $5.00
        </Text>
    </View>
);
