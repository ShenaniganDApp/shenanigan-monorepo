import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors, Title, sizes } from '../UI';
import { SocialCard } from './SocialCard';

type Props = {
    address: string | null;
};

export const HeaderCard = ({ address }: Props): ReactElement => {
    const addressString = address?.slice(0, 5) + '...' + address?.slice(-5);
    return (
        <View>
            <View style={styles.infoContainer}>
                <View style={styles.usernameContainer}>
                    <Title>Username</Title>
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
