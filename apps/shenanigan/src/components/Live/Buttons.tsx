import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { Notch, Button } from '../UI';

type Props = {
    onPredictLeft: () => void;
    onDonate: () => void;
    onPredictRight: () => void;
};

export const Buttons = ({
    onPredictLeft,
    onDonate,
    onPredictRight
}: Props): ReactElement => {
    return (
        <View style={styles.container}>
            <Notch title="Predict" pink onPress={onPredictLeft} />
            <Button
                title="Donate"
                color="orange"
                style={styles.donateButton}
                onPress={onDonate}
            />
            <Notch title="Predict" onPress={onPredictRight} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    donateButton: {
        flex: 1,
        marginHorizontal: 8,
        paddingHorizontal: 12
    }
});
