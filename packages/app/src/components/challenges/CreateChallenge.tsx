import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Button } from '../UI';
interface Props {}

export const CreateChallenge = (props: Props): ReactElement => {
    const [index, setIndex] = useState(0);
    const [form, setForm] = useState({
        title: '',
        description: '',
        positive: [],
        negative: []
    });

    const comps = [
        <Test1
            index={index}
            setIndex={setIndex}
            form={form}
            setForm={setForm}
        />,
        <Test2
            index={index}
            setIndex={setIndex}
            form={form}
            setForm={setForm}
        />,
        <Test3
            index={index}
            setIndex={setIndex}
            form={form}
            setForm={setForm}
        />,
        <Test4
            index={index}
            setIndex={setIndex}
            form={form}
            setForm={setForm}
        />,
        <Test5 index={index} setIndex={setIndex} form={form} />
    ];
    return (
        <View style={styles.container}>
            {comps[index]}
            {console.log(form)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

const Test1 = ({ index, setIndex, form, setForm }): ReactElement => {
    const handleOnChange = (value) => {
        setForm((prevState) => ({
            ...prevState,
            title: value
        }));
    };

    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text>Test 1</Text>
            <Text>{form.title}</Text>
            <TextInput
                onChangeText={handleOnChange}
                value={form.title}
                style={{ backgroundColor: '#ddd', width: 200 }}
            />
            <Button onPress={() => setIndex(++index)} title="Next" />
        </View>
    );
};
const Test2 = ({ index, setIndex, form, setForm }): ReactElement => {
    const handleOnChange = (value) => {
        setForm((prevState) => ({
            ...prevState,
            description: value
        }));
    };
    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text>Test 2</Text>
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
const Test3 = ({ index, setIndex, form, setForm }): ReactElement => {
    const [value, setValue] = useState('');

    const addOption = () => {
        setForm((prevState) => ({
            ...prevState,
            positive: [...prevState.positive, value]
        }));
    };

    const removeOption = (option) => {
        setForm((prevState) => ({
            ...prevState,
            positive: prevState.positive.filter((item) => item !== option)
        }));
    };

    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text>Test 3</Text>
            {form.positive.map((option) => (
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

const Test4 = ({ index, setIndex, form, setForm }): ReactElement => {
    const [value, setValue] = useState('');

    const addOption = () => {
        setForm((prevState) => ({
            ...prevState,
            negative: [...prevState.negative, value]
        }));
    };

    const removeOption = (option) => {
        setForm((prevState) => ({
            ...prevState,
            negative: prevState.negative.filter((item) => item !== option)
        }));
    };

    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text>Test 4</Text>
            {form.negative.map((option) => (
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

const Test5 = ({ index, setIndex, form }): ReactElement => {
    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text>title: {form.title}</Text>
            <Text>description: {form.description}</Text>
            {form.positive.map((option) => (
                <Text>positive: {option}</Text>
            ))}
            {form.negative.map((option) => (
                <Text>negative: {option}</Text>
            ))}
            <Button onPress={() => setIndex(--index)} title="Back" />
        </View>
    );
};
