import React, { ReactElement, useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, colors } from '../UI';
import { FormType } from './CreateChallengeScreen';

type Props = {
    index: number;
    setIndex: (n: number) => void;
    form: FormType;
};

export const Buttons = ({ index, setIndex, form }: Props): ReactElement => {
    const [nextDisabled, setNextDisabled] = useState(true);

    useEffect(() => {
        if (index === 0) {
            if (!!form.title && !!form.content && !!form.image) {
                return setNextDisabled(false);
            }
        }

        if (index === 1) {
            if (
                form.positiveOptions.length > 0 &&
                form.positiveOptions.length > 0
            ) {
                return setNextDisabled(false);
            }
        }

        setNextDisabled(true);
    }, [form, index]);

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

            {index !== 2 ? (
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
            ) : (
                <Button title="Create" onPress={() => console.log('confirm')} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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
