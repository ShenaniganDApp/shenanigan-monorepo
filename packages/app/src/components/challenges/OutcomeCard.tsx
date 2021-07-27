import React, { ReactElement, useRef, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Card, colors, Notch, sizes, Title } from '../UI';
import Gradient from 'react-native-linear-gradient';
import { FormType } from './CreateChallengeScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';

type Props = {
    type: 'positiveOptions' | 'negativeOptions';
    form: FormType;
    setForm: (form: FormType | ((prevState: FormType) => FormType)) => void;
};

export const OutcomeCard = ({ type, form, setForm }: Props): ReactElement => {
    const [textValue, setTextValue] = useState('');
    const [listHeight, setListHeight] = useState(0);
    const [warningText, setWarningText] = useState('');
    const [atListBottom, setAtListBottom] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);
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
            setForm((prevState) => ({
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
                    ref={scrollViewRef}
                    style={styles.outcomeContainer}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={200}
                    onScroll={({
                        nativeEvent: {
                            contentOffset,
                            layoutMeasurement,
                            contentSize
                        }
                    }) => {
                        const offset = contentOffset.y;
                        const containerHeight = layoutMeasurement.height;
                        const contentHeight = contentSize.height;

                        if (contentHeight - offset <= containerHeight) {
                            setAtListBottom(true);
                        } else {
                            setAtListBottom(false);
                        }
                    }}
                    contentContainerStyle={{
                        paddingTop: form[type].length > 0 ? '4%' : 0,
                        paddingBottom: form[type].length > 0 ? '2%' : 0,
                        paddingHorizontal: '4%'
                    }}
                    onContentSizeChange={(_, height) => {
                        if (height > listHeight || atListBottom) {
                            scrollViewRef.current?.scrollToEnd({
                                animated: true
                            });
                        }
                        setListHeight(height);
                    }}
                >
                    {form[type].map((option) => (
                        <View style={styles.outcome} key={option}>
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
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.inputContainer}>
                    <View style={styles.addIconContainer}>
                        <Gradient
                            colors={
                                positive
                                    ? [colors.pink, colors.pink]
                                    : [colors.gray, colors.grayDark]
                            }
                            style={[styles.addIconGradient]}
                        >
                            <TouchableOpacity onPress={() => addOption(type)}>
                                <Icon
                                    name="plus-thick"
                                    size={30}
                                    color="white"
                                    style={styles.addIcon}
                                />
                            </TouchableOpacity>
                        </Gradient>
                    </View>
                    <View style={styles.inputUnderline}>
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '4%',
        paddingVertical: '2%'
    },
    addIconContainer: {
        borderRadius: 100,
        zIndex: 9,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: 5,
        elevation: 5
    },
    addIconGradient: {
        padding: 2,
        borderRadius: 100
    },
    addIcon: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 5
    },
    inputUnderline: {
        borderBottomColor: colors.gray,
        borderBottomWidth: 1,
        flex: 1,
        marginLeft: -10
    },
    input: {
        fontSize: 16,
        paddingTop: 0,
        paddingBottom: 0,
        marginLeft: 20,
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
