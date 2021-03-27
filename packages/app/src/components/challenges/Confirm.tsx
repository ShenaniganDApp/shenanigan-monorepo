import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, colors } from '../UI';

type Props = {
    index: number;
    setIndex: (n: number) => void;
    form: any;
};

export const Confirm = ({ index, setIndex, form }: Props): ReactElement => {
    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text>title: {form.title}</Text>
                <Text>category: {form.category}</Text>
                <Text>description: {form.content}</Text>
                {form.positiveOptions.map((option: string) => (
                    <Text>positive: {option}</Text>
                ))}
                {form.negativeOptions.map((option: string) => (
                    <Text>negative: {option}</Text>
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <Button onPress={() => setIndex(--index)} title="Back" small />
                <Button
                    onPress={() => console.log(form)}
                    title="Confirm"
                    small
                    color={colors.green}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
