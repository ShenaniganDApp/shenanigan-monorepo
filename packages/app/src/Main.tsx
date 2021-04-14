import React, {
    ReactElement,
    Suspense,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ethers, providers } from 'ethers';
import { colors } from './components/UI/globalStyles';
import {
    NavigationContainer,
    NavigationContext
} from '@react-navigation/native';
import { Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LiveTabs, MainTabs } from './Navigator';
import { useBurner } from './hooks/Burner';
import { GetOrCreateUser } from './contexts/Web3Context/mutations/GetOrCreateUserMutation';
import { TabNavigationContext, Web3Context } from './contexts';
import { GetOrCreateUserMutationResponse } from './contexts/Web3Context/mutations/__generated__/GetOrCreateUserMutation.graphql';
import { WalletDropdown } from './WalletDropdown';
import Swiper from 'react-native-swiper';
import Animated from 'react-native-reanimated';
import { useMutation, usePreloadedQuery } from 'react-relay';
import type { AppQuery as AppQueryType } from './__generated__/AppQuery.graphql';
import { AppQuery } from './App';

import { REACT_APP_NETWORK_NAME } from 'react-native-dotenv';
import { Stream } from './components/Live/Stream';

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

export const Main = (props): ReactElement => {
    const { refetch, queryRef, isRefetching } = props;
    const data = usePreloadedQuery<AppQueryType>(AppQuery, queryRef);
    const [
        injectedProvider,
        setInjectedProvider
    ] = useState<providers.JsonRpcProvider | null>(null);
    const { mainIndex } = useContext(TabNavigationContext);
    const [metaProvider, setMetaProvider] = useState<providers.JsonRpcSigner>();
    const [skip, setSkip] = useState(true);
    const [walletScroll, setWalletScroll] = useState(true);
    const [chatScroll, setChatScroll] = useState(true);
    const [swiperIndex, setSwiperIndex] = React.useState(1);
    const [position] = useState(() => new Animated.Value(0));
    const burner = useBurner();
    const [getOrCreateUser, isInFlight] = useMutation(GetOrCreateUser);
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
        console.log(data);
    }, [data]);
    useEffect(() => {
        burner && setupUserSession();
    }, [burner]);

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

    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const { me, liveChallenge } = data;
    return (
        <Stream isMuted={isMuted} isPaused={isPaused}>
            <Swiper
                horizontal={false}
                showsPagination={false}
                loop={false}
                index={swiperIndex}
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
                        localProvider={
                            localProvider as providers.JsonRpcProvider
                        }
                        injectedProvider={injectedProvider}
                        price={price}
                        liveChallenge={liveChallenge}
                        me={me}
                        setWalletScroll={setWalletScroll}
                        query={data}
                        index={mainIndex}
                        setSwiperIndex={setSwiperIndex}
                        isMuted={isMuted}
                        isPaused={isPaused}
                        setIsMuted={setIsMuted}
                        setIsPaused={setIsPaused}
                    />
                </NavigationContainer>
                {mainIndex === 1 && (
                    <Animated.View style={{ backgroundColor: color, flex: 1 }}>
                        <LinearGradient
                            colors={['#FFFFFF00', colors.altWhite]}
                            style={{ flex: 1 }}
                        >
                            <SafeAreaView style={{ flex: 1 }}>
                                <NavigationContainer>
                                    <LiveTabs
                                        me={me}
                                        liveChallenge={liveChallenge}
                                        chatScroll={chatScroll}
                                        position={position}
                                        query={data}
                                    />
                                </NavigationContainer>
                            </SafeAreaView>
                        </LinearGradient>
                    </Animated.View>
                )}
            </Swiper>
        </Stream>
    );
};
