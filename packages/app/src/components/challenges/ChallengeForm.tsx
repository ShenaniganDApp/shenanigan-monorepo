import React, { ReactElement, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChallengeForm = (): ReactElement => {
    const [fields, setFields] = useState({
        title: '',
        description: '',
        sport: '',
        options: ''
    });

    const handleOnChange = (name: string, value: string) => {
        setFields((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmit = () => {
        if (isValidated()) {
            // trim
            console.log('validated');
        } else {
            console.log('not validated');
        }
    };

    const isValidated = () => {
        if (
            !fields.title.trim().length ||
            !fields.sport.trim().length ||
            fields.options.trim().split('\n').length < 2
        ) {
            return false;
        }

        return true;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Sport</Text>
                <TextInput
                    style={styles.field}
                    value={fields.sport}
                    onChangeText={(text) => handleOnChange('sport', text)}
                    keyboardType="default"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.field}
                    value={fields.title}
                    onChangeText={(text) => handleOnChange('title', text)}
                    keyboardType="default"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.textArea}
                    value={fields.description}
                    onChangeText={(text) => handleOnChange('description', text)}
                    keyboardType="default"
                    textAlignVertical="top"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Options</Text>
                <Text style={styles.secondary}>
                    Please add two or more options.
                </Text>
                <TextInput
                    style={styles.textArea}
                    value={fields.options}
                    onChangeText={(text) => handleOnChange('options', text)}
                    keyboardType="default"
                    numberOfLines={3}
                    multiline={true}
                    textAlignVertical="top"
                />
            </View>

            <Button onPress={onSubmit} title="Submit" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 12,
        paddingRight: 12
    },
    inputContainer: {
        marginBottom: 24
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8
    },
    secondary: {
        color: '#3f3f3f',
        marginBottom: 8
    },
    field: {
        backgroundColor: 'white',
        borderRadius: 6,
        // paddingTop: 12,
        // paddingBottom: 12,
        // paddingLeft: 16,
        // paddingRight: 16,
        padding: 12
    },
    textArea: {
        backgroundColor: 'white',
        padding: 6,
        height: 95
    }
});

export default ChallengeForm;
