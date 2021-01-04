import React, { createContext, useCallback, useEffect, useState } from 'react';
import { did } from '@shenanigan/utils';
import { ethers, providers } from 'ethers';
import AsyncStorage from '@react-native-community/async-storage';
import WalletConnectProvider from '@walletconnect/web3-provider';
import WalletConnect from '@walletconnect/client';
import { IConnector } from '@walletconnect/types';
import { INFURA_ID } from 'react-native-dotenv';

type Web3ContextType = {
    ethersProvider: providers.JsonRpcProvider | null;
    connectWeb3: () => Promise<void>;
    disconnect: () => void;
    uri: string;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    connectDID: (signer: ethers.Signer, isBurner: boolean) => void;
};

export const Web3Context = createContext<Web3ContextType>({
    ethersProvider: null,
    connectWeb3: async () => {},
    disconnect: () => undefined,
    uri: '',
    isVisible: false,
    setIsVisible: () => undefined,
    connectDID: () => undefined
});

export const Web3ContextProvider: React.FC = ({ children }) => {
    const [uri, setUri] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [connector, setConnector] = useState<IConnector>({} as IConnector);
    const [
        ethersProvider,
        setEthersProvider
    ] = useState<providers.Web3Provider | null>(null);
    const [wcProvider, setWCProvider] = useState<WalletConnectProvider | null>(
        null
    );

    useEffect(() => {
        setConnector(
            new WalletConnect({ bridge: 'https://bridge.walletconnect.org' })
        );
    }, []);

    const connectDID = async (signer: ethers.Signer) => {
        console.log('signer: ', signer);
        const token = await did.createToken(signer);
        await AsyncStorage.setItem('token', token);

        // commitLocalUpdate(env, store => {
        //     const me = store.getRoot().getLinkedRecord('me');
        //     if (me){
        //     me.setValue(token, 'token');
        //     }
        //   });
    };

    const getWalletConnector = async (
        provider: WalletConnectProvider
    ): Promise<IConnector> => {
        return new Promise((resolve, reject) => {
            const wc = connector;
            if (provider.isConnecting) {
                provider.connectCallbacks.push((x: any) => resolve(x));
            } else if (!wc.connected) {
                provider.isConnecting = true;
                const sessionRequestOptions = provider.chainId
                    ? { chainId: provider.chainId }
                    : undefined;
                wc.on('display_uri', (err, payload) => {
                    if (err) throw err;
                    setUri(payload.params[0]);
                });
                wc.on('modal_closed', () => {
                    reject(new Error('User closed modal'));
                });
                wc.createSession(sessionRequestOptions)
                    .then(() => {
                        setIsVisible(true);
                        wc.on('connect', (error, payload) => {
                            if (error) {
                                provider.isConnecting = false;
                                return reject(error);
                            }
                            provider.isConnecting = false;
                            provider.connected = true;
                            if (payload) {
                                // Handle session update
                                provider.updateState(payload.params[0]);
                            }
                            // Emit connect event
                            provider.emit('connect');
                            provider.triggerConnect(wc);
                            resolve(wc);
                        });
                    })
                    .catch((error) => {
                        provider.isConnecting = false;
                        reject(error);
                    });
            } else {
                if (!provider.connected) {
                    provider.connected = true;
                    provider.updateState(wc.session);
                }
                resolve(wc);
            }
        });
    };

    const enable = async (provider: WalletConnectProvider) => {
        const wc = await getWalletConnector(provider);
        if (wc) {
            provider.start();
            provider.subscribeWalletConnector();
            if (provider.connected) setIsVisible(false);
            return wc.accounts;
        } else {
            throw new Error('Failed to connect to WalletConnect');
        }
    };

    const connectWeb3 = useCallback(async () => {
        const provider = new WalletConnectProvider({
            infuraId: INFURA_ID,
            rpc: {
                100: 'https://dai.poa.network'
            },
            qrcode: false
        });

        await enable(provider);
        const web3Provider = new providers.Web3Provider(provider);
        console.log('web3Provider: ', web3Provider);
        const signer = web3Provider.getSigner();
        await connectDID(signer);
        setWCProvider(provider);
        setEthersProvider(web3Provider);
    }, [connectDID]);

    const disconnect = useCallback(async () => {
        console.log('disconnect');
    }, []);

    useEffect(() => {
        if (wcProvider) wcProvider.disconnect();
    }, [wcProvider]);
    return (
        <Web3Context.Provider
            value={{
                ethersProvider,
                connectWeb3,
                disconnect,
                uri,
                isVisible,
                setIsVisible,
                connectDID
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};
