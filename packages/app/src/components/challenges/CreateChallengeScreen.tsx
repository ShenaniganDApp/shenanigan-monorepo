import React, { ReactElement, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StartChallenge } from './StartChallenge';
import { ChallengeDescription } from './ChallengeDescription';
import { Outcomes } from './Outcomes';
import { Confirm } from './Confirm';
import { graphql, useFragment } from 'relay-hooks';

interface Props {}
export type FormType = {
    address: string;
    title: string;
    category: string;
    content: string;
    positiveOptions: string[];
    negativeOptions: string[];
};

export const CreateChallengeScreen = (props: Props): ReactElement => {
    const [index, setIndex] = useState(0);
    const [form, setForm] = useState<FormType>({
        address: '',
        title: '',
        category: '',
        content: '',
        positiveOptions: [],
        negativeOptions: []
    });
    console.log('params:', props.route.params);

    // const me = useFragment<CreateChallengeScreen_me$key>(
    //     graphql`
    //         # component name in fragment
    //         fragment CreateChallengeScreen_me on User {
    //             id
    //             addresses
    //         }
    //     `,
    //     props.me // add props
    // );

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
        <Confirm index={index} setIndex={setIndex} form={form} />
    ];
    return <View style={styles.container}>{components[index]}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
