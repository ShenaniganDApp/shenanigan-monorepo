// import React, { useEffect } from 'react';
// import { ethers, providers } from 'ethers';
// // import BurnerProvider from 'burner-provider-react-native';
// import { Balance, Address, Wallet } from '.';
// import { usePoller } from '../../hooks';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import { RelayProvider } from '@opengsn/gsn';
// //import Fortmatic from "fortmatic";
// //import Portis from "@portis/web3";
// const Web3HttpProvider = require('web3-providers-http');
// import { INFURA_ID } from 'react-native-dotenv';

// type Props = {
//     address: string;
//     setAddress: (address: string) => void;
//     injectedProvider: providers.JsonRpcProvider;
//     localProvider: providers.JsonRpcProvider | providers.InfuraProvider;
//     setInjectedProvider: (provider: providers.JsonRpcProvider) => void;
//     setInjectedGsnSigner: (signer: providers.JsonRpcSigner) => void;
//     mainnetProvider: providers.InfuraProvider;
//     price: number;
//     minimized: boolean;
//     setMetaProvider: (signer: providers.JsonRpcSigner) => void;
//     pollTime?: number;
// };

// type GSNConfig = {
//     relayHubAddress?: string;
//     stakeManagerAddress?: string;
//     paymasterAddress?: string;
//     chainId?: number;
//     relayLookupWindowBlocks?: number;
//     verbose?: boolean;
//     gasPriceFactorPercent?: number;
//     methodSuffix?: string;
//     jsonStringifyRequest?: boolean /*, chainId: provider.networkVersion*/;
// };

// export default function Account(props: Props) {
//     let gsnConfig: GSNConfig;
//     if (process.env.REACT_APP_USE_GSN === 'true') {
//         let relayHubAddress;
//         let stakeManagerAddress;
//         let paymasterAddress;
//         let chainId;
//         if (process.env.REACT_APP_NETWORK_NAME === 'xdai') {
//             relayHubAddress = '0xA58B6fC9264ce507d0B0B477ceE31674341CB27e';
//             stakeManagerAddress = '0xd1Fa0c7E52440078cC04a9e99beA727f3e0b981B';
//             paymasterAddress = '0x2ebc08948d0DD5D034FBE0b1084C65f57eF7D0bC';
//             chainId = 100;
//         } else if (process.env.REACT_APP_NETWORK_NAME === 'sokol') {
//             relayHubAddress = '0xA17C8F25668a5748E9B80ED8Ff842f8909258bF6';
//             stakeManagerAddress = '0xbE9B5be78bdB068CaE705EdF1c18F061698B6F83';
//             paymasterAddress = '0x205091FE2AFAEbCB8843EDa0A8ee28B170aa0619';
//             chainId = 42;
//         } else {
//             // relayHubAddress = require('.././gsn/RelayHub.json').address;
//             // stakeManagerAddress = require('.././gsn/StakeManager.json').address;
//             // paymasterAddress = require('.././gsn/Paymaster.json').address;
//             console.log(
//                 'local GSN addresses',
//                 relayHubAddress,
//                 stakeManagerAddress,
//                 paymasterAddress
//             );
//         }

//         gsnConfig = {
//             relayHubAddress,
//             stakeManagerAddress,
//             paymasterAddress,
//             chainId
//         };

//         gsnConfig.relayLookupWindowBlocks = 1e5;
//         gsnConfig.verbose = true;
//     }
//     //gsnConfig.preferredRelays = ["https://relay.tokenizationofeverything.com"]

//     /*
//   function warning(network, chainId) {
//       Modal.warning({
//         title: 'MetaMask Network Mismatch',
//         content: <>Please connect to <b>https://dai.poa.network</b></>,
//       });
//     }
//     */

