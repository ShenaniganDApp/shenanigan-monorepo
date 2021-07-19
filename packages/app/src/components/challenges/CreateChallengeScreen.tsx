import React, { ReactElement, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StartChallenge } from './StartChallenge';
import { ChallengeDescription } from './ChallengeDescription';
import { Outcomes } from './Outcomes';
import { Confirm } from './Confirm';
import { Button, colors, Gradient, Title } from '../UI';
import { Buttons } from './Buttons';

export type FormType = {
    address: string;
    title: string;
    // category: string;
    content: string;
    positiveOptions: string[];
    negativeOptions: string[];
    image: string;
};

export const CreateChallengeScreen = (props): ReactElement => {
    const [index, setIndex] = useState(0);
    const [nextButtonEnabled, setNextButtonEnabled] = useState(false);
    const [form, setForm] = useState<FormType>({
        address: '',
        title: '',
        // category: '',
        content: '',
        positiveOptions: [],
        negativeOptions: [],
        image: ''
    });
    const { top: paddingTop } = useSafeAreaInsets();

    const components = [
        <StartChallenge
            form={form}
            setForm={setForm}
            index={index}
            setIndex={setIndex}
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
        <Confirm index={index} setIndex={setIndex} />
    ];

    return (
        <Gradient>
            <View style={[styles.container, { paddingTop }]}>
                <Title style={styles.title}>
                    {form.title && index > 0 ? form.title : 'New Challenge'}
                </Title>
                <View style={styles.background}>{components[index]}</View>
            </View>
        </Gradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '4%'
    },
    title: {
        textAlign: 'center',
        marginBottom: '4%'
    },
    background: {
        flex: 1,
        padding: '4%',
        borderColor: 'rgba(251, 250, 250, 0.7)',
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    }
});
