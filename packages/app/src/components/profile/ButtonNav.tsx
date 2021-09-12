import React, { ReactElement } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ImageCard, Title, sizes } from '../UI';
import { useNavigation } from '@react-navigation/native';
import { Profile_me$key } from './__generated__/Profile_me.graphql';
import { useFragment, graphql } from 'react-relay';
import { ButtonNav_me$key } from './__generated__/ButtonNav_me.graphql';

type Props = {
    me: ButtonNav_me$key;
};

export const ButtonNav = (props: Props): ReactElement => {
    const me = useFragment<ButtonNav_me$key>(
        graphql`
            fragment ButtonNav_me on User {
                ...UserChallengesList_me
                ...UserChallengeDetailList_me
            }
        `,
        props.me
    );
    const cards = [
        { Challenges: 'UserChallengesList' },
        { Cards: 'UserChallengeDetailList' }
    ];
    const { navigate } = useNavigation();

    return (
        <View style={styles.container}>
            {cards.map((card) => (
                <View style={styles.section}>
                    <TouchableOpacity
                        onPress={() => {
                            navigate(Object.values(card)[0], { ...props, me });
                        }}
                    >
                        <ImageCard
                            height={sizes.windowH * 0.2}
                            source={{
                                uri:
                                    'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                            }}
                        />
                        <View>
                            <Title style={styles.title} size={24}>
                                {Object.keys(card)[0]}
                            </Title>
                        </View>
                    </TouchableOpacity>
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
