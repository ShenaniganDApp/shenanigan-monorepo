import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../UI';

type Props = {
    progressLabels: string[];
    index: number;
};

export const ProgressBar = ({ progressLabels, index }: Props): ReactElement => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {progressLabels.map((item, itemIndex) => (
                    <View style={styles.itemContainer} key={item}>
                        <View style={styles.dotContainer}>
                            <View style={styles.dot} />
                            {index === itemIndex && (
                                <View style={styles.dotFill} />
                            )}
                            {index > itemIndex && (
                                <Icon
                                    name="check-bold"
                                    size={30}
                                    color={colors.pink}
                                    style={styles.icon}
                                />
                            )}
                        </View>

                        <Text style={styles.label}>{item}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.divider}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: '6%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemContainer: {
        alignItems: 'center',
        flex: 1
    },
    dotContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    dot: {
        width: 22,
        height: 22,
        borderRadius: 20,
        backgroundColor: colors.altWhite
    },
    dotFill: {
        width: 16,
        height: 16,
        borderRadius: 20,
        backgroundColor: colors.pink,
        position: 'absolute'
    },
    icon: {
        position: 'absolute',
        top: -8,
        left: 0
    },
    label: {
        color: 'white',
        fontSize: 16
    },
    divider: {
        height: 2,
        width: '66.666%',
        backgroundColor: colors.altWhite,
        position: 'absolute',
        top: 11,
        alignSelf: 'center',
        zIndex: -1
    }
});
