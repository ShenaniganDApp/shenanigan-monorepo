import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {};

export const SearchBar = (props: Props): ReactElement => {
    const [searchText, setSearchText] = useState('');
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Icon
                    name="magnify"
                    size={32}
                    color="white"
                    style={styles.icon}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setSearchText}
                    value={searchText}
                    placeholder="Search by athlete or keyword"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '2%',
        marginVertical: '4%'
    },
    inputContainer: {
        borderColor: 'rgba(251, 250, 250, 0.7)',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        flexDirection: 'row',
        paddingHorizontal: '4%',
        paddingVertical: 4
    },
    icon: {},
    input: {
        fontSize: 16
    }
});
