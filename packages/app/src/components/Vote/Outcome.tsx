import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../UI';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {}

export const Outcome = (props: Props): ReactElement => {
    return (
        <View style={styles.container}>
            <View style={styles.videoContainer}>
                <Text>top</Text>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoInner}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Outcome Title</Text>
                        <View>
                            <Text style={styles.time}>Time left to vote</Text>
                            <Text style={styles.time}>1234</Text>
                        </View>
                    </View>

                    <View style={styles.pollContainer}>
                        <Text style={styles.voted}>You have already voted</Text>

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
                        opacity: 0.1,
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
        flex: 1
    },
    infoContainer: {
        flex: 1,
        borderTopColor: colors.pink,
        borderTopWidth: 3
    },
    infoInner: {
        padding: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 16,
        flexShrink: 1
    },
    time: {
        textAlign: 'center',
        color: '#333'
    },
    voted: {
        textAlign: 'center',
        color: '#777'
    },
    optionTitle: {
        // color: 'white',
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
        marginRight: 8
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
        zIndex: -1
    },
    pollText: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16
    }
});
