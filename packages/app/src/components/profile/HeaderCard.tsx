import React, { ReactElement } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { colors, Card } from '../UI';

type Props = {
    address: string | null;
};

export const HeaderCard = ({ address }: Props): ReactElement => {
    return (
        <Card noPadding style={styles.container}>
            <View style={styles.bannerImageContainer}>
                <Image
                    style={styles.bannerImage}
                    resizeMode="cover"
                    source={{
                        uri:
                            'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                    }}
                />
            </View>

            <View style={styles.infoContainer}>
                <Image
                    style={styles.profilePic}
                    resizeMode="cover"
                    source={{
                        uri:
                            'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                    }}
                />
                <View style={styles.usernameContainer}>
                    <Text style={styles.username}>Username</Text>
                    <Text style={styles.address}>{address}</Text>
                </View>
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
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 0
    },
    bannerImageContainer: {
        overflow: 'hidden',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    bannerImage: {
        height: 150,
        width: '100%',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    infoContainer: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    profilePic: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: colors.altWhite,
        transform: [{ translateY: -50 }],
        position: 'absolute',
        left: 16
    },
    usernameContainer: {
        maxWidth: '66.666%'
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 6,
        textAlign: 'right'
    },
    address: {
        color: '#666',
        textAlign: 'right'
    },
    followContainer: {
        padding: 16,
        flexDirection: 'row'
    },
    follow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        flex: 1
    },
    followLabel: {
        fontSize: 16,
        color: '#666',
        textTransform: 'uppercase'
    },
    followNumber: {
        fontWeight: 'bold',
        paddingRight: 6,
        fontSize: 18
    },
    descriptionContainer: {
        padding: 16,
        marginBottom: 16
    },
    description: {
        fontSize: 16
    }
});
