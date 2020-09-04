import 'react-native-gesture-handler';
import { Dimensions, Text, Linking, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MainTabsStack } from './Navigator';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import WalletConnect from '@walletconnect/client';
import { IConnector } from '@walletconnect/types';
import { ethers } from "ethers";



const mainnetProvider = new ethers.providers.InfuraProvider("mainnet", "62fd1818438846a984542dd3520611c4")
let ropstenProvider

let localProvider
let networkBanner = (<></>)
if(process.env.REACT_APP_NETWORK_NAME){
  /*networkBanner = (
    <div style={{backgroundColor:process.env.REACT_APP_NETWORK_COLOR,color:"#FFFFFF",position:"absolute",left:0,top:0,width:"100%",fontSize:32,textAlign:"left",paddingLeft:32,opacity:0.125,filter:"blur(1.2px)"}}>
      {process.env.REACT_APP_NETWORK_NAME}
    </div>
  )*/
  if(process.env.REACT_APP_NETWORK_NAME==="xdai"){
    console.log("🎉 XDAINETWORK + 🚀 Mainnet Ethereum")
    localProvider = mainnetProvider
    ropstenProvider = new ethers.providers.JsonRpcProvider("https://dai.poa.network")
  } else if(process.env.REACT_APP_NETWORK_NAME==="sokol"){
    console.log("THIS.IS.SOKOL")
    localProvider = new ethers.providers.JsonRpcProvider("https://sokol.poa.network")
    ropstenProvider = new ethers.providers.InfuraProvider("ropsten", "62fd1818438846a984542dd3520611c4")
    //localProvider = new ethers.providers.Web3Provider(new BurnerProvider("https://dai.poa.network"))
  }else{
    localProvider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK_NAME, "9ea7e149b122423991f56257b882261c")
    ropstenProvider = new ethers.providers.InfuraProvider("ropsten", "62fd1818438846a984542dd3520611c4")
  }


}else{
  networkBanner = (
    <div style={{backgroundColor:"#666666",color:"#FFFFFF",position:"absolute",left:0,top:0,width:"100%",fontSize:54,textAlign:"left",paddingLeft:32,opacity:0.125,filter:"blur(1.2px)"}}>
      {"localhost"}
    </div>
  )
  localProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545")
  ropstenProvider = new ethers.providers.JsonRpcProvider("http://localhost:8546") // yarn run sidechain
}


export default () => {
    const [address, setAddress] = useState<string>();
    const [injectedProvider, setInjectedProvider] = useState();
    const [uri, setURI] = useState('');
    let connector: IConnector;

    // const readContracts = useContractLoader(localProvider);

    /**
     * Create a new WalletConnect connector
     *
     * @param connector
     * @param opts
     */
    function createConnector(opts) {
        const connector = new WalletConnect(opts);
        return connector;
    }
    // Check if connection is already established

    function onDisplayURI(err, payload) {
        if (err) {
            throw err;
        }
        setURI(payload.params[0]);

        throw new Error('URI missing from display_uri');
    }

    function onConnect(err, payload) {
        if (err) {
            throw err;
        }
        setAddress(payload.params[0].accounts[0]);
        console.log('Connected', payload);
        sendPing();
    }

    function onSessionUpdate(err, payload) {
        if (err) {
            throw err;
        }
        console.log('Session updated', payload);
    }

    function onPing(err, payload) {
        if (err) {
            throw err;
        }
        console.log('Ping received', payload);
    }

    function sendPing() {
        connector.sendCustomRequest({ method: 'ping' });
    }

    useEffect(() => {
        connector = createConnector({
            bridge: 'https://bridge.walletconnect.org'
        });
        connector.on('display_uri', (err, payload) => {
            onDisplayURI(err, payload);
        });
        connector.on('connect', (err, payload) => {
            onConnect(err, payload);
        });
        connector.on('session_update', (err, payload) => {
            onSessionUpdate(err, payload);
        });
        console.log('Creating session');
        connector.createSession();
    }, []);

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                {!address ? (
                    <Button
                        title="Connect"
                        onPress={() => Linking.openURL(uri)}
                    ></Button>
                ) : (
                    <MainTabsStack address={address} />
                )}
            </NavigationContainer>
        </SafeAreaProvider>
    );
};
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 }); //380 is magic number, not made for production
