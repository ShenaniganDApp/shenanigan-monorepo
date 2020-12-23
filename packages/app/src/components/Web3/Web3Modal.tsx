import * as React from 'react';

import { Text, View, StyleSheet, Button, Image, FlatList, TouchableWithoutFeedback } from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';
// import wallets from '../../registry';

// function useWeb3Modal() {
//      function triggerCloseAnimation(): void {
//         const doc = getDocumentOrThrow();
//         const modal = doc.getElementById(WALLETCONNECT_MODAL_ID);
//         if (modal) {
//             modal.className = modal.className.replace('fadeIn', 'fadeOut');
//             setTimeout(() => {
//                 const wrapper = doc.getElementById(WALLETCONNECT_WRAPPER_ID);
//                 if (wrapper) {
//                     doc.body.removeChild(wrapper);
//                 }
//             }, ANIMATION_DURATION);
//         }
//     }

//     function getWrappedCallback(cb: any): any {
//         return () => {
//             triggerCloseAnimation();
//             if (cb) {
//                 cb();
//             }
//         };

//          function open(
//             uri: string,
//             cb: any,
//             qrcodeModalOptions?: IQRCodeModalOptions
//         ) {
//             return (
//                 <Modal
//                     onModalHide={getWrappedCallback(cb)}
//                     qrcodeModalOptions={qrcodeModalOptions}
//                 >
//                     <View>
//                         <QRCode size={100} value={uri} />
//                     </View>
//                 </Modal>
//             );
//         }

//         export function close() {
//             triggerCloseAnimation();
//         }
//     }

//     return { open, close };
// }

// const Item = ({ name, logo }) => (
//   <View style={styles.item}>
// 		<Image source={logo} style={{width: 40, height: 40, backgroundColor: '#eee'}}/>
// 		{console.log(logo)}
//     <Text>{name}</Text>
//   </View>
// );

const WalletsGrid = () => {

	// const renderItem = ({ item }) => (
  //   <Item name={item.name} logo={item.logo} />
	// );
	
	return (
		// <FlatList
		// 	data={data}
		// 	renderItem={renderItem}
		// 	keyExtractor={item => item.name}
		// 	numColumns={3}
		// />
		<View style={styles.grid}>
			{data.map(({ name, logo }) => {
				return (
					<View style={styles.item} key={name}>
						<Image source={logo} style={{
							width: 40, 
							height: 40, 
							backgroundColor: '#eee',
							resizeMode: 'contain'
							}}/>
						<Text>{name}</Text>
					</View>
				)
			})}
		</View>
	)
}


function WalletModal() {
	const [isVisible, setisVisible] = React.useState(true)
	const [qrIsVisible, setQrIsVisible] = React.useState(false)

    return (
        <Modal isVisible={isVisible}>
						<View style={styles.header}>
							<Text style={styles.title}>WalletConnect</Text>
							<Button title="X" onPress={() => setisVisible(false)}/>
						</View>

						<View style={styles.walletsContainer}>
							<Text style={styles.walletsTitle}>
								{qrIsVisible ? 'Scan QR Code' : 'Choose Your Preferred Wallet'}
							</Text>

							{qrIsVisible ? <QRCode size={160} value={'uri'} /> : <WalletsGrid />}

							<TouchableWithoutFeedback
								onPress={() => setQrIsVisible(!qrIsVisible)}
							>
								<Text style={styles.button}>
									{qrIsVisible ? 'View Wallets' : 'View QR Code'}
								</Text>
							</TouchableWithoutFeedback>
						</View>
                
        </Modal>
    );
}
export default WalletModal;

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	title: {
		color: 'white'
	},
	walletsContainer: {
		backgroundColor: 'white',
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 32,
		paddingBottom: 32,
		borderRadius: 25,
		alignItems: 'center'
	},
	walletsTitle: {
		fontSize: 18,
		textAlign: 'center',
		color: '#686868',
		marginBottom: 20
	},
	button: {
		fontSize: 18,
		textAlign: 'center',
		color: '#686868',
		marginTop: 20
	},
	list: {
		textAlign: 'center'
	},
	item: {
		padding: 10,
		flexBasis: '33.333%',
		alignItems: 'center',
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	}
});


const data = [
  {
    name: "Rainbow",
    shortName: "Rainbow",
    color: "rgb(0, 30, 89)",
    logo: require("../../logos/wallet-rainbow.png"),
    universalLink: "https://rnbwapp.com",
    deepLink: "rainbow:"
  },
  {
    name: "MetaMask",
    shortName: "MetaMask",
    color: "rgb(255, 255, 255)",
    logo: require("../../logos/wallet-metamask.png"),
    universalLink: "https://metamask.app.link",
    deepLink: "metamask:"
  },
  {
    name: "Gnosis Safe",
    shortName: "Safe",
    color: "rgb(0, 140, 115)",
    logo: require("../../logos/wallet-gnosis.png"),
    universalLink: "https://safe.gnosis.io/walletconnect",
    deepLink: "gnosissafe:"
  },
  {
    name: "Argent",
    shortName: "Argent",
    color: "rgb(255, 135, 91)",
    logo: require("../../logos/wallet-argent.png"),
    universalLink: "https://argent.link/app",
    deepLink: "argent://app"
  },
  {
    name: "Trust Wallet",
    shortName: "Trust",
    color: "rgb(51, 117, 187)",
    logo: require("../../logos/wallet-trust.png"),
    universalLink: "https://link.trustwallet.com",
    deepLink: "trust:"
  },
  {
    name: "imToken",
    shortName: "imToken",
    color: "rgb(255, 255, 255)",
    logo: require("../../logos/wallet-imToken.png"),
    universalLink: "",
    deepLink: "imtokenv2:"
  },
  {
    name: "Pillar Wallet",
    shortName: "Pillar",
    color: "rgb(255, 255, 255)",
    logo: require("../../logos/wallet-pillar.png"),
    universalLink: "",
    deepLink: "pillarwallet:"
  },
  {
    name: "Math Wallet",
    shortName: "Math",
    color: "rgb(0, 30, 89)",
    logo: require("../../logos/wallet-math.png"),
    universalLink: "https://www.mathwallet.org",
    deepLink: "mathwallet:"
  },
  {
    name: "Nash",
    shortName: "Nash",
    color: "rgb(0,82,243)",
    logo: require("../../logos/wallet-nash.png"),
    universalLink: "https://nash.io/walletconnect",
    deepLink: "nash:"
  },
  {
    name: "MYKEY",
    shortName: "MYKEY",
    color: "rgb(255, 255, 255)",
    logo: require("../../logos/wallet-mykey.png"),
    universalLink: "https://mykey.org",
    deepLink: "mykeywalletconnect:"
  },
  {
    name: "TokenPocket",
    shortName: "TokenPocket",
    color: "rgb(41, 128, 254)",
    logo: require("../../logos/wallet-tokenpocket.png"),
    universalLink: "",
    deepLink: "tpoutside:"
  },
  {
    name: "EasyPocket",
    shortName: "EasyPocket",
    color: "rgb(17, 93, 251)",
    logo: require("../../logos/wallet-easypocket.png"),
    universalLink: "https://wallet.easypocket.app",
    deepLink: "easypocket:"
  }
]
