import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    TextInput,
    TouchableWithoutFeedback
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { backgroundStyles } from '../UI';

type Props = {};

export const SearchBar = (props: Props): ReactElement => {
    const [searchText, setSearchText] = useState('');
    const opacity = useSharedValue(0);

    const animatedOpacity = useAnimatedStyle(() => ({
        opacity: withTiming(opacity.value, {
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
        })
    }));

    useEffect(() => {
        if (searchText.length > 0) {
            opacity.value = 1;
        } else {
            opacity.value = 0;
        }
    }, [searchText, opacity]);

    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <Icon
                    name="magnify"
                    size={28}
                    color="white"
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setSearchText}
                    value={searchText}
                    placeholder="Search by athlete or keyword"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
                <Animated.View style={animatedOpacity}>
                    <TouchableWithoutFeedback onPress={() => setSearchText('')}>
                        <Icon name="close-circle" size={20} color="white" />
                    </TouchableWithoutFeedback>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '2%',
        marginTop: '2%',
        marginBottom: '4%'
    },
    background: {
        ...backgroundStyles.basic,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '4%',
        paddingVertical: 6
    },
    searchIcon: {
        marginRight: 4
    },
    input: {
        fontSize: 18,
        color: 'white',
        flex: 1,
        marginRight: '2%',
        paddingTop: 0,
        paddingBottom: 0
    }
});
