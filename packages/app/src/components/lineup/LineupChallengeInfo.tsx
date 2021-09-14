import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { graphql, useFragment } from 'react-relay';
import { BlurView } from '@react-native-community/blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    backgroundStyles,
    Button,
    Card,
    colors,
    ImageCard,
    Notch,
    sizes,
    Title,
    XdaiBanner
} from '../UI';
import { ScrollView } from 'react-native-gesture-handler';
import { LineupChallengeInfo_me$key } from './__generated__/LineupChallengeInfo_me.graphql';

type Props = {
    me: LineupChallengeInfo_me$key;
};

export const LineupChallengeInfo = (props: Props): ReactElement => {
    // @TODO toggle wallet/tab scroll when component is opened/dismissed
    const me = useFragment<LineupChallengeInfo_me$key>(
        graphql`
            fragment LineupChallengeInfo_me on User {
                _id
                addresses
                burner
            }
        `,
        props.me
    );

    const challenge = props.challenge;
    const positiveOutcomes = challenge.positiveOptions.map(
        (outcome: string) => ({
            title: outcome,
            positive: true
        })
    );
    const negativeOutcomes = challenge.negativeOptions.map(
        (outcome: string) => ({
            title: outcome,
            positive: false
        })
    );
    const outcomes = [...positiveOutcomes, ...negativeOutcomes];

    const { top } = useSafeAreaInsets();

    return (
        <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={4}
            overlayColor="transparent"
            reducedTransparencyFallbackColor="rgba(255,255,255,.2)"
        >
            <View
                style={[
                    styles.container,
                    { paddingTop: top + sizes.windowH * 0.02 }
                ]}
            >
                <View style={styles.background}>
                    <ScrollView
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: top || '4%'
                        }}
                    >
                        <View style={styles.row}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>200</Text>
                            </View>
                            <Title size={22} style={styles.title} shadow>
                                {challenge.title}
                            </Title>
                        </View>
                        <View style={styles.inner}>
                            <View style={[styles.row, styles.infoContainer]}>
                                <ImageCard
                                    height={sizes.smallScreen ? 200 : 235}
                                    source={{
                                        uri:
                                            'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                                    }}
                                />
                                <View style={styles.textContainer}>
                                    <Text style={styles.infoTitle}>
                                        {challenge.creator.username}
                                    </Text>
                                    <Text style={styles.infoDescription}>
                                        {challenge.content}
                                    </Text>
                                    <XdaiBanner
                                        amount={challenge.totalDonations}
                                        style={styles.banner}
                                    />
                                    <Text style={styles.infoStats}>
                                        25 xDai to #199
                                    </Text>
                                    <Text style={styles.infoStats}>
                                        125 xDai to #1
                                    </Text>
                                    <Button
                                        title="Donate"
                                        style={styles.button}
                                        onPress={() =>
                                            sheetRef.current?.expand()
                                        }
                                    />
                                </View>
                            </View>

                            <Title size={30} style={styles.outcomesTitle}>
                                Outcomes
                            </Title>

                            {outcomes.map((item) => (
                                <Card
                                    noPadding
                                    style={styles.card}
                                    key={item.title}
                                >
                                    <Notch
                                        gradient
                                        pink={item.positive}
                                        title={item.title}
                                        style={{
                                            alignSelf: item.positive
                                                ? 'flex-start'
                                                : 'flex-end'
                                        }}
                                    />
                                    <View style={styles.cardTextContainer}>
                                        <Text style={styles.cardText}>
                                            'I lift it with one hand, I’m
                                            amazing. This description goes on
                                            and on and on and should wrap
                                            around.'
                                        </Text>
                                        <Title
                                            style={[
                                                styles.cardPercent,
                                                {
                                                    color: item.positive
                                                        ? colors.pink
                                                        : colors.gray
                                                }
                                            ]}
                                            size={35}
                                        >
                                            50
                                            <Title
                                                size={15}
                                                style={{
                                                    color: item.positive
                                                        ? colors.pink
                                                        : colors.gray
                                                }}
                                            >
                                                %
                                            </Title>
                                        </Title>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: '4%'
    },
    background: {
        ...backgroundStyles.fullSheet
    },
    inner: {
        paddingHorizontal: '4%'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    badge: {
        backgroundColor: colors.orange,
        paddingHorizontal: 8,
        borderRadius: 30
    },
    badgeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500'
    },
    title: {
        marginHorizontal: '6%',
        paddingTop: '1%'
    },
    infoContainer: {
        marginTop: '4%'
    },
    textContainer: {
        marginLeft: '6%',
        flexShrink: 1
    },
    infoTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700'
    },
    infoDescription: {
        color: '#282426',
        fontSize: 16,
        marginTop: '4%',
        marginBottom: '8%'
    },
    infoStats: {
        color: '#726369',
        fontSize: 14
    },
    banner: {
        marginBottom: '2%'
    },
    button: {
        alignSelf: 'flex-start',
        marginTop: '4%'
    },
    outcomesTitle: {
        textAlign: 'center',
        marginTop: '6%'
    },
    card: {
        marginTop: '4%'
    },
    cardTextContainer: {
        padding: '4%'
    },
    cardText: {
        fontSize: 16,
        color: '#282426'
    },
    cardPercent: {
        color: colors.pink,
        textAlign: 'right'
    }
});
