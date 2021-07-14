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
import { Button, colors, Title } from '../UI';
import { FormType } from './CreateChallengeScreen';
import { PreviousChallenges } from './PreviousChallenges';

type Props = {
    index: number;
    setIndex: (n: number) => void;
    form: any;
    setForm: (fn: any) => void;
    setTitle: (s: string) => void;
};

export const StartChallenge = ({
    index,
    setIndex,
    form,
    setForm,
    setTitle
}: Props): ReactElement => {
    const handleOnChange = (type: string, value: string) => {
        setForm((prevState: FormType) => ({
            ...prevState,
            [type]: value
        }));
    };

    console.log('form: ', form);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
                    keyboardVerticalOffset={96}
                >
                    <Title size={24}>Challenge Title</Title>
                    <TextInput
                        onChangeText={(value) => handleOnChange('title', value)}
                        value={form.title}
                        style={styles.input}
                        placeholder="What do you call this challenge?"
                        placeholderTextColor={colors.gray}
                    />
                    <Title size={24}>Challenge Description</Title>
                    <TextInput
                        onChangeText={(value) =>
                            handleOnChange('content', value)
                        }
                        value={form.description}
                        style={[styles.input, styles.multiLineInput]}
                        placeholder="What exactly are you trying to do?
                        e.g. Grind a 15-foot rail."
                        placeholderTextColor={colors.gray}
                        multiline
                        numberOfLines={1}
                    />
                </KeyboardAvoidingView>

                <View style={styles.uploadContainer}>
                    <Title size={24}>Challenge Image</Title>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    input: {
        borderBottomColor: '#E6FFFF',
        borderBottomWidth: 1,
        width: '100%',
        marginBottom: '7%',
        marginTop: '2%',
        fontSize: 16,
        paddingBottom: 4,
        color: colors.grayDark
    },
    multiLineInput: {
        maxHeight: 120
    },
    uploadContainer: {}
});
