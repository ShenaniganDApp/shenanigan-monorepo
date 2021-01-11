import React, { ReactElement, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    SafeAreaView
} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';

interface Option {
    text: string;
    type: 'positive' | 'negative';
}

interface Fields {
    title: string;
    description?: string;
    sport: string;
    options: Option[];
}

interface Fields {
    title: string;
    description?: string;
    sport: string;
    options: Option[];
}

const ChallengeForm = (): ReactElement => {
    const [fields, setFields] = useState<Fields>({
        title: '',
        description: '',
        sport: '',
        options: []
    });

    const [radioPositive, setRadioPositive] = useState(true);
    const [optionText, setOptionText] = useState('');

    const handleOnChange = (name: string, value: string) => {
        setFields(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addOption = () => {
        const duplicate = fields.options.some(item => item.text === optionText);

        if (duplicate || optionText.trim().length <= 0) {
            Alert.alert('Duplicate Entry', 'All options must be unique', [
                { text: 'Okay' }
            ]);
            setOptionText('');
            return;
        }

        setFields(prevState => ({
            ...prevState,
            options: [
                ...prevState.options,
                {
                    text: optionText,
                    type: radioPositive ? 'positive' : 'negative'
                }
            ]
        }));
        setOptionText('');
    };

    const removeOption = (text: string) => {
        const filteredOptions = fields.options.filter(
            item => item.text !== text
        );
        setFields(prevState => ({
            ...prevState,
            options: filteredOptions
        }));
    };

    const onSubmit = () => {
        const data = {
            title: fields.title.trim(),
            description: fields.description ? fields.description.trim() : '',
            sport: fields.sport.trim(),
            options: fields.options
        };
        if (isValidated(data)) {
            console.log('validated');
        } else {
            console.log('not validated');
        }
    };

    const isValidated = (data: Fields) => {
        const pos = (element: Option) => element.type === 'positive';
        const neg = (element: Option) => element.type === 'negative';
        const validOptions = data.options.some(pos) && data.options.some(neg);

        if (!data.title.length || !data.sport.length || !validOptions) {
            Alert.alert(
                'Invalid Entry',
                'Please fill out all required fields.',
                [{ text: 'Okay' }]
            );
            return false;
        }

        return true;
    };

    const radioProps = [
        { label: 'Positive', value: true },
        { label: 'Negative', value: false }
    ];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={styles.halfContainer}>
                    <TextField
                        label="sport"
                        handleTextChange={handleOnChange}
                        field={fields.sport}
                        required
                        half
                    />

                    <TextField
                        label="title"
                        handleTextChange={handleOnChange}
                        field={fields.title}
                        required
                        half
                    />
                </View>

                <TextField
                    label="description"
                    handleTextChange={handleOnChange}
                    field={fields.description}
                    half={false}
                    required={false}
                    multiline
                />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>OPTIONS *</Text>
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

                    <View style={styles.withButton}>
                        <TextInput
                            style={styles.withButtonText}
                            keyboardType="default"
                            value={optionText}
                            onChangeText={text => setOptionText(text)}
                        />
                        <TouchableOpacity onPress={addOption}>
                            <Text style={styles.withButtonBtn}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.listsContainer}>
                        <ListContainer
                            listType="positive"
                            data={fields.options.filter(
                                option => option.type === 'positive'
                            )}
                            onPress={removeOption}
                        />

                        <ListContainer
                            listType="negative"
                            data={fields.options.filter(
                                option => option.type === 'negative'
                            )}
                            onPress={removeOption}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={onSubmit}
                    style={styles.submitButton}
                >
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

interface TextFieldProps {
    label: string;
    handleTextChange: (label: string, text: string) => void;
    field: string;
    half?: boolean;
    required?: boolean;
    multiline?: boolean;
}

const TextField = ({
    label,
    handleTextChange,
    field,
    half,
    required,
    multiline,
}: TextFieldProps) => (
    <View
        style={{
            ...styles.inputContainer,
            flexBasis: half ? '49%' : 'auto'
        }}
    >
        <Text style={styles.label}>
            {label.toUpperCase()}
            {required && ' *'}
        </Text>
        <TextInput
            style={{
                ...styles.field,
                height: multiline ? 90 : 'auto'
            }}
            value={field}
            onChangeText={text => handleTextChange(label, text)}
            keyboardType="default"
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
        />
    </View>
);

interface ListContainerProps {
    listType: 'positive' | 'negative';
    data: Option[];
    onPress: (item: string) => void;
}

const ListContainer = ({ listType, data, onPress }: ListContainerProps) => (
    <View>
        {data.length > 0 && (
            <Text style={styles.listLabel}>{listType.toUpperCase()}</Text>
        )}

        {data.map((option: Option) => (
            <View
                style={{
                    ...styles.withButton,
                    marginBottom: 20,
                    backgroundColor:
                        listType === 'positive' ? '#ade0ad' : '#e09488'
                }}
                key={option.text}
            >
                <Text style={styles.withButtonText}>{option.text}</Text>
                <TouchableOpacity onPress={() => onPress(option.text)}>
                    <Text
                        style={{
                            ...styles.withButtonBtn,
                            backgroundColor:
                                listType === 'positive' ? '#77b177' : '#da6767'
                        }}
                    >
                        -
                    </Text>
                </TouchableOpacity>
            </View>
        ))}
    </View>
);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 20,
        flex: 1
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
    label: {
        fontSize: 16,
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
        padding: 12,
        // fixes padding for multiline input
        paddingTop: 12
    },
    withButton: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 6,
        overflow: 'hidden'
    },
    withButtonBtn: {
        fontWeight: 'bold',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#ddd'
    },
    withButtonText: {
        flexGrow: 1,
        paddingLeft: 12
    },
    listsContainer: {
        marginTop: 20
    },
    listLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginVertical: 12
    },
    listItem: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: 10,
        marginBottom: 10,
        borderRadius: 6,
        overflow: 'hidden'
    },
    submitButton: {
        backgroundColor: '#777',
        alignItems: 'center',
        padding: 12,
        borderRadius: 6,
        marginBottom: 90
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    }
});

export default ChallengeForm;
