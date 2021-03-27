import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Button } from '../UI';
import { FormType } from './CreateChallengeScreen';

type Props = {
    index: number;
    setIndex: (n: number) => void;
    form: any;
    setForm: (fn: any) => void;
    type: 'positive' | 'negative';
};

export const Outcomes = ({
    index,
    setIndex,
    form,
    setForm,
    type
}: Props): ReactElement => {
    const [value, setValue] = useState('');
    const [duplicateWarn, setDuplicateWarn] = useState(false);
    const formType =
        type === 'positive' ? 'positiveOptions' : 'negativeOptions';

    const addOption = () => {
        const duplicate =
            form.positiveOptions.some(
                (option: string) =>
                    option.toLowerCase() === value.toLowerCase().trim()
            ) ||
            form.negativeOptions.some(
                (option: string) =>
                    option.toLowerCase() === value.toLowerCase().trim()
            );

        if (!duplicate) {
            setForm((prevState: FormType) => ({
                ...prevState,
                [formType]: [...prevState[formType], value.trim()]
            }));
            setValue('');
            setDuplicateWarn(false);
        } else {
            setDuplicateWarn(true);
        }
    };

    const removeOption = (option: string) => {
        setForm((prevState: FormType) => ({
            ...prevState,
            [formType]: prevState[formType].filter((item) => item !== option)
        }));
    };

    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text>{type} Outcomes</Text>
            {form[formType].map((option: string) => (
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

            {duplicateWarn && <Text>Options must be unique.</Text>}

            <Button
                onPress={addOption}
                title="Add"
                disabled={value.trim().length < 3}
            />
            <Button onPress={() => setIndex(--index)} title="Back" />
            <Button
                onPress={() => setIndex(++index)}
                title="Next"
                disabled={form[formType].length < 1}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});
