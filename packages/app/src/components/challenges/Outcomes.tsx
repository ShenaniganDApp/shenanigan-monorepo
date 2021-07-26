import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Title } from '../UI';
import { FormType } from './CreateChallengeScreen';
import { OutcomeCard } from './OutcomeCard';

type Props = {
    form: FormType;
    setForm: (fn: (f: FormType) => void) => void;
};

/*
 * keyboard avoiding view
 * remove form placeholders
 */

export const Outcomes = ({ form, setForm }: Props): ReactElement => {
    return (
        <View>
            <Title style={styles.title}>Outcomes</Title>
            <Text style={styles.description}>
                Describe what success and failure look like on this challenge.
                You can add as many types of success and failure as you want,
                but you must have at least one of each.
            </Text>

            <OutcomeCard
                type={'positiveOptions'}
                form={form}
                setForm={setForm}
            />

            <OutcomeCard
                type={'negativeOptions'}
                form={form}
                setForm={setForm}
            />
        </View>
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
