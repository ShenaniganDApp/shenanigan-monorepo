import React, { ReactElement } from 'react';
import { Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Title } from '../UI';
import { FormType } from './CreateChallengeScreen';
import { OutcomeCard } from './OutcomeCard';

type Props = {
    form: FormType;
    setForm: (form: FormType | ((prevState: FormType) => FormType)) => void;
};

export const Outcomes = ({ form, setForm }: Props): ReactElement => {
    return (
        <KeyboardAvoidingView
            behavior={'position'}
            keyboardVerticalOffset={120}
        >
            <Title style={styles.title}>Outcomes</Title>
            <Text style={styles.description}>
                Describe what success and failure look like on this challenge.
                You can add as many types of success and failure as you want,
                but you must have at least one of each.
            </Text>

            <OutcomeCard positive form={form} setForm={setForm} />

            <OutcomeCard form={form} setForm={setForm} />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    title: {
        marginBottom: '2%'
    },
    description: {
        color: '#302449',
        fontSize: 16,
        marginBottom: '3%'
    }
});
