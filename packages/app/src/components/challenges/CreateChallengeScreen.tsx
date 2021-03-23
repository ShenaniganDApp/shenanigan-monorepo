import React, { ReactElement, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StartChallenge } from './StartChallenge';
import { ChallengeDescription } from './ChallengeDescription';
import { PositiveOutcomes } from './PositiveOutcomes';
import { NegativeOutcomes } from './NegativeOutcomes';
import { Confirm } from './Confirm';

interface Props {}
export type FormType = {
    title: string;
    category: string;
    description: string;
    positive: string[];
    negative: string[];
};

export const CreateChallenge = (props: Props): ReactElement => {
    const [index, setIndex] = useState(0);
    const [form, setForm] = useState<FormType>({
        title: '',
        category: '',
        description: '',
        positive: [],
        negative: []
    });

    const comps = [
        <StartChallenge
            index={index}
            setIndex={setIndex}
            form={form}
            setForm={setForm}
        />,
        <ChallengeDescription
            index={index}
            setIndex={setIndex}
            form={form}
            setForm={setForm}
        />,
        <PositiveOutcomes
            index={index}
            setIndex={setIndex}
            form={form}
            setForm={setForm}
        />,
        <NegativeOutcomes
            index={index}
            setIndex={setIndex}
            form={form}
            setForm={setForm}
        />,
        <Confirm index={index} setIndex={setIndex} form={form} />
    ];
    return <View style={styles.container}>{comps[index]}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
