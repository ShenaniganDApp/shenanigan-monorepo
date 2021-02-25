import React, { ReactElement } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const Header = (): ReactElement => {
    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.image} />
                <Text style={styles.title}>
                    This is the title of the stream
                </Text>
            </View>
            <View>
                <Dots />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 16
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
    },
    dots: {
        shadowOffset: { width: 0, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 0.5
    }
});

const Dots = () => (
    <TouchableOpacity>
        <Icon
            style={styles.dots}
            name="dots-horizontal"
            size={40}
            color="white"
        />
    </TouchableOpacity>
);
