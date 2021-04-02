import React, { ReactElement, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StartChallenge } from './StartChallenge';
import { ChallengeDescription } from './ChallengeDescription';
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
    const [index, setIndex] = useState(0);
    const [form, setForm] = useState<FormType>({
        address: props.route.params.me.addresses[0],
        title: '',
        // category: '',
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
            jumpTo={props.route.params.jumpTo}
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
