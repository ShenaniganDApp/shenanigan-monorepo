import React, { ReactElement } from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { sizes } from '../UI';

type Props = {
    avatarSrc: ImageSourcePropType;
    bannerSrc: ImageSourcePropType;
};

export const BannerAvatar = ({ avatarSrc, bannerSrc }: Props): ReactElement => {
    return (
        <>
            <View style={styles.bannerImageContainer}>
                <Image
                    style={styles.bannerImage}
                    resizeMode="cover"
                    source={bannerSrc}
                />
            </View>
            <View style={styles.imageWrapper}>
                <Image
                    style={styles.profilePic}
                    resizeMode="cover"
                    source={avatarSrc}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    bannerImageContainer: {
        overflow: 'hidden',
        borderRadius: 10
    },
    bannerImage: {
        height: sizes.windowH * 0.16,
        width: '100%',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    imageWrapper: {
        borderRadius: (sizes.windowW * 0.25) / 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 20,
        backgroundColor: 'rgba(0,0,0,.0)',
        position: 'absolute',
        left: 0,
        top: sizes.windowH * 0.16,
        transform: [
            {
                translateY: -((sizes.windowW * 0.25) / 2 + 12)
            }
        ],
        zIndex: 99
    },
    profilePic: {
        height: sizes.windowW * 0.25,
        width: sizes.windowW * 0.25,
        borderRadius: (sizes.windowW * 0.25) / 2
    }
});
