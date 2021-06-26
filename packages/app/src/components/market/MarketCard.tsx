import React, { ReactElement } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ImageCard, sizes, XdaiBanner } from '../UI';
type Props = {};

export const MarketCard = (props: Props): ReactElement => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => console.log('press')}
                style={styles.containerInner}
            >
                <View style={styles.cardWrapper}>
                    <ImageCard
                        height={sizes.smallScreen ? 140 : 150}
                        source={{
                            uri:
                                'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                        }}
                    />
                    <Image
                        style={styles.profileImage}
                        height={25}
                        width={25}
                        resizeMode="cover"
                        source={{
                            uri:
                                'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                        }}
                    />
                </View>

                <XdaiBanner amount="444" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1 / 3,
        alignItems: 'center',
        marginBottom: '5%'
    },
    containerInner: {
        alignItems: 'center'
    },
    cardWrapper: {
        marginBottom: 6
    },
    profileImage: {
        height: 25,
        width: 25,
        borderRadius: 15,
        position: 'absolute',
        bottom: 5,
        left: 5,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10
    }
});
