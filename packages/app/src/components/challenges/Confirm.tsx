import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from '../UI';

type Props = {
    index: number;
    setIndex: (n: number) => void;
    form: any;
};

export const Confirm = ({ index, setIndex, form }: Props): ReactElement => {
    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text>title: {form.title}</Text>
            <Text>category: {form.category}</Text>
            <Text>description: {form.description}</Text>
            {form.positive.map((option: string) => (
                <Text>positive: {option}</Text>
            ))}
            {form.negative.map((option: string) => (
                <Text>negative: {option}</Text>
            ))}
            <Button onPress={() => setIndex(--index)} title="Back" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});
