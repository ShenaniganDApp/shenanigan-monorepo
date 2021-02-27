import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StreamControls } from './StreamControls';

export const Header = (): ReactElement => {
    return (
        <View style={styles.container}>
            <Title />
            <StreamControls />
        </View>
    );
};

const Title = () => (
    <View style={styles.infoContainer}>
        <View style={styles.image} />
        <Text style={styles.title}>This is the title of the stream</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#333',
        marginRight: 16
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,.6)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 3
    }
});
