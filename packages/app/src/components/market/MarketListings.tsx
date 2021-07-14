import React, { ReactElement, useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, Title } from '../UI';

type Props = {
    setListingsVisible: (b: boolean) => void;
};

export const MarketListings = ({ setListingsVisible }: Props): ReactElement => {
    return (
        <View style={[StyleSheet.absoluteFill, styles.flex]}>
            <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={4}
                reducedTransparencyFallbackColor="rgba(255,255,255,.5)"
            />
            <SafeAreaView style={styles.flex}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity
                                onPress={() => setListingsVisible(false)}
                            >
                                <Icon
                                    name="chevron-left"
                                    size={52}
                                    color={colors.pink}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Title style={styles.title} shadow>
                            Other Sellers
                        </Title>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        paddingHorizontal: '4%'
    },
    headerContainer: {},
    iconContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1
    },
    icon: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 5
    },
    title: {
        textAlign: 'center'
    }
});
