import React, { ReactElement, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { StartChallenge } from './StartChallenge';
import { ChallengeDescription } from './ChallengeDescription';
import { Outcomes } from './Outcomes';
import { Confirm } from './Confirm';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../UI';
import { SafeAreaView } from 'react-native-safe-area-context';

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
