import { NavigationContainer } from '@react-navigation/native';
import { ethers, providers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, Text, View } from 'react-native';
import { INFURA_ID, REACT_APP_NETWORK_NAME } from 'react-native-dotenv';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useQuery } from 'relay-hooks';

import { AppQuery } from './__generated__/AppQuery.graphql';
import { MainTabsStack } from './Navigator';
// import { Account } from './components/Web3';

const mainnetProvider = new ethers.providers.InfuraProvider(
    'mainnet',
    '62fd1818438846a984542dd3520611c4'
);
let kovanProvider;

let localProvider: providers.JsonRpcProvider | providers.InfuraProvider;
let networkBanner = <></>;
console.log('REACT_APP_NETWORK_NAME: ', REACT_APP_NETWORK_NAME);
if (REACT_APP_NETWORK_NAME) {
    /* networkBanner = (
    <div style={{backgroundColor:REACT_APP_NETWORK_COLOR,color:"#FFFFFF",position:"absolute",left:0,top:0,width:"100%",fontSize:32,textAlign:"left",paddingLeft:32,opacity:0.125,filter:"blur(1.2px)"}}>
      {REACT_APP_NETWORK_NAME}
    </div>
  ) */
    if (REACT_APP_NETWORK_NAME === 'xdai') {
        console.log('🎉 XDAINETWORK + 🚀 Mainnet Ethereum');
        localProvider = mainnetProvider;
        kovanProvider = new ethers.providers.JsonRpcProvider(
            'https://dai.poa.network'
        );
        console.log(kovanProvider);
    } else if (REACT_APP_NETWORK_NAME === 'sokol') {
        console.log('THIS.IS.SOKOL');
        localProvider = new ethers.providers.JsonRpcProvider(
            'https://sokol.poa.network'
        );
        kovanProvider = new ethers.providers.InfuraProvider(
            'kovan',
            '62fd1818438846a984542dd3520611c4'
        );
        // localProvider = new ethers.providers.Web3Provider(new BurnerProvider("https://dai.poa.network"))
    } else {
        localProvider = new ethers.providers.InfuraProvider(
            REACT_APP_NETWORK_NAME,
            '9ea7e149b122423991f56257b882261c'
        );
        kovanProvider = new ethers.providers.InfuraProvider(
            'kovan',
            '62fd1818438846a984542dd3520611c4'
        );
    }
} else {
    networkBanner = (
        <SafeAreaView
            style={{
                backgroundColor: '#666666',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                paddingLeft: 32,
                opacity: 0.125
            }}
        >
            <Text style={{ color: '#FFFFFF', fontSize: 54, textAlign: 'left' }}>
                localhost
            </Text>
        </SafeAreaView>
    );
    localProvider = new ethers.providers.JsonRpcProvider(
        'http://localhost:8545'
    );
    kovanProvider = new ethers.providers.JsonRpcProvider(
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
    const [injectedProvider, setInjectedProvider] = useState<
        providers.JsonRpcProvider
    >();
    const [metaProvider, setMetaProvider] = useState<providers.JsonRpcSigner>();
    const { props, retry, error } = useQuery<AppQuery>(query);

    const price = 1;
    const gasPrice = 1001010001;

    // let accountDisplay = (
    // //     <Account
    // //         address={address}
    // //         setAddress={setAddress}
    // //         localProvider={kovanProvider}
    // //         injectedProvider={injectedProvider}
    // //         setInjectedProvider={setInjectedProvider}
    // //         setInjectedGsnSigner={setInjectedGsnSigner}
    // //         mainnetProvider={mainnetProvider}
    // //         price={gasPrice}
    // //         minimized={false}
    // //         setMetaProvider={setMetaProvider}
    // //     />
    // );

    return (
        <NavigationContainer>
            {props?.me ? (
                <MainTabsStack
                    me={props.me}
                    retry={retry}
                    mainnetProvider={mainnetProvider}
                    localProvider={localProvider as providers.JsonRpcProvider}
                    injectedProvider={injectedProvider}
                    price={price}
                />
            ) : (
                <SafeAreaView>
                    <Text>Loading...</Text>
                </SafeAreaView>
            )}
        </NavigationContainer>
    );
};
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 }); // 380 is magic number, not made for production
