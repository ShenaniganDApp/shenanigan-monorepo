import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, colors } from '../UI';

type Props = {};

export const Buttons = ({
    index,
    setIndex,
    nextDisabled
}: Props): ReactElement => {
    return (
        <View style={styles.buttonContainer}>
            {index > 0 ? (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIndex(index - 1)}
                >
                    <Icon
                        name="chevron-left"
                        size={56}
                        color={colors.pink}
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            ) : (
                <Text></Text>
            )}

            <TouchableOpacity
                disabled={nextDisabled}
                style={styles.button}
                onPress={() => setIndex(index + 1)}
            >
                <Icon
                    name="chevron-right"
                    size={56}
                    color={nextDisabled ? colors.gray : colors.pink}
                    style={styles.icon}
                />
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>

            {/* <Button title="Create" onPress={() => console.log('confirm')} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        alignItems: 'center'
    },
    icon: {
        marginBottom: -10
    },
    buttonText: {
        color: colors.grayMedium
    }
});
