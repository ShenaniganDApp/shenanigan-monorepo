import React, { ReactElement } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { colors, Card } from '../UI';

type Props = {
    imageSrc: number;
    tokenAmount: string;
    usdAmount: string;
    conversion: string;
};

export const BalanceCard = ({
    imageSrc,
    tokenAmount,
    usdAmount,
    conversion
}: Props): ReactElement => (
    <Card>
        <View style={styles.inner}>
            <View style={styles.logoBg}>
                <Image
                    source={imageSrc}
                    height={50}
                    width={50}
                    style={styles.image}
                />
            </View>

            <View>
                <Text style={styles.title}>{tokenAmount}</Text>
                <Text style={styles.info}>{usdAmount} USD</Text>
                <Text style={styles.info}>{conversion}</Text>
            </View>
        </View>
    </Card>
);

const styles = StyleSheet.create({
    inner: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    logoBg: {
        marginRight: 24
    },
    image: {
        height: 50,
        width: 50
    },
    title: {
        color: colors.pink,
        fontSize: 18
    },
    info: {
        fontSize: 16,
        color: colors.gray,
        marginTop: 4
    }
});
