import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
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
    const [radioPositive, setRadioPositive] = useState<number | null>(null);
    const [voted, setVoted] = useState(false);

    const { color, title } = props.route.params;

    const radioProps = [
        { label: 'Positive', value: true },
        { label: 'Negative', value: false }
    ];

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
                                {/* To create radio buttons, loop through your array of options */}
                                {radioProps.map((obj, i) => (
                                    <RadioButton
                                        labelHorizontal={true}
                                        key={i}
                                        style={styles.radioButton}
                                    >
                                        {/*  You can set RadioButtonLabel before RadioButtonInput */}
                                        <RadioButtonInput
                                            obj={obj}
                                            index={i}
                                            isSelected={radioPositive === i}
                                            onPress={() => setRadioPositive(i)}
                                            borderWidth={1}
                                            buttonSize={16}
                                            buttonOuterSize={24}
                                            buttonStyle={styles.radioInput}
                                            buttonWrapStyle={{ width: 52 }}
                                        />
                                        <RadioButtonLabel
                                            obj={obj}
                                            index={i}
                                            labelHorizontal={true}
                                            onPress={() => setRadioPositive(i)}
                                            labelStyle={styles.radioLabel}
                                            labelWrapStyle={[
                                                styles.radioLabelWrap,
                                                {
                                                    borderColor:
                                                        radioPositive === i
                                                            ? 'lightblue'
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
                                onPress={() => setVoted(true)}
                            />
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.voted}>
                                You have already voted
                            </Text>

                            <Poll
                                title="Option 1"
                                color={colors.green}
                                percent={55}
                                usersChoice
                            />

                            <Poll
                                title="Option 2"
                                color={colors.pink}
                                percent={45}
                            />
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
    color: string;
    usersChoice?: boolean;
};

export const Poll = ({
    percent,
    title,
    color,
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
            <View
                style={[
                    styles.pollResult,
                    {
                        backgroundColor: color,
                        width: `${percent}%`
                    }
                ]}
            />
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
        backgroundColor: colors.green,
        width: '75%',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: -1,
        opacity: 0.1
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
