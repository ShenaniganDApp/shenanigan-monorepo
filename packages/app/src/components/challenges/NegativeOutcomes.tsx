import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Button } from '../UI';
import { FormType } from './CreateChallengeScreen';

type Props = {
    index: number;
    setIndex: (n: number) => void;
    form: any;
    setForm: (fn: any) => void;
};

export const NegativeOutcomes = ({
    index,
    setIndex,
    form,
    setForm
}: Props): ReactElement => {
    const [value, setValue] = useState('');

    const addOption = () => {
        setForm((prevState: FormType) => ({
            ...prevState,
            negative: [...prevState.negative, value]
        }));
        setValue('');
    };

    const removeOption = (option: string) => {
        setForm((prevState: FormType) => ({
            ...prevState,
            negative: prevState.negative.filter((item) => item !== option)
        }));
    };

    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text>Negative Outcomes</Text>
            {form.negative.map((option: string) => (
                <View key={option}>
                    <Button
                        title="x"
                        onPress={() => removeOption(option)}
                        small
                    />
                    <Text>{option}</Text>
                </View>
            ))}
            <TextInput
                onChangeText={setValue}
                value={value}
                style={{ backgroundColor: '#ddd', width: 200 }}
            />
            <Button onPress={addOption} title="Add" />
            <Button onPress={() => setIndex(--index)} title="Back" />
            <Button onPress={() => setIndex(++index)} title="Next" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});
