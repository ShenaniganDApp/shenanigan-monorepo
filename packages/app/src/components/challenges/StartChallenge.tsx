import React, { ReactElement } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Button, colors } from '../UI';
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
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
                keyboardVerticalOffset={96}
            >
                <PreviousChallenges />

                <View style={styles.newChallenge}>
                    <Text style={styles.title}>New Challenge</Text>
                    <View style={styles.divider} />

                    <View style={styles.inputsContainer}>
                        <Text style={styles.label}>Stream Title</Text>

                        <TextInput
                            onChangeText={value =>
                                handleOnChange('title', value)
                            }
                            value={form.title}
                            style={styles.input}
                            placeholder="Enter your title here..."
                            placeholderTextColor="#333"
                        />
                        <Text style={styles.label}>Stream Category</Text>
                        <TextInput
                            onChangeText={value =>
                                handleOnChange('category', value)
                            }
                            value={form.category}
                            style={styles.input}
                            placeholder="Select a category..."
                            placeholderTextColor="#333"
                        />
                    </View>

                    <Button
                        onPress={() => setIndex(++index)}
                        title="Start New Challenge"
                        disabled={form.title.trim().length < 3}
                        small
                    />
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,.4)',
        borderRadius: 10,
        paddingVertical: 24,
        paddingHorizontal: 16
    },
    newChallenge: {
        marginTop: 24
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    divider: {
        width: '50%',
        height: 2,
        backgroundColor: colors.green,
        alignSelf: 'center',
        marginVertical: 16
    },
    inputsContainer: {
        marginTop: 8
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#5f5257',
        marginBottom: 6,
        textTransform: 'uppercase'
    },
    input: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '100%',
        marginBottom: 24,
        fontSize: 16,
        paddingBottom: 4
    }
});
