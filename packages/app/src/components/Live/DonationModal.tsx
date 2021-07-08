import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { useFragment, graphql } from 'react-relay';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Card, colors, ImageCard, sizes, Title } from '../UI';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { DonationModal_liveChallenge$key } from './__generated__/DonationModal_liveChallenge.graphql';
import { useMutation } from 'relay-hooks';
import { CreateDonation } from './mutations/CreateDonationMutation';
import { CreateDonationMutation } from './mutations/__generated__/CreateDonationMutation.graphql';

type Props = {
    liveChallenge: DonationModal_liveChallenge$key | null;
};

export const DonationModal = (props: Props): ReactElement => {
    const liveChallenge = useFragment<DonationModal_liveChallenge$key>(
        graphql`
            fragment DonationModal_liveChallenge on Challenge {
                _id
                title
                content
                image
            }
        `,
        props.liveChallenge
    );

    const [number, onChangeNumber] = useState('');

    const [createDonation, { loading }] = useMutation<CreateDonationMutation>(
        CreateDonation
    );

    const handleCreateDonation = () => {
        const input = {
            amount: number,
            content: liveChallenge?.content,
            challenge: liveChallenge?._id
        };

        const config = {
            variables: {
                input
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
                    <Title style={styles.userName}>Username</Title>
                    <Text style={styles.address}>0x6dsfkj873bdjurb8p38n4</Text>
                </View>
            </View>
            <Text style={styles.description}>{liveChallenge?.content}</Text>

            <View style={styles.donateContainer}>
                <Card noPadding>
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
                            onChangeText={onChangeNumber}
                            value={number}
                            placeholder="0"
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.max}>
                            <Text style={styles.maxText}>Max</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
                <Button
                    title="Donate"
                    onPress={handleCreateDonation}
                    style={styles.button}
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
    },
    max: {
        backgroundColor: colors.pink,
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 2
    },
    maxText: {
        color: 'white',
        fontFamily: 'impact',
        fontSize: 16
    }
});
