import React, { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from 'relay-hooks';
import { graphql, useFragment } from 'react-relay';
import { Address, Balance } from './components/Web3';
import { Web3Context } from './contexts';
import { useBurner } from './hooks/Burner';
import {
    WalletDropdown_me,
    WalletDropdown_me$key
} from './__generated__/WalletDropdown_me.graphql';
import { GetOrCreateUser } from './contexts/Web3Context/mutations/GetOrCreateUserMutation';
import { GetOrCreateUserMutationResponse } from './contexts/Web3Context/mutations/__generated__/GetOrCreateUserMutation.graphql';
import { sizes, Card, Gradient, Title } from './components/UI';
import { BalanceCard } from './components/wallet/BalanceCard';
import { GasCard } from './components/wallet/GasCard';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
    me?: any;
    liveChallenge?: any;
    mainnetProvider: any;
    localProvider: any;
    price: any;
}

export const WalletDropdown = ({
    me,
    liveChallenge,
    mainnetProvider,
    localProvider,
    price
}: Props) => {
    const userFragment = useFragment<WalletDropdown_me$key>(
        graphql`
            fragment WalletDropdown_me on User {
                addresses
                burner
            }
        `,
        me
    );
    const [user, setUser] = useState<WalletDropdown_me | null>();

    const { toggleWeb3, connector } = useContext(Web3Context);
    const burner = useBurner();
    const [getOrCreateUser, { loading }] = useMutation(GetOrCreateUser);

    const toggleConnect = async () => {
        await toggleWeb3(burner).catch(console.error);
        const address = connector.accounts[0]
            ? connector.accounts[0]
            : await burner.getAddress();
        const config = {
            variables: {
                input: {
                    address,
                    burner: !user.burner
                }
            },

            onCompleted: ({
                GetOrCreateUser: user
            }: GetOrCreateUserMutationResponse) => {
                if (user.error) {
                    console.log(user.error);
                    return;
                }
                console.log(user.user.id);
            }
        };

        getOrCreateUser(config);
    };

    useEffect(() => {
        setUser(userFragment);
    }, [userFragment]);
    let display = <></>;
    display = (
        <ScrollView
            style={{ flex: 1 }}
            nestedScrollEnabled={true}
            contentContainerStyle={{
                padding: sizes.smallScreen ? '2.5%' : 16,
                paddingBottom: '4%'
            }}
        >
            {user ? (
                <>
                    <View style={styles.addressWrapper}>
                        <Address
                            value={user.addresses[0]}
                            ensProvider={mainnetProvider}
                            connectTitle={
                                connector && connector.connected
                                    ? 'Disconnect'
                                    : 'Connect'
                            }
                            toggleConnect={toggleConnect}
                            isConnected={connector && connector.connected}
                        />
                    </View>

                    <Card glass>
                        <View style={styles.section}>
                            <Title>Particle</Title>
                            <BalanceCard
                                imageSrc={require('./images/prtcle-pink-logo.png')}
                                tokenAmount="10.02902398 PRTCLE"
                                usdAmount=".23323"
                                conversion="1 PRTCLE = $0.23323 USD"
                            />
                        </View>

                        <View style={styles.sectionLg}>
                            <Title>xDai</Title>
                            <BalanceCard
                                imageSrc={require('./images/xdai.png')}
                                tokenAmount="1 xDai"
                                usdAmount="1.00"
                                conversion="1 xDai = $1 USD"
                            />
                        </View>

                        <Title>Need Gas?</Title>
                        <GasCard />
                        {/* <Balance
                            address={user.addresses[0]}
                            provider={localProvider}
                            dollarMultiplier={price}
                            size={18}
                        /> */}
                    </Card>
                </>
            ) : (
                <Text>Connecting...</Text>
            )}

            {/* <Wallet
                address={address}
                provider={localProvider}
                ensProvider={mainnetProvider}
                price={price}
            /> */}
        </ScrollView>
    );
    return (
        <View
            style={{
                flex: 1,
                borderBottomWidth: 4,
                borderColor: 'black'
            }}
        >
            <Gradient>
                <SafeAreaView style={{ flex: 1 }}>{display}</SafeAreaView>
            </Gradient>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: '5%'
    },
    sectionLg: {
        marginBottom: '10%'
    },
    addressWrapper: {
        paddingHorizontal: '2%',
        marginBottom: '4%'
    },
    balanceCard: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    balanceTitle: {
        opacity: 0.7,
        marginBottom: 4,
        textTransform: 'uppercase'
    },
    balanceLogo: {
        width: 40,
        height: 40,
        marginRight: 16
    },
    particleLogoCard: {
        paddingVertical: 6
    },
    logoBg: {
        backgroundColor: 'black',
        padding: 4,
        borderRadius: 30
    },
    logo: {
        width: 50,
        height: 50
    },
    particleDescCard: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 20,
        paddingVertical: 10
    },
    particleDescTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
        textAlign: 'center'
    },
    particleDescInfo: {
        opacity: 0.7,
        textAlign: 'center'
    },
    xdaiCard: {
        padding: 24,
        flex: 1
    },
    xdaiTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 12,
        textAlign: 'center'
    },
    xdaiDesc: {
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
        opacity: 0.7
    }
});
