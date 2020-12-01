import { useEffect, useState } from 'react';
import { Wallet, getDefaultProvider } from 'ethers';
import { graphql, readInlineData } from 'react-relay';

import { Burner_me$key, Burner_me } from './__generated__/Burner_me.graphql';
import AsyncStorage from '@react-native-community/async-storage';

const useBurnerFragment = graphql`
    fragment Burner_me on User @inline {
        id
        burner
    }
`;

export const useBurner = (userRef: Burner_me$key | null): [boolean, Wallet | null] => {
    const user = readInlineData<Burner_me>(useBurnerFragment, userRef);
    const [burner, setBurner] = useState<Wallet | null>(null);
    const isAuthenticated = !!user && user.burner;

    let pk: string | null = '';

    useEffect(() => {
        const getBurner = async () => {
            try {
                pk = await AsyncStorage.getItem('pk');
                const provider = getDefaultProvider();
                if (pk) {
                    const temp = new Wallet(pk).connect(provider);
                    setBurner(temp);
                } else {
                    const temp = Wallet.createRandom().connect(provider);
                    setBurner(temp);
                }
            } catch (err) {
                console.log(err);
            }
        };
        getBurner();
    }, [pk]);

    useEffect(() => {
        (async () => {
            if (!pk && burner)
                await AsyncStorage.setItem('pk', burner.privateKey);
        })();
    }, [burner]);

    return [isAuthenticated, burner];
};
