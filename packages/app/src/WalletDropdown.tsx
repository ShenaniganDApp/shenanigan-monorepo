import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useFragment, useMutation } from 'relay-hooks';
import { Address, Balance } from './components/Web3';
import { Web3Context } from './contexts';
import { useBurner } from './hooks/Burner';
import {
    WalletDropdown_me,
    WalletDropdown_me$key
} from './__generated__/WalletDropdown_me.graphql';
import {
    GetOrCreateUser
} from './contexts/Web3Context/mutations/GetOrCreateUserMutation';
import { GetOrCreateUserMutationResponse } from './contexts/Web3Context/mutations/__generated__/GetOrCreateUserMutation.graphql';

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

    const handleSwipe = (index: number) => {
        if (index === 0) {
            setCanSwipe(false);
        } else {
            setCanSwipe(true);
    const burner = useBurner();
    const [getOrCreateUser, { loading }] = useMutation(GetOrCreateUser);

                }
        };


    useEffect(() => {
        setUser(userFragment);
    }, [userFragment]);
    let display = <></>;
    display = (
        <View style={{ flexDirection: 'row' }}>
            {user ? (
                <>
                    <Address
                        value={user.addresses[0]}
                        ensProvider={mainnetProvider}
                    />
                    <Balance
                        address={user.addresses[0]}
                        provider={localProvider}
                        dollarMultiplier={price}
                    />
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
        <SafeAreaView>
            {display}
                <Text>Top!</Text>
        </SafeAreaView>
    );
};
