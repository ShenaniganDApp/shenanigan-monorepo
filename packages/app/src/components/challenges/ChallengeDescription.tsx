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
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text>Description</Text>
            <Text>{form.description}</Text>
            <TextInput
                onChangeText={handleOnChange}
                value={form.description}
                style={{ backgroundColor: '#ddd', width: 200 }}
            />
            <Button onPress={() => setIndex(--index)} title="Back" />
            <Button onPress={() => setIndex(++index)} title="Next" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});
