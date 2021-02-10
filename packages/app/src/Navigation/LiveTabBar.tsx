import React, { ReactElement } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const LiveTabBar = ({ state, navigation }): ReactElement => {
    const { index, routeNames } = state;

    return (
        <View style={styles.header}>
            {index === 1 && (
                <TouchableOpacity
                    style={[styles.button, styles.left]}
                    onPress={() => navigation.navigate('Comments')}
                >
                    <Text>&larr; Comments</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.title}>{routeNames[index]}</Text>

            {index === 0 && (
                <TouchableOpacity
                    style={[styles.button, styles.right]}
                    onPress={() => navigation.navigate('Lineup')}
                >
                    <Text>LineUp &rarr;</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'relative',
        zIndex: 4,
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 26,
        textAlign: 'center',
        marginVertical: 12,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
        position: 'absolute',
        top: 0
    },
    button: {
        position: 'absolute',
        top: 20
    },
    left: {
        left: 10
    },
    right: {
        right: 10
    }
});