//     const createBurnerIfNoAddress = async () => {
//         if (
//             !props.injectedProvider &&
//             props.localProvider &&
//             typeof props.setInjectedGsnSigner == 'function' &&
//             typeof props.setInjectedProvider == 'function'
//         ) {
//             let burner;
//             if (process.env.REACT_APP_NETWORK_NAME === 'xdai') {
//                 burner = new BurnerProvider('https://dai.poa.network');
//             } else if (process.env.REACT_APP_NETWORK_NAME === 'sokol') {
//                 burner = new BurnerProvider(
//                     'https://kovan.infura.io/v3/9ea7e149b122423991f56257b882261c'
//                 ); //new ethers.providers.InfuraProvider("kovan", "9ea7e149b122423991f56257b882261c")
//             } else {
//                 burner = new BurnerProvider('http://localhost:8546'); //
//             }
//             console.log('🔥📡 burner', burner);
//             updateProviders(burner);
//         } else {
//             pollInjectedProvider();
//         }
//     };
//     useEffect(() => {
//         createBurnerIfNoAddress();
//     }, [props.injectedProvider]);

//     const updateProviders = async (provider: BurnerProvider) => {
//         console.log('UPDATE provider:', provider);
//         let newWeb3Provider = await new ethers.providers.Web3Provider(provider);
//         props.setInjectedProvider(newWeb3Provider);

//         if (process.env.REACT_APP_USE_GSN === 'true') {
//             if (provider._metamask) {
//                 //console.log('using metamask')
//                 gsnConfig = {
//                     ...gsnConfig,
//                     gasPriceFactorPercent: 70,
//                     methodSuffix: '_v4',
//                     jsonStringifyRequest: true /*, chainId: provider.networkVersion*/
//                 };
//             }

//             const gsnProvider = new RelayProvider(provider, gsnConfig);
//             const gsnWeb3Provider = new ethers.providers.Web3Provider(
//                 gsnProvider
//             );
//             //console.log("GOT GSN PROVIDER",gsnProvider)
//             const gsnSigner = gsnWeb3Provider.getSigner(props.address);
//             props.setInjectedGsnSigner(gsnSigner);
//         }
//     };

//     const pollInjectedProvider = async () => {
//         if (props.injectedProvider) {
//             let accounts = await props.injectedProvider.listAccounts();
//             if (accounts && accounts[0] && accounts[0] !== props.account) {
//                 //console.log("ADDRESS: ",accounts[0])
//                 if (typeof props.setAddress == 'function')
//                     props.setAddress(accounts[0]);
//             }
//         }
//     };
//     usePoller(
//         () => {
//             pollInjectedProvider();
//         },
//         props.pollTime ? props.pollTime : 1999
//     );

//     if (typeof props.setInjectedProvider == 'function') {
//     }

//     React.useEffect(() => {
//         if (process.env.REACT_APP_USE_GSN === 'true') {
//             const createBurnerMetaSigner = async () => {
//                 let origProvider;
//                 if (process.env.REACT_APP_NETWORK_NAME === 'xdai') {
//                     origProvider = new Web3HttpProvider(
//                         'https://dai.poa.network'
//                     );
//                 } else if (process.env.REACT_APP_NETWORK_NAME === 'sokol') {
//                     origProvider = new ethers.providers.InfuraProvider(
//                         'kovan',
//                         '9ea7e149b122423991f56257b882261c'
//                     );
//                 } else {
//                     origProvider = new ethers.providers.JsonRpcProvider(
//                         'http://localhost:8546'
//                     );
//                 }
//                 const gsnProvider = new RelayProvider(origProvider, gsnConfig);

//                 const account = await gsnProvider.newAccount();
//                 let from = account.address;

//                 const provider = new ethers.providers.Web3Provider(gsnProvider);
//                 const signer = provider.getSigner(from);

//                 props.setMetaProvider(signer);
//             };
//             createBurnerMetaSigner();
//         }
//     }, []);

//     let display = <></>;
//     display = (
//         <span>
//             {props.address ? (
//                 <Address
//                     value={props.address}
//                     ensProvider={props.mainnetProvider}
//                 />
//             ) : (
//                 'Connecting...'
//             )}
//             <Balance
//                 address={props.address}
//                 provider={props.localProvider}
//                 dollarMultiplier={props.price}
//             />
//             <Wallet
//                 address={props.address}
//                 provider={props.injectedProvider}
//                 ensProvider={props.mainnetProvider}
//                 price={props.price}
//             />
//         </span>
//     );

//     return <div>{display} </div>;
// }
