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

export const StartChallenge = ({
    index,
    setIndex,
    form,
    setForm
}: Props): ReactElement => {
    const handleOnChange = (type: string, value: string) => {
        setForm((prevState: FormType) => ({
            ...prevState,
            [type]: value
        }));
    };

    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text>Title</Text>
            <Text>{form.title}</Text>
            <TextInput
                onChangeText={(value) => handleOnChange('title', value)}
                value={form.title}
                style={{ backgroundColor: '#ddd', width: 200 }}
            />
            <Text>Category</Text>
            <Text>{form.category}</Text>
            <TextInput
                onChangeText={(value) => handleOnChange('category', value)}
                value={form.category}
                style={{ backgroundColor: '#ddd', width: 200 }}
            />
            <Button onPress={() => setIndex(++index)} title="Next" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});
