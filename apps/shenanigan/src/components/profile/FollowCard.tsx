import React, { ReactElement } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { colors, sizes } from '../UI';

type Props = {
    username: string;
};

export const FollowCard = ({ username }: Props): ReactElement => {
    const imgSize = sizes.smallScreen ? 36 : 44;
    return (
        <View style={styles.container}>
            <Image
                style={[
                    styles.profilePic,
                    {
                        width: imgSize,
                        height: imgSize,
                        borderRadius: imgSize / 2
                    }
                ]}
                height={imgSize}
                width={imgSize}
                resizeMode="cover"
                source={{
                    uri:
                        'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                }}
            />
            <Text style={styles.username}>{username} Username</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24
    },
    profilePic: {
        marginRight: 8
    },
    username: {
        fontWeight: '700',
        color: colors.gray,
        fontSize: 18,
        flex: 1
    }
});
