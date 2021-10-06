import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { utils } from 'ethers';
import React, { ReactElement, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { usernameConcat } from '../../helpers';
import { graphql, useFragment, useMutation } from 'react-relay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Button, Card, colors, ImageCard, sizes, Title } from '../UI';
import { DonationModal_liveChallenge$key } from './__generated__/DonationModal_liveChallenge.graphql';
import { CreateDonationMutation } from './mutations/__generated__/CreateDonationMutation.graphql';
import { CreateDonation } from './mutations/CreateDonationMutation';

type Props = {
    liveChallengeFrag: DonationModal_liveChallenge$key | null;
    donationAmount: string;
    donationText: string;
    setDonationAmount: (s: string) => void;
    setDonationText: (s: string) => void;
};

// @TODO replace icons with animated logo

export const DonationModal = ({
    liveChallengeFrag,
    donationAmount,
    donationText,
    setDonationAmount,
    setDonationText
}: Props): ReactElement => {
    const liveChallenge = useFragment<DonationModal_liveChallenge$key>(
        graphql`
            fragment DonationModal_liveChallenge on Challenge {
                _id
                title
                content
                image
                creator {
                    username
                    addresses
                }
            }
        `,
        liveChallengeFrag
    );

    const [createDonation, { loading }] = useMutation<CreateDonationMutation>(
        CreateDonation
    );

    const [donationPending, setDonationPending] = useState(false);
    const [donationConfirmation, setDonationConfirmation] = useState<
        boolean | null
    >(null);
    const [donateButtonDisabled, setDonateButtonDisabled] = useState(false);

    const resetInputs = () => {
        setDonationAmount('');
        setDonationText('');
    };

    const handleDonation = ({ error }: { error?: boolean } = {}) => {
        setDonationPending(false);
        setDonateButtonDisabled(false);
        resetInputs();

        if (error) {
            console.log('Donation error');
            setDonationConfirmation(false);
        } else {
            console.log('Donation onCompleted success callback');
            setDonationConfirmation(true);
        }
    };

    const handleCreateDonation = () => {
        setDonationConfirmation(null);
        setDonationPending(true);
        setDonateButtonDisabled(true);

        const input = {
            amount: utils.parseEther(donationAmount).toString(),
            content: donationText,
            challenge: liveChallenge?._id
        };

        const config = {
            variables: {
                input
            },
            onError: () => {
                // TODO: Show error feedback to user
                handleDonation({ error: true });
            },
            onCompleted: () => {
                // TODO: Show success feedback to user
                handleDonation();
            }
        };

        createDonation(config);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ImageCard
                    height={150}
                    source={{
                        uri: `'${liveChallenge?.image}'`
                    }}
                />
                <Title style={styles.title}>{liveChallenge?.title}</Title>
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
                    <Title style={styles.userName}>
                        {usernameConcat(liveChallenge?.creator.username)}
                    </Title>
                    <Text style={styles.address}>
                        {liveChallenge.creator?.addresses[0]}
                    </Text>
                </View>
            </View>
            <Text style={styles.description}>{liveChallenge?.content}</Text>

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
                    <TextInput
                        style={styles.textInput}
                        value={donationText}
                        onChangeText={(text) => setDonationText(text)}
                        placeholder="Type your message..."
                        placeholderTextColor="#ddd"
                        keyboardType="default"
                        multiline
                        numberOfLines={1}
                    />
                </Card>
                <Button
                    title="Donate"
                    onPress={handleCreateDonation}
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
        marginLeft: '2%',
        flexShrink: 1
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
    textInput: {
        color: 'white',
        paddingTop: 6,
        paddingBottom: 6,
        textAlign: 'center',
        paddingHorizontal: 10,
        fontSize: 16,
        maxHeight: 80,
        color: 'black',
        width: sizes.windowW * 0.55,
        marginHorizontal: 10,
        marginVertical: 10
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
