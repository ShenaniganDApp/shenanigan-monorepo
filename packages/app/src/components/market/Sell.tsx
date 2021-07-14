import React, { ReactElement, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, colors, Gradient, ImageCard, sizes, Title } from '../UI';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {};

export const Sell = (props: Props): ReactElement => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardPrice, setCardPrice] = useState('');

    return (
        <Gradient>
            <SafeAreaView style={styles.flex}>
                <View style={[styles.flex, styles.container]}>
                    <KeyboardAvoidingView
                        behavior={
                            Platform.OS === 'ios' ? 'position' : 'padding'
                        }
                        keyboardVerticalOffset={96}
                    >
                        <View style={styles.imageContainer}>
                            <View>
                                <ImageCard
                                    height={sizes.smallScreen ? 270 : 320}
                                    source={{
                                        uri:
                                            'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                                    }}
                                />
                                <View style={styles.shadow}>
                                    <Image
                                        style={styles.profileImage}
                                        height={50}
                                        width={50}
                                        resizeMode="cover"
                                        source={{
                                            uri:
                                                'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                                        }}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.background}>
                            <Title size={22} style={styles.title}>
                                This is the one time I’m going to be able to
                                land this trick shot, watch now!
                            </Title>
                            <View style={styles.rowContainer}>
                                <View style={styles.row}>
                                    <Title size={19} style={styles.label}>
                                        Set Number
                                    </Title>
                                    <View style={styles.cardContainer}>
                                        <Card
                                            noPadding
                                            style={styles.numberCard}
                                        >
                                            <View style={styles.inputContainer}>
                                                <View style={styles.flex}>
                                                    <TextInput
                                                        style={[
                                                            styles.flex,
                                                            styles.input
                                                        ]}
                                                        keyboardType="numeric"
                                                        onChangeText={
                                                            setCardNumber
                                                        }
                                                        value={cardNumber}
                                                        placeholder="1"
                                                        placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                                    />
                                                </View>
                                                <Icon
                                                    name="square-edit-outline"
                                                    size={24}
                                                    color={colors.pink}
                                                    style={styles.icon}
                                                />
                                            </View>
                                        </Card>
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <Title size={19} style={styles.label}>
                                        Set Price
                                    </Title>
                                    <View style={styles.cardContainer}>
                                        <Text style={styles.lastSold}>
                                            Last sold for 99,999 xDai
                                        </Text>
                                        <Card
                                            style={styles.priceCard}
                                            noPadding
                                        >
                                            <View style={styles.inputContainer}>
                                                <Image
                                                    style={styles.logo}
                                                    height={
                                                        sizes.smallScreen
                                                            ? 24
                                                            : 28
                                                    }
                                                    width={
                                                        sizes.smallScreen
                                                            ? 24
                                                            : 28
                                                    }
                                                    resizeMode="cover"
                                                    source={require('../../images/xdai.png')}
                                                />
                                                <View style={styles.flex}>
                                                    <TextInput
                                                        style={[
                                                            styles.flex,
                                                            styles.input
                                                        ]}
                                                        keyboardType="numeric"
                                                        onChangeText={
                                                            setCardPrice
                                                        }
                                                        value={cardPrice}
                                                        placeholder="10"
                                                        placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                                    />
                                                </View>
                                                <Icon
                                                    name="square-edit-outline"
                                                    size={24}
                                                    color={colors.pink}
                                                    style={styles.icon}
                                                />
                                            </View>
                                        </Card>
                                    </View>
                                </View>
                            </View>
                            <Button title="Next" style={styles.button} />
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        </Gradient>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: '4%',
        justifyContent: 'center'
    },
    flex: {
        flex: 1
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: '4%'
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
        height: 50,
        width: 50,
        borderRadius: 25,
        position: 'absolute',
        bottom: 5,
        left: 5
    },
    profileImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)'
    },
    background: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderColor: 'rgba(251, 250, 250, 0.7)',
        borderWidth: 1,
        borderRadius: 10,
        padding: '4%'
    },
    title: {
        textAlign: 'center',
        paddingHorizontal: '4%'
    },
    lastSold: {
        color: colors.gray,
        marginBottom: 4
    },
    rowContainer: {
        marginTop: '2%'
    },
    row: {
        flexDirection: 'row',
        marginVertical: '3%'
    },
    label: {
        flexBasis: '33%'
    },
    cardContainer: {
        flexBasis: '66%',
        alignItems: 'flex-start'
    },
    icon: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 5,
        marginLeft: 12
    },
    numberCard: {
        width: '100%',
        maxWidth: 105
    },
    priceCard: {
        width: '100%',
        maxWidth: 220
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: sizes.smallScreen ? 10 : 12,
        paddingVertical: sizes.smallScreen ? 10 : 12
    },
    logo: {
        height: sizes.smallScreen ? 24 : 28,
        width: sizes.smallScreen ? 24 : 28,
        marginRight: 12
    },
    input: {
        color: colors.gray,
        fontSize: 20,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        textAlign: 'right',
        paddingBottom: 0,
        paddingTop: 0,
        paddingHorizontal: 4
    },
    button: {
        marginTop: '4%'
    }
});
