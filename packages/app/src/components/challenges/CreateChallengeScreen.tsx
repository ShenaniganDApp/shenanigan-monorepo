import React, { ReactElement, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StartChallenge } from './StartChallenge';
import { ChallengeDescription } from './ChallengeDescription';
import { Outcomes } from './Outcomes';
import { Confirm } from './Confirm';

export type FormType = {
    address: string;
    title: string;
    category: string;
    content: string;
    positiveOptions: string[];
    negativeOptions: string[];
};

export const CreateChallengeScreen = (props): ReactElement => {
    const [index, setIndex] = useState(0);
    const [form, setForm] = useState<FormType>({
        address: props.route.params.me.addresses[0],
        title: '',
        category: '',
        content: '',
        positiveOptions: [],
        negativeOptions: []
    });

    const components = [
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
        <Outcomes
            index={index}
            setIndex={setIndex}
            form={form}
            setForm={setForm}
            type={'positive'}
        />,
        <Outcomes
            index={index}
            setIndex={setIndex}
            form={form}
            setForm={setForm}
            type={'negative'}
        />,
        <Confirm
            index={index}
            setIndex={setIndex}
            form={form}
            me={props.route.params.me}
        />
    ];
    return <View style={styles.container}>{components[index]}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
