import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import RadioForm, {
    RadioButton,
    RadioButtonInput,
    RadioButtonLabel
} from 'react-native-simple-radio-button';
import { Button } from '../UI';

interface Props {
    radioOptions: object[];
    selectedIndex: number | null;
    setSelectedIndex: (value: number) => void;
    handleSubmit: () => void;
}

export const VoteForm = ({
    radioOptions,
    selectedIndex,
    setSelectedIndex,
    handleSubmit
}: Props): ReactElement => {
    return (
        <View>
            <RadioForm formHorizontal={false} animation={true}>
                {radioOptions.map((obj, i) => (
                    <RadioButton
                        labelHorizontal={true}
                        key={i}
                        style={styles.radioButton}
                    >
                        <RadioButtonInput
                            obj={obj}
                            index={i}
                            isSelected={selectedIndex === i}
                            onPress={() => setSelectedIndex(i)}
                            borderWidth={1}
                            buttonSize={16}
                            buttonOuterSize={24}
                            buttonStyle={styles.radioInput}
                            buttonWrapStyle={{ width: 52 }}
                            buttonColor="#6084b3"
                        />
                        <RadioButtonLabel
                            obj={obj}
                            index={i}
                            labelHorizontal={true}
                            onPress={() => setSelectedIndex(i)}
                            labelStyle={styles.radioLabel}
                            labelWrapStyle={[
                                styles.radioLabelWrap,
                                {
                                    borderColor:
                                        selectedIndex === i
                                            ? '#6084b3'
                                            : '#f3f3f3'
                                }
                            ]}
                        />
                    </RadioButton>
                ))}
            </RadioForm>
            <Button
                small
                title="Vote"
                color="black"
                bgColor="white"
                style={styles.button}
                onPress={handleSubmit}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    radio: {
        justifyContent: 'center',
        marginTop: 20
    },
    radioButton: {
        alignItems: 'center',
        marginTop: 16
    },
    radioInput: {
        marginRight: 8,
        width: 48
    },
    radioLabelWrap: {
        backgroundColor: '#f3f3f3',
        flex: 1,
        borderRadius: 6,
        overflow: 'hidden',
        paddingVertical: 9,
        paddingHorizontal: 3,
        borderWidth: 1
    },
    radioLabel: {
        backgroundColor: '#f3f3f3',
        fontWeight: 'bold',
        color: 'rgba(0,0,0,.7)'
    },

    button: {
        marginTop: 24
    }
});
