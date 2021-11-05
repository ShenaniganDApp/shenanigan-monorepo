import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    percent: number;
    title: string;
    usersChoice?: boolean;
}

export const Poll = ({ percent, title, usersChoice }: Props): ReactElement => (
    <View style={styles.result}>
        <Text style={styles.percent}>{percent}%</Text>

        <View style={styles.poll}>
            <View style={styles.pollText}>
                <Text style={styles.optionTitle}>{title}</Text>
                <Icon
                    name="checkbox-marked-circle"
                    size={18}
                    color="black"
                    style={{ marginLeft: 10, opacity: usersChoice ? 0.5 : 0 }}
                />
            </View>
            <View style={[styles.pollResult, { width: `${percent}%` }]} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    poll: {
        flex: 1,
        backgroundColor: '#f3f3f3',
        overflow: 'hidden',
        borderRadius: 6,
        paddingVertical: 10
    },
    pollResult: {
        backgroundColor: '#c7d9f1',
        width: '75%',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: -1
    },
    pollText: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    optionTitle: {
        color: 'rgba(0,0,0,.7)',
        fontWeight: 'bold'
    },
    result: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    percent: {
        fontWeight: 'bold',
        marginRight: 4,
        width: 48
    }
});
