import React, { ReactElement, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RadioForm, {
    RadioButton,
    RadioButtonInput,
    RadioButtonLabel
} from 'react-native-simple-radio-button';

interface Options {
    text: string;
    positive: boolean;
}

interface Fields {
    title: string;
    description?: string;
    sport: string;
    options: Options[];
}

const ChallengeForm = (): ReactElement => {
    const [fields, setFields] = useState<Fields>({
        title: '',
        description: '',
        sport: '',
        options: []
    });

    const [radioPositive, setRadioPositive] = useState(true);
    const [option, setOption] = useState('');

    const handleOnChange = (name: string, value: string) => {
        setFields(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addOption = () => {
        const duplicate = fields.options.some(item => item.text === option);

        if (duplicate || option.trim().length <= 0) {
            setOption('');
            return;
        }

        setFields(prevState => ({
            ...prevState,
            options: [
                ...prevState.options,
                {
                    text: option,
                    positive: radioPositive
                }
            ]
        }));
    };

    const removeOption = (text: string) => {
        const filtered = fields.options.filter(item => item.text !== text);
        setFields(prevState => ({
            ...prevState,
            options: [...filtered]
        }));
    };

    const onSubmit = () => {
        const data = {
            title: fields.title.trim(),
            description: fields.description ? fields.description.trim() : '',
            sport: fields.sport.trim(),
            options: fields.options.trim()
        };
        if (isValidated(data)) {
            console.log('validated', data);
        } else {
            console.log('not validated');
        }
    };

    const isValidated = (data: Fields) => {
        if (
            !data.title.length ||
            !data.sport.length ||
            data.options.split('\n').length < 2
        ) {
            return false;
        }

        return true;
    };

    const radioProps = [
        { label: 'Positive', value: true },
        { label: 'Negative', value: false }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.halfContainer}>
                <View style={{ ...styles.inputContainer, ...styles.half }}>
                    <Text style={styles.label}>Sport</Text>
                    <TextInput
                        style={styles.field}
                        value={fields.sport}
                        onChangeText={text => handleOnChange('sport', text)}
                        keyboardType="default"
                    />
                </View>

                <View style={{ ...styles.inputContainer, ...styles.half }}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.field}
                        value={fields.title}
                        onChangeText={text => handleOnChange('title', text)}
                        keyboardType="default"
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.field}
                    value={fields.description}
                    onChangeText={text => handleOnChange('description', text)}
                    keyboardType="default"
                    textAlignVertical="top"
                />
            </View>

            <View
                style={{ ...styles.inputContainer, ...styles.optionsContainer }}
            >
                <Text style={styles.label}>Options</Text>
                <Text style={styles.secondary}>
                    Please add at least one unique option for each category.
                </Text>

                <RadioForm
                    radio_props={radioProps}
                    initial={radioPositive ? 0 : 1}
                    formHorizontal={true}
                    labelHorizontal={true}
                    buttonColor={'#2196f3'}
                    animation={true}
                    buttonSize={8}
                    buttonOuterSize={18}
                    labelStyle={{ marginRight: 30 }}
                    style={{ marginVertical: 12 }}
                    onPress={(value: boolean) => setRadioPositive(value)}
                />

                <View style={styles.optionInputContainer}>
                    <TextInput
                        style={styles.optionsInput}
                        keyboardType="default"
                        value={option}
                        onChangeText={text => setOption(text)}
                    />
                    <TouchableWithoutFeedback onPress={addOption}>
                        <View style={styles.addOptionContainer}>
                            <Text style={styles.addOption}>+</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <View style={styles.listsContainer}>
                    <View style={styles.listContainer}>
                        <Text style={styles.listLabel}>Positive</Text>
                        <FlatList
                            data={fields.options.filter(
                                option => option.positive
                            )}
                            renderItem={({ item }) => (
                                <View style={styles.listItem}>
                                    <Text>{item.text}</Text>
                                    <Text
                                        style={styles.removeItem}
                                        onPress={() => removeOption(item.text)}
                                    >
                                        -
                                    </Text>
                                </View>
                            )}
                            style={styles.list}
                        />
                    </View>
                    <View style={styles.listContainer}>
                        <Text style={styles.listLabel}>Negative</Text>
                        <FlatList
                            data={fields.options.filter(
                                option => !option.positive
                            )}
                            renderItem={({ item }) => (
                                <View style={styles.listItem}>
                                    <Text>{item.text}</Text>
                                    <Text
                                        style={styles.removeItem}
                                        onPress={() => removeOption(item.text)}
                                    >
                                        -
                                    </Text>
                                </View>
                            )}
                            style={styles.list}
                        />
                    </View>
                </View>
            </View>

            <Button onPress={onSubmit} title="Submit" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12
    },
    inputContainer: {
        marginBottom: 24
    },
    halfContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    half: {
        flexBasis: '49%'
    },
    label: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8
    },
    secondary: {
        color: '#3f3f3f',
        marginBottom: 8
    },
    field: {
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 12
    },
    optionsContainer: {},
    optionInputContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    optionsInput: {
        flexBasis: '90%',
        backgroundColor: 'white',
        padding: 12,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6
    },
    addOptionContainer: {
        flexBasis: '10%',
        backgroundColor: 'white',
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        padding: 12,
        borderLeftColor: '#ccc',
        borderLeftWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addOption: {},
    listsContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listContainer: {
        flexBasis: '49%'
    },
    listLabel: {
        fontSize: 14,
        fontWeight: '700',
        marginVertical: 12
    },
    list: {},
    listItem: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: 10,
        marginBottom: 6
    },
    removeItem: {
        backgroundColor: '#ddd',
        paddingVertical: 6,
        paddingHorizontal: 10
    }
});

export default ChallengeForm;
