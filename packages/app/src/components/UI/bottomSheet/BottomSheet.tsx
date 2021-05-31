import React, { useContext, ReactNode, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { SwiperContext } from '../../../contexts';

type Props = {
    height?: number | string;
    children: ReactNode;
};

const Bottom = React.forwardRef(
    ({ children, height, ...rest }: Props, ref): ReactElement => {
        const { setWalletScroll } = useContext(SwiperContext);

        const handleSheetChanges = (index: number) => {
            if (index === 0) {
                setWalletScroll(true);
            } else {
                setWalletScroll(false);
            }
        };

        return (
            <BottomSheet
                ref={ref}
                index={-1}
                snapPoints={[0, height ? height : 300]}
                onChange={handleSheetChanges}
                keyboardBehavior="interactive"
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        style={[props.style, { backgroundColor: 'white' }]}
                    />
                )}
                backgroundComponent={() => (
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            { backgroundColor: 'rgba(251, 250, 250, 0.7)' }
                        ]}
                    />
                )}
                {...rest}
            >
                {children}
            </BottomSheet>
        );
    }
);

export default Bottom;
