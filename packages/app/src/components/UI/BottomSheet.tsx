import React, {
    useEffect,
    ReactNode,
    useRef,
    useState,
    useCallback
} from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { BlurView } from '@react-native-community/blur';

type Props = {
    height?: number;
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

    const handleSheetChanges = useCallback((index: number) => {
        if (index === 0) {
            setOverlayVisible(false);
            setBottomSheetVisible(false);
        }
    }, []);

    useEffect(() => {
        if (bottomSheetVisible) {
            sheetRef.current.expand();
            setOverlayVisible(true);
        }
    }, [bottomSheetVisible]);

    return (
        <>
            {overlayVisible && (
                <BlurView
                    style={styles.absolute}
                    blurType="light"
                    blurAmount={2}
                    reducedTransparencyFallbackColor="rgba(255,255,255,.5)"
                />
            )}
            <BottomSheet
                ref={sheetRef}
                index={0}
                snapPoints={[0, height ? height : 300]}
                onChange={handleSheetChanges}
            >
                {children}
            </BottomSheet>
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
