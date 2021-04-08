import React, { ReactElement, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StartChallenge } from './StartChallenge';
import { ChallengeDescription } from './ChallengeDescription';
import { ImageUpload } from './ImageUpload';
import { Outcomes } from './Outcomes';
import { Confirm } from './Confirm';
import { colors } from '../UI';

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
    const [isDefaultImage, setIsDefaultImage] = useState(true);
    const [form, setForm] = useState<FormType>({
        address: props.route.params.me.addresses[0],
        title: '',
        // category: '',
        content: '',
        positiveOptions: [],
        negativeOptions: []
    });
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
            setSwiperIndex={props.route.params.setSwiperIndex}
        />
    ];

    const title =
        index === 0
            ? 'Choose'
            : index + 1 === components.length
            ? 'Confirm'
            : 'Challenge';

    return (
        <LinearGradient
            colors={[colors.pink, colors.yellow, colors.altWhite]}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <View>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => props.navigation.goBack()}
                    >
                        <Icon name="arrow-left" size={22} color="white" />
                        <Text style={styles.backText}>Profile</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{title}</Text>
                </View>

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
    backButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 6,
        zIndex: 100
    },
    backText: {
        color: 'white',
        marginLeft: 4
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
