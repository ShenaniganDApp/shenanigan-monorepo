import React, { ReactElement } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Button } from '../UI';
import { FormType } from './CreateChallengeScreen';

type Props = {
    index: number;
    setIndex: (n: number) => void;
    form: any;
    setForm: (fn: any) => void;
};

export const ChallengeDescription = ({
    index,
    setIndex,
    form,
    setForm
}: Props): ReactElement => {
    const handleOnChange = (value: string) => {
        setForm((prevState: FormType) => ({
            ...prevState,
            content: value
        }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>Challenge Details</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Stream Description</Text>
                    <Text style={styles.text}>{form.title}</Text>

                    <Text style={styles.label}>Stream Description</Text>
                    <TextInput
                        onChangeText={handleOnChange}
                        value={form.description}
                        style={styles.input}
                        placeholder="Enter stream description..."
                        placeholderTextColor="#333"
                        multiline
                        numberOfLines={1}
                    />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button onPress={() => setIndex(--index)} title="Back" small />
                <Button onPress={() => setIndex(++index)} title="Next" small />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    infoContainer: {
        marginTop: 90
    },
    card: {
        backgroundColor: 'rgba(255,255,255,.5)',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 24
    },
    title: {
        fontSize: 24,
        marginBottom: 40,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#5f5257',
        marginBottom: 6,
        textTransform: 'uppercase'
    },
    text: {
        fontSize: 16,
        marginBottom: 32
    },
    input: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '100%',
        marginBottom: 24,
        fontSize: 16,
        paddingBottom: 4,
        height: 100
    }
});
