import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { sizes, ImageCard, Title, Notch } from '../UI';
import { FormType } from './CreateChallengeScreen';

type Props = {
    form: FormType;
};

export const Confirm = ({ form }: Props): ReactElement => {
    const imageHeight = sizes.windowH * 0.3;
    const imageWidth = (imageHeight * 9) / 16;

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageCard
                    source={{ uri: form.image }}
                    height={imageHeight}
                    width={imageWidth}
                    style={{ height: imageHeight, width: imageWidth }}
                />
            </View>
            <Title size={24}>{form.title}</Title>
            <Text style={styles.description}>{form.content}</Text>
            <View style={styles.outcomeContainer}>
                {form.positiveOptions.map((outcome: string) => (
                    <Notch
                        title={outcome}
                        pink
                        style={styles.outcome}
                        key={outcome}
                    />
                ))}

                {form.negativeOptions.map((outcome: string) => (
                    <Notch
                        title={outcome}
                        style={styles.outcome}
                        key={outcome}
                    />
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
