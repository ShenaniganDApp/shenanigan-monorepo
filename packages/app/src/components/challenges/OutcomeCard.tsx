import React, { ReactElement, useRef, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Card, colors, Notch, sizes, Title } from '../UI';
import { FormType } from './CreateChallengeScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';

type Props = {};

export const OutcomeCard = ({ type, form, setForm }: any): ReactElement => {
    const [textValue, setTextValue] = useState('');
    const [listHeight, setListHeight] = useState(0);
    const [warningText, setWarningText] = useState('');
    const scrollViewRef = useRef(null);
    const positive = type === 'positiveOptions';

    const addOption = (type: string) => {
        const duplicate =
            form.positiveOptions.some(
                (option: string) =>
                    option.toLowerCase() === textValue.toLowerCase().trim()
            ) ||
            form.negativeOptions.some(
                (option: string) =>
                    option.toLowerCase() === textValue.toLowerCase().trim()
            );

        if (!duplicate && textValue.length > 2) {
            setForm((prevState: FormType) => ({
                ...prevState,
                [type]: [...prevState[type], textValue]
            }));

            setWarningText('');
            setTextValue('');
        } else if (!duplicate && textValue.length <= 2) {
            setWarningText('Enter at least 3 characters');
        } else {
            setWarningText('All outcomes must be unique');
        }
    };

    const removeOption = (type: string, option: string) => {
        setForm((prevState: FormType) => ({
            ...prevState,
            [type]: prevState[type].filter((item: string) => item !== option)
        }));
    };

    return (
        <>
            <Title style={styles.title}>
                Add {positive ? 'positive' : 'negative'} outcomes
            </Title>
            <Card style={styles.card} noPadding>
                <ScrollView
                    style={styles.outcomeContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingTop: form[type].length > 0 ? '4%' : 0,
                        paddingBottom: form[type].length > 0 ? '2%' : 0,
                        paddingHorizontal: '4%'
                    }}
                    onContentSizeChange={(_, height) => {
                        if (height > listHeight) {
                            scrollViewRef.current.scrollToEnd({
                                animated: true
                            });
                        }
                        setListHeight(height);
                    }}
                    ref={scrollViewRef}
                >
                    {form[type].map((option) => (
                        <View style={styles.outcome}>
                            <View style={styles.notchContainer}>
                                <Notch
                                    title={option}
                                    pink={positive}
                                    style={{
                                        paddingHorizontal: 6
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => removeOption(type, option)}
                            >
                                <Icon
                                    name="close-thick"
                                    size={22}
                                    color={colors.pink}
                                    style={styles.editIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.inputContainer}>
                    <TouchableOpacity
                        style={[
                            styles.addIconBg,
                            {
                                backgroundColor: positive
                                    ? colors.pink
                                    : colors.gray
                            }
                        ]}
                        onPress={() => addOption(type)}
                    >
                        <Icon
                            name="plus-thick"
                            size={28}
                            color="white"
                            style={styles.addIcon}
                        />
                    </TouchableOpacity>
                    <TextInput
                        onChangeText={setTextValue}
                        value={textValue}
                        style={styles.input}
                        placeholder={
                            positive
                                ? 'e.g. I beat my best record'
                                : 'e.g. I don’t finish in time'
                        }
                        placeholderTextColor={colors.gray}
                    />
                </View>
            </Card>

            <View
                style={[
                    styles.warning,
                    { opacity: warningText.length > 0 ? 1 : 0 }
                ]}
            >
                <Icon name="alert-circle-outline" size={20} color="#555" />
                <Text style={styles.warningText}>{warningText}</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        marginBottom: '2%'
    },
    card: {
        marginBottom: '2%'
    },
    outcomeContainer: {
        maxHeight: sizes.windowH * 0.15
    },
    outcome: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '3%'
    },
    notchContainer: {
        flexShrink: 1
    },
    editIcon: {},
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '4%',
        paddingVertical: '2%'
    },
    addIconBg: {
        backgroundColor: colors.pink,
        padding: 2,
        borderRadius: 100,
        marginRight: '4%'
    },
    addIcon: {},
    input: {
        flex: 1,
        borderBottomColor: colors.gray,
        borderBottomWidth: 1,
        fontSize: 16,
        paddingTop: 0,
        paddingBottom: 2,
        color: colors.grayDark
    },
    warning: {
        marginBottom: '3%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    warningText: {
        color: '#555',
        fontSize: 16,
        marginLeft: 4
    }
});
