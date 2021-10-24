import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { ReactElement, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Card, colors, ImageCard, sizes, Title } from '../UI';

type Props = {
    donationAmount: string;
    setDonationAmount: (s: string) => void;
};

// @TODO replace icons with animated logo

export const DonationModal = ({
    donationAmount,
    setDonationAmount
}: Props): ReactElement => {
    const [donationPending, setDonationPending] = useState(false);
    const [donationConfirmation, setDonationConfirmation] = useState<
        boolean | null
    >(null);
    const [donateButtonDisabled, setDonateButtonDisabled] = useState(false);

    const resetInputs = () => {
        setDonationAmount('');
    };

    const onDonationSuccess = () => {
        console.log('Donation onCompleted success callback');
        setDonationPending(false);
        setDonationConfirmation(true);
        setDonateButtonDisabled(false);
        resetInputs();
    };

    const onDonationError = () => {
        console.log('Donation error');
        setDonationPending(false);
        setDonationConfirmation(false);
        setDonateButtonDisabled(false);
        resetInputs();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ImageCard
                    height={150}
                    source={{
                        uri:
                            'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                    }}
                />
                <Title style={styles.title}>Title</Title>
            </View>
            <View style={styles.userContainer}>
                <Image
                    style={styles.profileImage}
                    height={40}
                    width={40}
                    resizeMode="cover"
                    source={{
                        uri:
                            'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                    }}
                />

                <View style={styles.userNameContainer}>
                    <Title style={styles.userName}>username</Title>
                    <Text style={styles.address}>address</Text>
                </View>
            </View>
            <Text style={styles.description}>content</Text>

            <View style={styles.donateContainer}>
                <Card noPadding style={{ maxHeight: 100 }}>
                    <View style={styles.inputContainer}>
                        <Image
                            style={styles.profileImage}
                            height={32}
                            width={32}
                            resizeMode="cover"
                            source={require('../../images/xdai.png')}
                        />
                        <BottomSheetTextInput
                            style={styles.input}
                            onChangeText={setDonationAmount}
                            value={donationAmount}
                            placeholder="0"
                            keyboardType="numeric"
                        />
                        <View style={styles.iconContainer}>
                            {donationPending && (
                                <Icon
                                    name="sync"
                                    size={24}
                                    color={colors.gray}
                                />
                            )}

                            {donationConfirmation && (
                                <Icon
                                    name="check-circle-outline"
                                    size={24}
                                    color={colors.green}
                                />
                            )}

                            {donationConfirmation === false && (
                                <Icon
                                    name="close-circle-outline"
                                    size={24}
                                    color={colors.pink}
                                />
                            )}
                        </View>
                    </View>
                </Card>

                <Button
                    title="Donate"
                    style={styles.button}
                    disabled={donationAmount.length < 1 || donateButtonDisabled}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: '4%'
    },
    header: {
        flexDirection: 'row',
        marginBottom: '6%'
    },
    title: {
        color: 'rgba(0,0,0,.7)',
        fontSize: 30,
        marginLeft: '4%',
        flexWrap: 'wrap',
        textAlign: 'center'
    },
    userContainer: {
        flexDirection: 'row'
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    userNameContainer: {
        marginLeft: '2%'
    },
    userName: {
        color: 'rgba(0,0,0,.7)',
        fontSize: 20
    },
    address: {
        fontSize: 16,
        color: colors.gray
    },
    description: {
        marginVertical: '4%',
        fontSize: 16
    },
    donateContainer: {
        alignItems: 'center'
    },
    iconContainer: {
        width: 30,
        alignItems: 'center'
    },
    inputTextWrapper: {
        marginTop: 10
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        width: sizes.windowW * 0.6
    },
    input: {
        borderBottomColor: colors.gray,
        borderBottomWidth: 1,
        fontSize: 20,
        color: colors.gray,
        marginHorizontal: 12,
        textAlign: 'center',
        padding: 2,
        flex: 1
    },
    button: {
        marginTop: '4%'
    }
});
