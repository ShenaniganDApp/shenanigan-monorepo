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
import { ImageUpload } from './ImageUpload';

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

                <View>
                    <Title size={24}>Challenge Image</Title>
                    <ImageUpload form={form} setForm={setForm} />
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
    }
});
