import React, { createContext, useCallback, useEffect, useState } from 'react';
import { did } from '@shenanigan/utils';
import { ethers, providers, Wallet } from 'ethers';
import AsyncStorage from '@react-native-community/async-storage';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { IConnector } from '@walletconnect/types';
import { INFURA_ID } from 'react-native-dotenv';

type Web3ContextType = {
    connector: IConnector;
    toggleWeb3: (wallet: Wallet) => Promise<void>;
    connectDID: (connector: IConnector, wallet: Wallet) => Promise<void>;
};

export const Web3Context = createContext<Web3ContextType>({
    connector: {} as IConnector,
    toggleWeb3: async (wallet: Wallet) => {},
    connectDID: async (connector: IConnector, wallet: Wallet) => undefined
});

export const Web3ContextProvider: React.FC = ({ children }) => {
    const connector = useWalletConnect();

    const connectDID = async (connector: IConnector, wallet: Wallet) => {
        const token = await did.createToken(connector, wallet);
        console.log('token: ', token);
        await AsyncStorage.setItem('token', token);

        // commitLocalUpdate(env, store => {
        //     const me = store.getRoot().getLinkedRecord('me');
        //     if (me){
        //     me.setValue(token, 'token');
        //     }
        //   });
    };

    const toggleWeb3 = async (wallet: Wallet) => {
        if (!connector.connected) {
            await connector.connect();
            await connectDID(connector, wallet);
        } else {
            await connector.killSession();
            await connectDID(connector, wallet);
        }
    };
    return (
        <Web3Context.Provider
            value={{
                connector,
                toggleWeb3,
                connectDID
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};
