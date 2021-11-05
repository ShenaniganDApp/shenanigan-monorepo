import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFragment, graphql } from 'react-relay';
import { Blockie } from '../Web3';
import { UserInfo_liveChallenge$key } from './__generated__/UserInfo_liveChallenge.graphql';

type Props = {
    liveChallenge: UserInfo_liveChallenge$key | null;
};

export const UserInfo = (props: Props): ReactElement => {
    const liveChallenge = useFragment<UserInfo_liveChallenge$key>(
        graphql`
            fragment UserInfo_liveChallenge on Challenge {
                _id
                title
                creator {
                    addresses
                }
            }
        `,
        props.liveChallenge
    );

    return (
        <View style={styles.infoContainer}>
            <View style={styles.image}>
                <Blockie
                    size={12}
                    scale={4}
                    address={liveChallenge.creator.addresses[0]}
                />
            </View>
            <Text style={styles.title}>{liveChallenge.title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        marginRight: 16
    },
    title: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,.6)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 3
    }
});
