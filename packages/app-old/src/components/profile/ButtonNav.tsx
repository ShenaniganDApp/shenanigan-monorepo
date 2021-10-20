import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { ImageCard, Title, sizes } from '../UI';

type Props = {};

export const ButtonNav = (props: Props): ReactElement => {
    const cards = ['Challenges', 'Cards'];
    return (
        <View style={styles.container}>
            {cards.map((card) => (
                <View style={styles.section}>
                    <ImageCard
                        height={sizes.windowH * 0.2}
                        source={{
                            uri:
                                'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                        }}
                    />
                    <Title style={styles.title} size={24}>
                        {card}
                    </Title>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: sizes.windowH * 0.03
    },
    section: {
        alignItems: 'center'
    },
    title: {
        textAlign: 'center',
        marginTop: 4
    }
});
