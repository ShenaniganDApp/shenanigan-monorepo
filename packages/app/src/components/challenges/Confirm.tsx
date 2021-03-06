import React, { ReactElement, useRef, useContext } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { useMutation } from 'relay-hooks';
import CardFlip from 'react-native-card-flip';
import {
    CreateChallenge,
    optimisticUpdater,
    updater
} from './mutations/CreateChallengeMutation';
import {
    CreateChallengeMutation,
    CreateChallengeMutationResponse
} from './mutations/__generated__/CreateChallengeMutation.graphql';
import { Button, colors } from '../UI';
import { FormType } from './CreateChallengeScreen';
import { TabNavigationContext, SwiperContext } from '../../contexts';

type Props = {
    index: number;
    setIndex: (n: number) => void;
    form: FormType;
    jumpTo: (s: string) => void;
};

export const Confirm = ({ index, setIndex, form, me }: Props): ReactElement => {
    const { setMainIndex, setLiveTabsIndex, setLineupId } = useContext(
        TabNavigationContext
    );
    const { setSwiperIndex } = useContext(SwiperContext);
    const [createChallenge, { loading }] = useMutation<CreateChallengeMutation>(
        CreateChallenge
    );
    const cardRef = useRef(null);

    const onSubmit = () => {
        const onError = () => {
            console.log('onErrorCreateChallenge');
        };

        const config = {
            variables: { input: form },
            updater: updater(me.id),
            optimisticUpdater: optimisticUpdater(form, me),
            onCompleted: ({
                CreateChallenge: { challengeEdge, error }
            }: CreateChallengeMutationResponse) => {
                setLineupId(challengeEdge.node.id);
            }
        };
        createChallenge(config);
        setMainIndex(1);
        setLiveTabsIndex(2);
        setSwiperIndex(2);
    };

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <CardFlip style={styles.cardContainer} ref={cardRef}>
                    <View style={styles.card}>
                        <View style={styles.image} />
                        <ScrollView
                            style={styles.cardFrontText}
                            contentContainerStyle={{
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={styles.address}>{form.address}</Text>
                            <Text style={styles.title}>{form.title}</Text>
                            {/* <Text style={styles.category}>{form.category}</Text> */}
                            <Text style={styles.description}>
                                {form.content}
                            </Text>
                        </ScrollView>
                        <TouchableOpacity
                            onPress={() => cardRef.current.flip()}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>View Outcomes</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.card}>
                        <ScrollView>
                            <View style={styles.outcomeTitleContainer}>
                                <Text style={styles.outcomeTitle}>
                                    Positive
                                </Text>
                            </View>

                            {form.positiveOptions.map((option: string) => (
                                <View
                                    style={[
                                        styles.outcome,
                                        { backgroundColor: '#A4D9B6' }
                                    ]}
                                >
                                    <Text
                                        key={option}
                                        style={styles.outcomeText}
                                    >
                                        {option}
                                    </Text>
                                </View>
                            ))}
                            <View
                                style={[
                                    styles.outcomeTitleContainer,
                                    styles.negativeTitle
                                ]}
                            >
                                <Text style={styles.outcomeTitle}>
                                    Negative
                                </Text>
                            </View>

                            {form.negativeOptions.map((option: string) => (
                                <View
                                    style={[
                                        styles.outcome,
                                        { backgroundColor: '#F2D7E2' }
                                    ]}
                                >
                                    <Text
                                        key={option}
                                        style={styles.outcomeText}
                                    >
                                        {option}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            onPress={() => cardRef.current.flip()}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>
                                View Stream Info
                            </Text>
                        </TouchableOpacity>
                    </View>
                </CardFlip>
            </View>
            <View style={styles.buttonContainer}>
                <Button onPress={() => setIndex(--index)} title="Back" small />

                <Button
                    onPress={onSubmit}
                    title="Confirm"
                    small
                    color={colors.green}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    cardContainer: {
        marginTop: 56
    },
    card: {
        backgroundColor: 'rgba(255,255,255,.5)',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 24,
        marginTop: 36,
        height: 420
    },
    button: {
        marginTop: 12,
        paddingVertical: 8,
        backgroundColor: colors.yellow,
        borderWidth: 2,
        borderColor: '#555',
        paddingHorizontal: 12,
        borderRadius: 10,
        shadowColor: '#000',
        alignSelf: 'center',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3
    },
    buttonText: {
        color: '#555',
        fontWeight: 'bold'
    },
    cardFrontText: {
        flex: 1
    },
    image: {
        height: 180,
        width: 110,
        backgroundColor: '#333',
        borderRadius: 10,
        transform: [{ translateY: -75 }],
        marginBottom: -60,
        alignSelf: 'center'
    },
    address: {
        color: '#333'
    },
    title: {
        fontSize: 24,
        marginVertical: 16,
        fontWeight: 'bold'
    },
    category: {
        fontWeight: 'bold'
    },
    description: {
        marginTop: 16,
        color: '#333'
    },
    outcomeTitleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 16
    },
    outcomeTitle: {
        fontWeight: 'bold',
        fontSize: 24,
        paddingBottom: 9
    },
    negativeTitle: {
        marginTop: 16
    },
    outcome: {
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        width: '93%',
        alignSelf: 'center'
    },
    outcomeText: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
