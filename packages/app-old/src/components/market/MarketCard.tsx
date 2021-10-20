import React, { ReactElement } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ImageCard, sizes, XdaiBanner } from '../UI';
import { useNavigation } from '@react-navigation/native';

type Props = {};

export const MarketCard = (props: Props): ReactElement => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.containerInner}>
                <View style={styles.cardWrapper}>
                    <ImageCard
                        height={sizes.smallScreen ? 140 : 150}
                        source={{
                            uri:
                                'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                        }}
                    />
                    <View style={styles.shadow}>
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
                </View>

                <XdaiBanner amount="444" style={{ zIndex: 1 }} />

                <View
                    style={[StyleSheet.absoluteFill, styles.touchableOverlay]}
                >
                    <TouchableOpacity
                        style={styles.touchable}
                        onPress={() => {
                            navigation.navigate('MarketCardScreen');
                        }}
                    />
                </View>
            </View>
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
    touchableOverlay: {
        zIndex: 9,
        position: 'absolute'
    },
    touchable: {
        height: '100%',
        width: '100%'
    },
    cardWrapper: {
        marginBottom: 6,
        zIndex: 1
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
        height: 25,
        width: 25,
        borderRadius: 15,
        position: 'absolute',
        bottom: 5,
        left: 5
    },
    profileImage: {
        height: 25,
        width: 25,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)'
    }
});
