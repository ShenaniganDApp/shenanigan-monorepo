import * as React from 'react';

import { Platform, Text, View, StyleSheet, Button, Image, FlatList, TouchableWithoutFeedback } from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';
import wallets from '../../registry';

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

const WalletsGrid = () => (
  <View style={styles.grid}>  
    {wallets.map(({ name, logo }) => (
      <View style={styles.item} key={name}>
        <Image source={logo} style={styles.logo}/>
        <Text>{name}</Text>
      </View>
    ))}
  </View>
)


const ConnectButton = () => (
  <Button title="Connect" onPress={() => console.log('connect')}/>
)

const Component = () => {
  if (Platform.OS === 'ios') {
    return <WalletsGrid />
  } else {
    return <ConnectButton/>
    // return <WalletsGrid />
  }
}

function WalletModal() {
	const [isVisible, setIsVisible] = React.useState(true)
  const [qrIsVisible, setQrIsVisible] = React.useState(false)
  
    return (
        <Modal isVisible={isVisible}>
						<View style={styles.header}>
							<Text style={styles.title}>WalletConnect</Text>
							<Button title="X" onPress={() => setIsVisible(false)}/>
						</View>

						<View style={styles.walletsContainer}>
							<Text style={styles.walletsTitle}>
								{qrIsVisible ? 'Scan QR Code' : 'Choose Your Preferred Wallet'}
							</Text>

							{qrIsVisible ? <QRCode size={160} value={'uri'} /> : <Component />}

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
  },
  logo : {
    width: 40, 
    height: 40, 
    backgroundColor: '#eee',
    resizeMode: 'contain',
    marginBottom: 8
  }
});
