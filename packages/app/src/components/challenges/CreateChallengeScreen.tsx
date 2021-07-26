import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StartChallenge } from './StartChallenge';
import { Outcomes } from './Outcomes';
import { Confirm } from './Confirm';
import { colors, Gradient, Title } from '../UI';
import { Buttons } from './Buttons';
import { TabNavSwipeContext } from '../../contexts';

export type FormType = {
    address: string;
    title: string;
    // category: string;
    content: string;
    positiveOptions: string[];
    negativeOptions: string[];
    image: string;
};

export const CreateChallengeScreen = (props): ReactElement => {
    const [index, setIndex] = useState(0);
    const [form, setForm] = useState<FormType>({
        address: 'd',
        title: 'd',
        // category: '',
        content: 'd',
        positiveOptions: ['d'],
        negativeOptions: ['df'],
        image: 'd'
    });
    const { top: paddingTop } = useSafeAreaInsets();
    const { setMainTabsSwipe } = useContext(TabNavSwipeContext);

    useEffect(() => setMainTabsSwipe(false));

    const handleBackButton = () => {
        setMainTabsSwipe(true);
        props.navigation.goBack();
    };

    const components = [
        <StartChallenge form={form} setForm={setForm} />,
        <Outcomes form={form} setForm={setForm} />,
        <Confirm index={index} setIndex={setIndex} />
    ];

    return (
        <Gradient>
            <View style={[styles.container, { paddingTop }]}>
                <View>
                    <Title style={styles.title}>
                        {form.title && index > 0 ? form.title : 'New Challenge'}
                    </Title>

                    {index === 0 && (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBackButton}
                        >
                            <Icon
                                name="chevron-left"
                                size={42}
                                color={colors.pink}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.background}>
                    {components[index]}
                    <Buttons index={index} setIndex={setIndex} form={form} />
                </View>
            </View>
        </Gradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '4%'
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 9
    },
    icon: {
        textShadowColor: 'rgba(0,0,0,.3)',
        textShadowOffset: {
            width: 0,
            height: 3
        },
        textShadowRadius: 5
    },
    title: {
        textAlign: 'center',
        marginBottom: '4%'
    },
    background: {
        flex: 1,
        justifyContent: 'space-between',
        padding: '4%',
        borderColor: 'rgba(251, 250, 250, 0.7)',
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    }
});
