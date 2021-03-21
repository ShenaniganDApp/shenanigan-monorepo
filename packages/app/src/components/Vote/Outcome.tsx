import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';

import { Card, Video } from '../UI';
import { Poll } from './Poll';
import { VoteForm } from './VoteForm';
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
                <Video
                    source={{
                        uri: 'https://www.w3schools.com/html/mov_bbb.mp4'
                    }}
                    style={{ alignSelf: 'center' }}
                    controls={true}
                />
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
                        <VoteForm
                            radioOptions={radioOptions}
                            selectedIndex={selectedIndex}
                            setSelectedIndex={setSelectedIndex}
                            handleSubmit={handleSubmit}
                        />
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
    }
});
