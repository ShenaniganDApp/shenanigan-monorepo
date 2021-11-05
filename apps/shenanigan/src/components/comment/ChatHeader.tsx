import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, Title } from '../UI';
import Blockie from '../Web3/Blockie';

type Props = {};

export const ChatHeader = (props: Props): ReactElement => {
    return (
        <View style={styles.container}>
            <Title style={styles.title} size={34}>
                Top Donors
            </Title>
            <View style={styles.imagesContainer}>
                {[1, 2, 3].map((n, i) => (
                    <View
                        style={[
                            styles.image,
                            { transform: [{ translateX: -7 * i }] }
                        ]}
                        key={i}
                    >
                        <Blockie
                            address={
                                '0x9d69631bdeeB04bAC2AC64C2C96aDD63079CB1f' + n
                            }
                            size={10}
                            scale={4.6}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.altWhite,
        paddingHorizontal: '10%',
        paddingVertical: '4%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 99
    },
    title: {
        color: 'rgba(0,0,0,.7)'
    },
    imagesContainer: {
        flexDirection: 'row',
        marginLeft: 6
    },
    image: {
        borderRadius: 90,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,.4)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.35,
        shadowRadius: 3,
        elevation: 10
    }
});
