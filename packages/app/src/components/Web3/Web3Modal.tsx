import * as React from 'react';

import { Text, View, StyleSheet, Button } from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';

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

function WalletModal() {
    return (
        <Modal isVisible={true}>
            <View style={styles.container}>

							<View style={styles.header}>
								<Text style={styles.title}>WalletConnect</Text>
                <Button title="X" onPress={() => null}/>
							</View>

							<View style={styles.walletsContainer}>
								<Text style={styles.walletsTitle}>Choose Your Preferred Wallet</Text>

								<View style={styles.list}>
								</View>
								<Text style={styles.walletsTitle}>View QR Code</Text>

							</View>
                
            </View>
        </Modal>
    );
}
export default WalletModal;

const styles = StyleSheet.create({
	container: {

	},
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
		paddingLeft: 40,
		paddingRight: 40,
		paddingTop: 32,
		paddingBottom: 32,
		borderRadius: 25,
		alignItems: 'center'
	},
	walletsTitle: {
		fontSize: 18,
		textAlign: 'center',
		color: '#696969'
	},
	list: {
		padding: 20
	}
});
