import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { colors, Card, Button } from '../UI';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { OutcomeVideo } from './OutcomeVideo';
import RadioForm, {
    RadioButton,
    RadioButtonInput,
    RadioButtonLabel
} from 'react-native-simple-radio-button';

interface Props {}

export const Outcome = (props: Props): ReactElement => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [voted, setVoted] = useState(false);

    const { color, title } = props.route.params;

    const radioOptions = [
        { label: 'option one', value: 'option 1', percent: 45 },
        { label: 'option two', value: 'option 2', percent: 55 }
    ];

    const handleSubmit = () => {
        if (selectedIndex !== null) {
            confirmationAlert();
        }
    };

    const confirmationAlert = () => {
        Alert.alert(
            `You chose ${radioOptions[selectedIndex].value}`,
            'Is this correct?',
            [
                {
                    text: 'No',
                    style: 'cancel'
                },
                { text: 'Yes', onPress: () => setVoted(true) }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.videoContainer}>
                <OutcomeVideo uri="https://www.w3schools.com/html/mov_bbb.mp4" />
            </View>

            <View style={styles.infoContainer}>
                <Card color={color} shadowColor={color} bgColor="white">
                    <View style={[styles.header, { borderColor: color }]}>
                        <Text style={[styles.title, { color: color }]}>
                            {title}
                        </Text>
                        <View>
                            <Text style={styles.time}>Time left to vote</Text>
                            <Text style={styles.clock}>1234</Text>
                        </View>
                    </View>
                </Card>
                <View style={styles.options}>
                    {!voted ? (
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
                    ) : (
                        <View>
                            <Text style={styles.voted}>
                                You have already voted
                            </Text>

                            {radioOptions.map(({ label, percent }, i) => (
                                <Poll
                                    percent={percent}
                                    title={label}
                                    usersChoice={selectedIndex === i}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

type PollProps = {
    percent: number;
    title: string;
    usersChoice?: boolean;
};

export const Poll = ({
    percent,
    title,
    usersChoice
}: PollProps): ReactElement => (
    <View style={styles.result}>
        <Text style={styles.percent}>{percent}%</Text>

        <View style={styles.poll}>
            <View style={styles.pollText}>
                <Text style={styles.optionTitle}>{title}</Text>
                <Icon
                    name="checkbox-marked-circle"
                    size={18}
                    color="black"
                    style={{ marginLeft: 10, opacity: usersChoice ? 0.5 : 0 }}
                />
            </View>
            <View style={[styles.pollResult, { width: `${percent}%` }]} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    videoContainer: {
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center'
    },
    infoContainer: {
        flex: 1,
        padding: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginRight: 16,
        flexShrink: 1
    },
    time: {
        textAlign: 'center',
        color: '#333',
        marginBottom: 4
    },
    clock: {
        textAlign: 'center',
        color: '#333',
        fontWeight: 'bold'
    },
    options: {
        marginTop: 32
    },
    voted: {
        textAlign: 'center',
        color: '#777'
    },
    optionTitle: {
        color: 'rgba(0,0,0,.7)',
        fontWeight: 'bold'
    },
    result: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    percent: {
        fontWeight: 'bold',
        marginRight: 4,
        width: 48
    },
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
    poll: {
        flex: 1,
        backgroundColor: '#f3f3f3',
        overflow: 'hidden',
        borderRadius: 6,
        paddingVertical: 10
    },
    pollResult: {
        backgroundColor: '#c7d9f1',
        width: '75%',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: -1
    },
    pollText: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    button: {
        marginTop: 24
    }
});
