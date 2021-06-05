import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Card, colors } from '../UI';
import Blockie from '../Web3/Blockie';

type Props = {};

export const ChatComment = ({ item }: Props): ReactElement => {
    if (!item) return <Text>Not Here</Text>;
    const { node } = item;

    const username =
        node.creator.username.substr(0, 4) +
        '...' +
        node.creator.username.substr(-4);

    return (
        <Card style={styles.card} noPadding>
            <View style={styles.cardInner}>
                <View>
                    <Blockie
                        address={node.creator.addresses[0]}
                        size={8}
                        scale={4}
                    />
                </View>
                <View style={styles.text}>
                    <Text style={styles.message}>
                        <Text style={styles.name}>{username}: </Text>
                        {node.content}
                    </Text>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: '4%',
        padding: '3%'
    },
    cardInner: {
        flexDirection: 'row'
    },
    text: {
        marginLeft: '3%',
        marginTop: 5,
        flex: 1
    },
    name: {
        color: '#215757',
        fontWeight: 'bold'
    },
    message: {
        color: colors.grayMedium,
        lineHeight: 20,
        fontWeight: '500'
    }
});
