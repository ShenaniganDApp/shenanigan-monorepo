import React, { ReactElement, useRef, useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
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
import { sizes, ImageCard, Title, Notch } from '../UI';
import { FormType } from './CreateChallengeScreen';
import { TabNavigationContext, SwiperContext } from '../../contexts';

type Props = {
    form: FormType;
    jumpTo: (s: string) => void;
};

/*
    jumpTo
    me
*/

export const Confirm = ({ form, me }: Props): ReactElement => {
    const { setMainIndex, setLiveTabsIndex, setLineupId } = useContext(
        TabNavigationContext
    );
    const { setSwiperIndex } = useContext(SwiperContext);
    const [createChallenge, { loading }] = useMutation<CreateChallengeMutation>(
        CreateChallenge
    );

    const imageHeight = sizes.windowH * 0.3;
    const imageWidth = (imageHeight * 9) / 16;

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
            <View style={styles.imageContainer}>
                <ImageCard
                    source={{ uri: form.image }}
                    height={imageHeight}
                    width={imageWidth}
                    style={[
                        styles.image,
                        { height: imageHeight, width: imageWidth }
                    ]}
                />
            </View>
            <Title size={24}>{form.title}</Title>
            <Text style={styles.description}>{form.content}</Text>
            <View style={styles.outcomeContainer}>
                {form.positiveOptions.map((outcome: string) => (
                    <Notch title={outcome} pink style={styles.outcome} />
                ))}

                {form.negativeOptions.map((outcome: string) => (
                    <Notch title={outcome} style={styles.outcome} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: '4%'
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: '4%'
    },
    title: {
        marginBottom: '4%'
    },
    description: {
        fontSize: 16,
        color: '#302449'
    },
    outcomeContainer: {
        alignItems: 'flex-start'
    },
    outcome: {
        marginTop: '4%'
    }
});
