import React, { ReactElement, useEffect, useState, useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, colors } from '../UI';
import { FormType } from './CreateChallengeScreen';
import { TabNavigationContext, SwiperContext } from '../../contexts';
import { useMutation } from 'relay-hooks';
import {
    CreateChallenge,
    optimisticUpdater,
    updater
} from './mutations/CreateChallengeMutation';
import {
    CreateChallengeMutation,
    CreateChallengeMutationResponse
} from './mutations/__generated__/CreateChallengeMutation.graphql';
import { Profile_me$key } from '../profile/__generated__/Profile_me.graphql';

type Props = {
    index: number;
    setIndex: (n: number) => void;
    form: FormType;
    returnToProfile: () => void;
    me: Profile_me$key;
};

// @TODO handle error when form is submitted while there is already an active challenge

export const Buttons = ({
    index,
    setIndex,
    form,
    me,
    returnToProfile
}: Props): ReactElement => {
    const [nextDisabled, setNextDisabled] = useState(true);

    useEffect(() => {
        if (index === 0) {
            if (!!form.title && !!form.content && !!form.image) {
                return setNextDisabled(false);
            }
        }

        if (index === 1) {
            if (
                form.positiveOptions.length > 0 &&
                form.positiveOptions.length > 0
            ) {
                return setNextDisabled(false);
            }
        }

        setNextDisabled(true);
    }, [form, index]);

    const { setMainIndex, setLiveTabsIndex, setLineupId } = useContext(
        TabNavigationContext
    );
    const { setSwiperIndex } = useContext(SwiperContext);
    const [createChallenge, { loading }] = useMutation<CreateChallengeMutation>(
        CreateChallenge
    );

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
        returnToProfile();
        setMainIndex(1);
        setLiveTabsIndex(2);
        setSwiperIndex(2);
    };

    return (
        <View style={styles.buttonContainer}>
            {index > 0 ? (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIndex(index - 1)}
                >
                    <Icon
                        name="chevron-left"
                        size={56}
                        color={colors.pink}
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            ) : (
                <Text></Text>
            )}

            {index !== 2 ? (
                <TouchableOpacity
                    disabled={nextDisabled}
                    style={styles.button}
                    onPress={() => setIndex(index + 1)}
                >
                    <Icon
                        name="chevron-right"
                        size={56}
                        color={nextDisabled ? colors.gray : colors.pink}
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            ) : (
                <Button
                    title="Create"
                    style={styles.confirm}
                    onPress={onSubmit}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        alignItems: 'center'
    },
    icon: {
        marginBottom: -10
    },
    buttonText: {
        color: colors.grayMedium
    },
    confirm: {
        marginRight: '4%'
    }
});
