// import * as React from 'react';
// import { View } from 'react-native';

// import Modal from 'react-native-modal';
// import QRCode from 'react-native-qrcode-svg';

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
