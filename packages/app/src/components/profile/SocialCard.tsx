import React, { ReactElement } from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, colors } from '../UI';

type Props = {};

export const SocialCard = (props: Props): ReactElement => {
    const profiles = [
        { icon: 'youtube', url: 'https://www.youtube.com' },
        { icon: 'instagram', url: 'https://www.instagram.com' },
        { icon: 'twitter', url: 'https://www.twitter.com' }
    ];
    const openURL = (url: string) => {
        Linking.openURL(url).catch((err) =>
            console.error('An error occurred', err)
        );
    };
    return (
        <Card style={styles.container}>
            <View style={styles.inner}>
                {profiles.map(({ icon, url }) => (
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => openURL(url)}
                    >
                        <Icon name={icon} size={40} color={colors.pink} />
                    </TouchableOpacity>
                ))}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconContainer: {
        marginHorizontal: 16
    }
});
