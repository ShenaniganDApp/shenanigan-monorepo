import React, { ReactElement } from 'react';
import { Text, View, StyleSheet, Image, ViewStyle } from 'react-native';
import { colors, sizes } from './';

type Props = {
    style?: ViewStyle;
    amount: number | string;
};

const XdaiBanner = ({ style, amount }: Props): ReactElement => {
    return (
        <View style={[styles.container, style]}>
            <Image
                style={styles.logo}
                height={sizes.smallScreen ? 26 : 30}
                width={sizes.smallScreen ? 26 : 30}
                resizeMode="cover"
                source={require('../../images/xdai.png')}
            />
            <View style={styles.textContainer}>
                <Text style={styles.text}>{amount}</Text>
            </View>
        </View>
    );
};

export default XdaiBanner;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16
    },
    logo: {
        height: sizes.smallScreen ? 26 : 30,
        width: sizes.smallScreen ? 26 : 30,
        zIndex: 100
    },
    textContainer: {
        backgroundColor: colors.orange,
        paddingVertical: sizes.smallScreen ? 0 : 2,
        paddingLeft: 16,
        paddingRight: sizes.smallScreen ? 8 : 12,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        transform: [{ translateX: -14 }]
    },
    text: {
        color: 'white',
        fontSize: sizes.smallScreen ? 17 : 19,
        fontWeight: '900',
        fontFamily: 'impact'
    }
});
