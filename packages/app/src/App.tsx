import { Dimensions, Button, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainTabsStack } from './Navigator';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ethers } from 'ethers';
import { graphql, useQuery } from 'relay-hooks';
import { AppQuery } from './__generated__/AppQuery.graphql';
import { useWalletConnect } from 'react-native-walletconnect';

const mainnetProvider = new ethers.providers.InfuraProvider(
    'mainnet',
    '62fd1818438846a984542dd3520611c4'
);
let ropstenProvider;

let localProvider;
let networkBanner = <></>;
if (process.env.REACT_APP_NETWORK_NAME) {
    /*networkBanner = (
    <div style={{backgroundColor:process.env.REACT_APP_NETWORK_COLOR,color:"#FFFFFF",position:"absolute",left:0,top:0,width:"100%",fontSize:32,textAlign:"left",paddingLeft:32,opacity:0.125,filter:"blur(1.2px)"}}>
      {process.env.REACT_APP_NETWORK_NAME}
    </div>
  )*/
    if (process.env.REACT_APP_NETWORK_NAME === 'xdai') {
        console.log('🎉 XDAINETWORK + 🚀 Mainnet Ethereum');
        localProvider = mainnetProvider;
        ropstenProvider = new ethers.providers.JsonRpcProvider(
            'https://dai.poa.network'
        );
    } else if (process.env.REACT_APP_NETWORK_NAME === 'sokol') {
        console.log('THIS.IS.SOKOL');
        localProvider = new ethers.providers.JsonRpcProvider(
            'https://sokol.poa.network'
        );
        ropstenProvider = new ethers.providers.InfuraProvider(
            'ropsten',
            '62fd1818438846a984542dd3520611c4'
        );
        //localProvider = new ethers.providers.Web3Provider(new BurnerProvider("https://dai.poa.network"))
    } else {
        localProvider = new ethers.providers.InfuraProvider(
            process.env.REACT_APP_NETWORK_NAME,
            '9ea7e149b122423991f56257b882261c'
        );
        ropstenProvider = new ethers.providers.InfuraProvider(
            'ropsten',
            '62fd1818438846a984542dd3520611c4'
        );
    }
} else {
    networkBanner = (
        <View
            style={{
                backgroundColor: '#666666',
                color: '#FFFFFF',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                fontSize: 54,
                textAlign: 'left',
                paddingLeft: 32,
                opacity: 0.125,
                filter: 'blur(1.2px)'
            }}
        >
            {'localhost'}
        </View>
    );
    localProvider = new ethers.providers.JsonRpcProvider(
        'http://localhost:8545'
    );
    ropstenProvider = new ethers.providers.JsonRpcProvider(
        'http://localhost:8546'
    ); // yarn run sidechain
}

const query = graphql`
    query AppQuery {
        me {
            ...Profile_me
        }
    }
`;

export default () => {
    const [address, setAddress] = useState<string>();
    const [injectedProvider, setInjectedProvider] = useState();
    const [uri, setURI] = useState('');
    const { props, retry, error } = useQuery<AppQuery>(query);
    const {
        createSession,
        killSession,
        session,
        signTransaction
    } = useWalletConnect();
    const hasWallet = !!session.length;

    useEffect(() => {
        session && setAddress(session.accounts[0]);
    }, [session]);

    return (
        <NavigationContainer>
            {!address ? (
                <SafeAreaView>
                    {!hasWallet && (
                        <Button title="Connect" onPress={createSession} />
                    )}
                    {!!hasWallet && (
                        <Button
                            title="Sign Transaction"
                            onPress={() =>
                                signTransaction({
                                    from:
                                        address,
                                    to:
                                        '0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359',
                                    data: '0x',
                                    gasPrice: '0x02540be400',
                                    gas: '0x9c40',
                                    value: '0x00',
                                    nonce: '0x0114'
                                })
                            }
                        />
                    )}
                    {!!hasWallet && (
                        <Button title="Disconnect" onPress={killSession} />
                    )}
                </SafeAreaView>
            ) : (
                <MainTabsStack me={props!.me} address={address} retry={retry} />
            )}
        </NavigationContainer>
    );
};
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 }); //380 is magic number, not made for production
