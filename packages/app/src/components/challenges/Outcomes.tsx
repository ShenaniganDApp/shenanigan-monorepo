import React, { ReactElement, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Button, colors } from '../UI';
import { FormType } from './CreateChallengeScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    index: number;
    setIndex: (n: number) => void;
    form: any;
    setForm: (fn: any) => void;
    type: 'positive' | 'negative';
};

export const Outcomes = ({
    index,
    setIndex,
    form,
    setForm,
    type
}: Props): ReactElement => {
    const [value, setValue] = useState('');
    const [duplicateWarn, setDuplicateWarn] = useState(false);
    const formType =
        type === 'positive' ? 'positiveOptions' : 'negativeOptions';

    const handlePress = (direction?: string) => {
        setValue('');
        setDuplicateWarn(false);

        if (direction === 'next') {
            setIndex(++index);
        } else {
            setIndex(--index);
        }
    };

    const addOption = () => {
        const duplicate =
            form.positiveOptions.some(
                (option: string) =>
                    option.toLowerCase() === value.toLowerCase().trim()
            ) ||
            form.negativeOptions.some(
                (option: string) =>
                    option.toLowerCase() === value.toLowerCase().trim()
            );

        if (!duplicate) {
            setForm((prevState: FormType) => ({
                ...prevState,
                [formType]: [...prevState[formType], value.trim()]
            }));
            setValue('');
            setDuplicateWarn(false);
        } else {
            setDuplicateWarn(true);
        }
    };

    const removeOption = (option: string) => {
        setForm((prevState: FormType) => ({
            ...prevState,
            [formType]: prevState[formType].filter((item) => item !== option)
        }));
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.description}>
                    This will be a description about outcomes
                </Text>

                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{type} Outcomes</Text>
                    <View style={styles.card}>
                        {form[formType].map((option: string) => (
                            <View style={styles.outcome} key={option}>
                                <Icon
                                    name="circle"
                                    size={32}
                                    color={
                                        type === 'positive'
                                            ? colors.green
                                            : colors.pink
                                    }
                                />
                                <Text style={styles.outcomeText}>{option}</Text>

                                <TouchableOpacity
                                    style={styles.removeOutcome}
                                    onPress={() => removeOption(option)}
                                >
                                    <Icon name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        <View style={styles.inputContainer}>
                            <TouchableOpacity
                                style={styles.addOutcome}
                                onPress={addOption}
                                disabled={value.trim().length < 3}
                            >
                                <Icon
                                    name="plus"
                                    size={32}
                                    color="black"
                                    style={{
                                        opacity:
                                            value.trim().length < 3 ? 0.4 : 1
                                    }}
                                />
                            </TouchableOpacity>

                            <TextInput
                                onChangeText={setValue}
                                value={value}
                                style={styles.input}
                                placeholder={`Add ${type} outcome`}
                                placeholderTextColor="#333"
                            />
                        </View>

                        <Text
                            style={[
                                styles.warn,
                                { opacity: duplicateWarn ? 1 : 0 }
                            ]}
                        >
                            Options must be unique.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button onPress={() => handlePress()} title="Back" small />
                <Button
                    onPress={() => handlePress('next')}
                    title="Next"
                    disabled={form[formType].length < 1}
                    small
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    infoContainer: {
        marginTop: 36
    },
    description: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40
    },
    title: {
        fontSize: 24,
        marginBottom: 40,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    card: {
        backgroundColor: 'rgba(255,255,255,.5)',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 24
    },
    outcome: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'center'
    },
    outcomeText: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 16
    },
    removeOutcome: {},
    inputContainer: {
        flexDirection: 'row',
        marginTop: 16
    },
    input: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        flex: 1,
        fontSize: 16,
        paddingBottom: 4
    },
    addOutcome: {
        marginRight: 16
    },
    warn: {
        textAlign: 'center',
        marginTop: 12,
        color: '#333'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
