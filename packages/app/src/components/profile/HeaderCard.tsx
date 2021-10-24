import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFragment, graphql } from 'react-relay';
import { usernameConcat } from '../..//helpers';
import { colors, Title, sizes } from '../UI';
import { SocialCard } from './SocialCard';
import { HeaderCard_me$key } from './__generated__/HeaderCard_me.graphql';

type Props = {
    me: HeaderCard_me$key | null;
};

export const HeaderCard = (props: Props): ReactElement => {
    const me = useFragment<HeaderCard_me$key>(
        graphql`
            fragment HeaderCard_me on User {
                username
                addresses
            }
        `,
        props.me
    );

    const addressString = me?.addresses[0];

    const usernameString = usernameConcat(me?.username);

    return (
        <View>
            <View style={styles.infoContainer}>
                <View style={styles.usernameContainer}>
                    <Title>{usernameString}</Title>
                    <Text style={styles.address}>{addressString}</Text>
                </View>
                <SocialCard />
            </View>

            <View style={styles.followContainer}>
                <View style={styles.follow}>
                    <Text style={styles.followNumber}>140</Text>
                    <Text style={styles.followLabel}>Followers</Text>
                </View>
                <View style={styles.follow}>
                    <Text style={styles.followNumber}>10</Text>
                    <Text style={styles.followLabel}>Following</Text>
                </View>
            </View>

            <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
                    ipsum at nihil! Corporis deleniti earum fugit.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        marginLeft: sizes.windowW * 0.28
    },
    usernameContainer: {
        marginBottom: 4
    },
    address: {
        color: colors.gray,
        fontSize: 18
    },
    followContainer: {
        paddingHorizontal: sizes.windowW * 0.02,
        paddingVertical: sizes.windowH * 0.02,
        flexDirection: 'row'
    },
    follow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        flex: 1
    },
    followLabel: {
        fontSize: 16,
        textTransform: 'uppercase'
    },
    followNumber: {
        fontWeight: 'bold',
        paddingRight: 6,
        fontSize: 18
    },
    descriptionContainer: {
        paddingHorizontal: sizes.windowW * 0.02,
        marginBottom: sizes.windowH * 0.02
    },
    description: {
        fontSize: 16
    }
});
