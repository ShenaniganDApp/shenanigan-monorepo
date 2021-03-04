import React, { useContext, useEffect, useState } from 'react';
import { Text, View, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useFragment, useMutation } from 'relay-hooks';
import { Address, Balance } from './components/Web3';
import { Web3Context } from './contexts';
import { useBurner } from './hooks/Burner';
import {
    WalletDropdown_me,
    WalletDropdown_me$key
} from './__generated__/WalletDropdown_me.graphql';
import { GetOrCreateUser } from './contexts/Web3Context/mutations/GetOrCreateUserMutation';
import { GetOrCreateUserMutationResponse } from './contexts/Web3Context/mutations/__generated__/GetOrCreateUserMutation.graphql';
import LinearGradient from 'react-native-linear-gradient';
import { colors, Card, Button } from './components/UI';

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
        <View>
            {user ? (
                <>
                    <Address
                        value={user.addresses[0]}
                        ensProvider={mainnetProvider}
                    />
                    <View style={styles.section}>
                        <Text style={styles.title}>Balance</Text>
                        <Card
                            bgColor="#f3d9e1"
                            shadowColor="rgba(0,0,0,.4)"
                            style={{ alignSelf: 'flex-start' }}
                        >
                            <Balance
                                address={user.addresses[0]}
                                provider={localProvider}
                                dollarMultiplier={price}
                                size={18}
                            />
                        </Card>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.title}>Particle</Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Card
                                shadowColor="rgba(0,0,0,.4)"
                                bgColor="#f8f8d9"
                            >
                                <Text>Particle</Text>
                            </Card>
                            <Card
                                bgColor="#f8f8d9"
                                shadowColor="rgba(0,0,0,.4)"
                                style={styles.particleDescCard}
                            >
                                <Text style={styles.particleDescTitle}>
                                    10.02902398 PRTCLE
                                </Text>
                                <Text style={styles.particleDescInfo}>
                                    1 PRTCLE = $0.23323
                                </Text>
                            </Card>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.title}>xDai Faucet</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Card
                                shadowColor="rgba(0,0,0,.4)"
                                style={styles.xdaiCard}
                            >
                                <Text style={styles.xdaiDesc}>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Impedit vel earum at nisi
                                    a officiis exercitationem explicabo ex, sed
                                    in.
                                </Text>

                                <Button
                                    title="Receive .01 of xDai"
                                    shadow
                                    small
                                />
                            </Card>
                        </View>
                    </View>
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
        </View>
    );
    return (
        <LinearGradient
            colors={[colors.pink, colors.yellow, colors.altWhite]}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
                {display}
                {/* <Button
                    title={
                        connector && connector.connected
                            ? 'Disconnect'
                            : 'Connect'
                    }
                    onPress={toggleConnect}
                /> */}
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 10,
        color: 'white',
        textShadowColor: 'rgba(0,0,0,.3)',
        textShadowOffset: {
            width: 0,
            height: 0
        },
        textShadowRadius: 4
    },
    section: {
        marginTop: 40,
        marginBottom: 0
    },
    particleDescCard: {
        flex: 1,
        marginLeft: 20
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
    xdaiDesc: {
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
        lineHeight: 20
    }
});
