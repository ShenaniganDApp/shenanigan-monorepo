import { NavigationContainer } from '@react-navigation/native';
import { ethers, providers } from 'ethers';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Dimensions, Text } from 'react-native';
import { REACT_APP_NETWORK_NAME } from 'react-native-dotenv';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useMutation, useQuery } from 'relay-hooks';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from './components/UI/globalStyles';
import { AppQuery } from './__generated__/AppQuery.graphql';
import { LiveTabs, MainTabs } from './Navigator';
import { useBurner } from './hooks/Burner';
import { GetOrCreateUser } from './contexts/Web3Context/mutations/GetOrCreateUserMutation';
import { Web3Context } from './contexts';
import { GetOrCreateUserMutationResponse } from './contexts/Web3Context/mutations/__generated__/GetOrCreateUserMutation.graphql';
import { WalletDropdown } from './WalletDropdown';
import Swiper from 'react-native-swiper';
import Animated from 'react-native-reanimated';

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

export const App = (): ReactElement => {
    const [
        injectedProvider,
        setInjectedProvider
    ] = useState<providers.JsonRpcProvider | null>(null);
    const [metaProvider, setMetaProvider] = useState<providers.JsonRpcSigner>();
    const [skip, setSkip] = useState(true);
    const [walletScroll, setWalletScroll] = useState(true);
    const [chatScroll, setChatScroll] = useState(true);
    const [index, setIndex] = React.useState(1);
    const [position] = useState(() => new Animated.Value(0));
    const { props, retry, error, cached } = useQuery<AppQuery>(
        graphql`
            query AppQuery {
                me {
                    ...Comments_me
                    ...Live_me
                    ...WalletDropdown_me
                    burner
                }
                liveChallenge {
                    ...Comments_liveChallenge
                }
                ...CommentList_query
                ...LiveChatList_query
            }
        `,
        {},
        { skip }
    );
    const { me, liveChallenge } = { ...props };
    const burner = useBurner();
    const [getOrCreateUser, { loading }] = useMutation(GetOrCreateUser);
    const { connectDID, connector } = useContext(Web3Context);
    const price = 1;
    const gasPrice = 1001010001;
    const setupUserSession = async () => {
        //@TODO handle expired tokens
        await connectDID(connector, burner);

        const address = connector.accounts[0]
            ? connector.accounts[0]
            : await burner.getAddress();

        const config = {
            variables: {
                input: {
                    address,
                    burner: !connector.connected
                }
            },

            onCompleted: ({
                GetOrCreateUser: user
            }: GetOrCreateUserMutationResponse) => {
                if (user.error) {
                    console.log(user.error);
                    return;
                }
                setSkip(false);
                console.log('id: ' + user.user.id);
            }
        };
        getOrCreateUser(config);
    };
    useEffect(() => {
        burner && setupUserSession();
    }, [burner]);

    const handleIndex = (i: number) => {
        setIndex(i);
        setWalletScroll(true);
    };
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

    const color = Animated.interpolateColors(position, {
        inputRange: [0, 1, 2],
        outputColorRange: [colors.green, colors.yellow, colors.pink]
    });
    return !props ? (
        <SafeAreaView style={{ backgroundColor: '#e6ffff', flex: 1 }}>
            <Text>Loading</Text>
        </SafeAreaView>
    ) : (
        <Swiper
            horizontal={false}
            showsPagination={false}
            loop={false}
            index={1}
            scrollEnabled={walletScroll}
            directionalLockEnabled
            onScroll={() => setChatScroll(false)}
            onMomentumScrollEnd={() => setChatScroll(true)}
        >
            <WalletDropdown
                me={me}
                liveChallenge={liveChallenge}
                mainnetProvider={mainnetProvider}
                localProvider={localProvider}
                price={price}
            />
            <NavigationContainer>
                <MainTabs
                    mainnetProvider={mainnetProvider}
                    localProvider={localProvider as providers.JsonRpcProvider}
                    injectedProvider={injectedProvider}
                    price={price}
                    liveChallenge={liveChallenge}
                    me={me}
                    index={index}
                    handleIndex={handleIndex}
                    setWalletScroll={setWalletScroll}
                    commentsQuery={props}
                />
            </NavigationContainer>
            {index === 1 && (
                <Animated.View style={{ backgroundColor: color, flex: 1 }}>
                    <LinearGradient
                        colors={['#FFFFFF00', colors.altWhite]}
                        style={{ flex: 1 }}
                    >
                        <NavigationContainer>
                            <LiveTabs
                                me={me}
                                liveChallenge={liveChallenge}
                                chatScroll={chatScroll}
                                position={position}
                                commentsQuery={props}
                            />
                        </NavigationContainer>
                    </LinearGradient>
                </Animated.View>
            )}
        </Swiper>
    );
};
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 }); // 380 is magic number, not made for production
