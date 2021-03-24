import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Button } from '../UI';
import { FormType } from './CreateChallengeScreen';
import { PreviousChallenges } from './PreviousChallenges';

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
        <View style={styles.container}>
            <PreviousChallenges />

            <View>
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
                <Button
                    onPress={() => setIndex(++index)}
                    title="Next"
                    disabled={form.title.trim().length < 3}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,.3)',
        borderRadius: 10,
        padding: 16
    }
});
