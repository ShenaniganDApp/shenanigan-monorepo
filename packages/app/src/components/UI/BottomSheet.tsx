import React, {
    useContext,
    useEffect,
    ReactNode,
    useRef,
    useState,
    ReactElement
} from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { BlurView } from '@react-native-community/blur';
import { SwiperContext } from '../../contexts';

type Props = {
    height?: number | string;
    bottomSheetVisible?: boolean;
    setBottomSheetVisible: (b: boolean) => void;
    children: ReactNode;
};

const Bottom = ({
    children,
    height,
    setBottomSheetVisible,
    bottomSheetVisible,
    ...rest
}: Props): ReactElement => {
    // @TODO animate overlay
    const { setWalletScroll } = useContext(SwiperContext);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const sheetRef = useRef<BottomSheet>(null);

    const handleSheetChanges = (index: number) => {
        if (index === 0) {
            setBottomSheetVisible(false);
            setOverlayVisible(false);
            setWalletScroll(true);
        }
    };

    useEffect(() => {
        if (bottomSheetVisible) {
            setOverlayVisible(true);
            setWalletScroll(false);
            sheetRef.current?.expand();
        }
    });

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
                {...rest}
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
