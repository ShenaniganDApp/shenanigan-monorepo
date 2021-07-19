import React, { ReactElement, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StartChallenge } from './StartChallenge';
import { ChallengeDescription } from './ChallengeDescription';
import { Outcomes } from './Outcomes';
import { Confirm } from './Confirm';
import { Gradient, Title } from '../UI';

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
        <StartChallenge form={form} setForm={setForm} />,
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
            jumpTo={props.route.params.jumpTo}
        />
    ];

    return (
        <Gradient>
            <View style={[styles.container, { paddingTop }]}>
                <Title style={styles.title}>
                    {form.title && index > 0 ? form.title : 'New Challenge'}
                </Title>
                <View style={styles.background}>
                    {components[index]}
                    <View style={{ height: 60 }}>
                        {/* buttons placeholder */}
                    </View>
                </View>
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
