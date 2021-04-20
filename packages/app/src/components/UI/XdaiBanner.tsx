import React, { ReactElement } from 'react';
import { Text, View, StyleSheet, Image, ViewStyle } from 'react-native';
import { colors } from './';

type Props = {
    style?: ViewStyle;
    amount: number | string;
};

const XdaiBanner = ({ style, amount }: Props): ReactElement => {
    return (
        <View style={[styles.container, style]}>
            <Image
                style={styles.logo}
                height={36}
                width={36}
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
        alignItems: 'center'
    },
    logo: {
        height: 36,
        width: 36,
        zIndex: 100
    },
    textContainer: {
        backgroundColor: colors.orange,
        paddingVertical: 4,
        paddingLeft: 26,
        paddingRight: 12,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        transform: [{ translateX: -22 }]
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: '900'
    }
});
