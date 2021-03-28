import React, { ReactElement, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { StartChallenge } from './StartChallenge';
import { ChallengeDescription } from './ChallengeDescription';
import { Outcomes } from './Outcomes';
import { Confirm } from './Confirm';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../UI';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <Confirm
            index={index}
            setIndex={setIndex}
            form={{
                address: props.route.params.me.addresses[0],
                title: 'This is my Title',
                category: 'Sports',
                content:
                    'This is a description. It talks about all the things I want to do with my life. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti consequatur id ratione?',
                positiveOptions: [
                    'move to cabin in the wilderness',
                    'grow my own vegetables'
                ],
                negativeOptions: [
                    'get rabies from a bat in the nearby cave',
                    'die from the plant like Into the Wild'
                ]
            }}
        />,
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

    const title =
        index === 0
            ? 'Choose'
            : index + 1 === components.length
            ? 'Confirm Stream'
            : 'Challenge';

    return (
        <LinearGradient
            colors={[colors.pink, colors.yellow, colors.altWhite]}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                {components[index]}
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        marginBottom: 24,
        textShadowColor: 'rgba(255, 255, 255, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 6
    }
});
