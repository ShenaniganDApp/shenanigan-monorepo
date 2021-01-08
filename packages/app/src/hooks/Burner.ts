import { useEffect, useState } from 'react';
import { Wallet, getDefaultProvider } from 'ethers';

import AsyncStorage from '@react-native-community/async-storage';

export const useBurner = (): Wallet | null => {
    const [burnerWallet, setBurnerWallet] = useState<Wallet | null>(null);

    let pk: string | null = '';

    useEffect(() => {
        const getBurner = async () => {
            try {
                pk = await AsyncStorage.getItem('pk');
                const provider = getDefaultProvider();
                if (pk) {
                    const temp = new Wallet(pk).connect(provider);
                    setBurnerWallet(temp);
                } else {
                    const temp = Wallet.createRandom().connect(provider);
                    setBurnerWallet(temp);
                }
            } catch (err) {
                console.log(err);
            }
        };
        getBurner();
    }, [pk]);

    useEffect(() => {
        (async () => {
            if (!pk && burnerWallet)
                await AsyncStorage.setItem('pk', burnerWallet.privateKey);
        })();
    }, [burnerWallet]);

    return burnerWallet;
};
