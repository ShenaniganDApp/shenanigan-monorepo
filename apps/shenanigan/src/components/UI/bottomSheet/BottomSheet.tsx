import React, { useContext, ReactNode, ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { SwiperContext } from '../../../contexts';

type Props = {
    children: ReactNode;
    onOpen?: () => void;
    onClose?: () => void;
};

const Bottom = React.forwardRef(
    ({ children, onOpen, onClose }: Props, ref): ReactElement => {
        const { setWalletScroll } = useContext(SwiperContext);
        const [containerHeight, setContainerHeight] = useState(400);

        const handleSheetChanges = (index: number) => {
            if (index === 0) {
                setWalletScroll(true);
                onClose && onClose();
            } else {
                setWalletScroll(false);
                onOpen && onOpen();
            }
        };

        return (
            <BottomSheet
                ref={ref}
                index={-1}
                snapPoints={[0, containerHeight + 20]}
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
                            {
                                backgroundColor: 'rgba(251, 250, 250, 0.7)',
                                borderTopRightRadius: 10,
                                borderTopLeftRadius: 10
                            }
                        ]}
                    />
                )}
            >
                <View
                    onLayout={(event) =>
                        setContainerHeight(event.nativeEvent.layout.height)
                    }
                >
                    {children}
                </View>
            </BottomSheet>
        );
    }
);

export default Bottom;
