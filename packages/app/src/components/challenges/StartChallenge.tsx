import React, { ReactElement } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { colors, sizes, Title } from '../UI';
import { FormType } from './CreateChallengeScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
    form: FormType;
    setForm: (fn: any) => void;
};

export const StartChallenge = ({ form, setForm }: Props): ReactElement => {
    const handleOnChange = (type: string, value: string) => {
        setForm((prevState: FormType) => ({
            ...prevState,
            [type]: value
        }));
    };

    const imageHeight = sizes.windowH * 0.33;
    const imageWidth = (imageHeight * 9) / 16;

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
                    keyboardVerticalOffset={96}
                >
                    <Title size={24}>Challenge Title</Title>
                    <TextInput
                        onChangeText={(value) => handleOnChange('title', value)}
                        value={form.title}
                        style={styles.input}
                        placeholder="What do you call this challenge?"
                        placeholderTextColor={colors.gray}
                    />
                    <Title size={24}>Challenge Description</Title>
                    <TextInput
                        onChangeText={(value) =>
                            handleOnChange('content', value)
                        }
                        value={form.content}
                        style={[styles.input, styles.multiLineInput]}
                        placeholder="What exactly are you trying to do?
                        e.g. Grind a 15-foot rail."
                        placeholderTextColor={colors.gray}
                        multiline
                        numberOfLines={1}
                    />
                </KeyboardAvoidingView>

                <View style={styles.uploadContainer}>
                    <Title size={24}>Challenge Image</Title>
                    <TouchableOpacity
                        style={[
                            styles.card,
                            { height: imageHeight, width: imageWidth }
                        ]}
                        onPress={() => console.log('press')}
                    >
                        <CornerBorders />
                        <View style={styles.cardInner}>
                            <Icon
                                name="plus-thick"
                                size={72}
                                color={'rgba(124, 100, 132, 0.75)'}
                                style={styles.icon}
                            />
                            <Title size={24} style={styles.uploadTitle}>
                                Upload an Image
                            </Title>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    input: {
        borderBottomColor: '#E6FFFF',
        borderBottomWidth: 1,
        width: '100%',
        marginBottom: '7%',
        marginTop: '2%',
        fontSize: 16,
        paddingTop: 0,
        paddingBottom: 4,
        color: colors.grayDark,
        textAlignVertical: 'top'
    },
    multiLineInput: {
        maxHeight: sizes.smallScreen ? 80 : 100
    },
    uploadContainer: {},
    card: {
        alignSelf: 'center',
        marginTop: '4%',
        backgroundColor: colors.altWhite,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2%'
    },
    cardInner: {
        alignItems: 'center'
    },
    uploadTitle: {
        color: 'rgba(124, 100, 132, 0.75)',
        textAlign: 'center'
    },
    icon: {
        lineHeight: 62
    },
    corner: {
        borderTopColor: 'rgba(124, 100, 132, 0.75)',
        borderLeftColor: 'rgba(124, 100, 132, 0.75)',
        borderTopWidth: 2,
        borderLeftWidth: 2,
        height: 20,
        width: 20,
        borderTopLeftRadius: 10,
        position: 'absolute'
    }
});

const CornerBorders = () => (
    <>
        <View
            style={[
                styles.corner,
                {
                    top: 10,
                    left: 10
                }
            ]}
        />
        <View
            style={[
                styles.corner,
                {
                    top: 10,
                    right: 10,
                    transform: [
                        {
                            rotate: '90deg'
                        }
                    ]
                }
            ]}
        />
        <View
            style={[
                styles.corner,
                {
                    bottom: 10,
                    right: 10,
                    transform: [
                        {
                            rotate: '180deg'
                        }
                    ]
                }
            ]}
        />
        <View
            style={[
                styles.corner,
                {
                    bottom: 10,
                    left: 10,
                    transform: [
                        {
                            rotate: '270deg'
                        }
                    ]
                }
            ]}
        />
    </>
);
