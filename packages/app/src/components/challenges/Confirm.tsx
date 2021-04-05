import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useMutation } from 'relay-hooks';
import { Button } from '../UI';
import {
    CreateChallenge,
    optimisticUpdater,
    updater
} from './mutations/CreateChallengeMutation';
import {
    CreateChallengeMutation,
    CreateChallengeMutationResponse
} from './mutations/__generated__/CreateChallengeMutation.graphql';
import { FormType } from './CreateChallengeScreen';

type Props = {
    index: number;
    setIndex: (n: number) => void;
    form: FormType;
    jumpTo: (s: string) => void;
};

export const Confirm = ({
    index,
    setIndex,
    form,
    me,
    jumpTo
}: Props): ReactElement => {
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
                console.log('challengeEdge: ', challengeEdge);
                setIndex(0);
                jumpTo('live');
            }
        };
        createChallenge(config);
    };

    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text>title: {form.title}</Text>
            <Text>category: {form.category}</Text>
            <Text>description: {form.content}</Text>
            {form.positiveOptions.map((option: string) => (
                <Text>positive: {option}</Text>
            ))}
            {form.negativeOptions.map((option: string) => (
                <Text>negative: {option}</Text>
            ))}
            <Button onPress={() => setIndex(--index)} title="Back" />
            <Button onPress={onSubmit} title="Confirm" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});
