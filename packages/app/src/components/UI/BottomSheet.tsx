import React, { useEffect, ReactNode, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import { BlurView } from '@react-native-community/blur';

type Props = {
    height: number;
    bottomSheetVisible?: boolean;
    setBottomSheetVisible: (b: boolean) => void;
    children: ReactNode;
};

const Bottom = ({
    children,
    height,
    setBottomSheetVisible,
    bottomSheetVisible
}: Props) => {
    const [overlayVisible, setOverlayVisible] = useState(false);

    const sheetRef = useRef(null);

    const onClose = () => {
        console.log('oncloseend');
        setBottomSheetVisible(false);
        setOverlayVisible(false);
    };

    useEffect(() => {
        if (bottomSheetVisible) {
            sheetRef.current.snapTo(0);
            setOverlayVisible(true);
        }
    }, [bottomSheetVisible]);

    return (
        <>
            {overlayVisible && (
                <BlurView
                    style={styles.absolute}
                    blurType="light"
                    blurAmount={4}
                    reducedTransparencyFallbackColor="rgba(255,255,255,.5)"
                />
            )}

            <BottomSheet
                ref={sheetRef}
                initialSnap={1}
                snapPoints={[height, 0]}
                borderRadius={10}
                renderContent={() => children}
                onCloseEnd={onClose}
                callbackThreshold={0.5}
            />
        </>
    );
};

export default Bottom;

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
});
