import React, { ReactElement, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StartChallenge } from './StartChallenge';
import { ChallengeDescription } from './ChallengeDescription';
import { ImageUpload } from './ImageUpload';
import { Outcomes } from './Outcomes';
import { Confirm } from './Confirm';
import { colors, Gradient, Title } from '../UI';

export type FormType = {
    address: string;
    title: string;
    // category: string;
    content: string;
    positiveOptions: string[];
    negativeOptions: string[];
};

export const CreateChallengeScreen = (props): ReactElement => {
    const defaultImage =
        'https://images.unsplash.com/photo-1580238053495-b9720401fd45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80';
    const [index, setIndex] = useState(0);
    const [image, setImage] = useState(defaultImage);
    const [title, setTitle] = useState('New Challenge');
    const [isDefaultImage, setIsDefaultImage] = useState(true);
    const [form, setForm] = useState<FormType>({
        address: props.route.params.me.addresses[0],
        title: '',
        // category: '',
        content: '',
        positiveOptions: [],
        negativeOptions: []
    });
    const { top: paddingTop } = useSafeAreaInsets();

    const removeImage = () => {
        setImage(defaultImage);
        setIsDefaultImage(true);
    };

    const components = [
        <StartChallenge
            index={index}
            setIndex={setIndex}
            form={form}
            setForm={setForm}
            setTitle={setTitle}
        />,
        <ChallengeDescription
            index={index}
            setIndex={setIndex}
            form={form}
            setForm={setForm}
        />,
        <ImageUpload
            image={image}
            setImage={setImage}
            removeImage={removeImage}
            index={index}
            setIndex={setIndex}
            isDefaultImage={isDefaultImage}
            setIsDefaultImage={setIsDefaultImage}
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
                <Title style={styles.title}>{title}</Title>
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
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    }
});
