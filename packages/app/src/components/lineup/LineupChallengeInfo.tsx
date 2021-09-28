import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { graphql, useFragment } from 'react-relay';
import { BlurView } from '@react-native-community/blur';
import BottomSheetType from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineupChallengeInfo_me$key } from './__generated__/LineupChallengeInfo_me.graphql';
import {
    backgroundStyles,
    BottomSheet,
    Button,
    Card,
    colors,
    ImageCard,
    Notch,
    sizes,
    Title,
    XdaiBanner
} from '../UI';
import { DonationModal } from './DonationModal';
import { LineupChallengeInfo_challenge$key } from './__generated__/LineupChallengeInfo_challenge.graphql';

type Props = {
    me: LineupChallengeInfo_me$key;
    infoVisible: boolean;
    challenge: LineupChallengeInfo_challenge$key;
};

export const LineupChallengeInfo = (props: Props): ReactElement => {
    const { top } = useSafeAreaInsets();
    const [donationAmount, setDonationAmount] = useState('');
    const scrollRef = useRef<ScrollView>(null);
    const sheetRef = useRef<BottomSheetType | null>(null);

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

    const challenge = useFragment<LineupChallengeInfo_challenge$key>(
        graphql`
            fragment LineupChallengeInfo_challenge on Challenge {
                id
                title
                content
                positiveOptions
                negativeOptions
                totalDonations
                creator {
                    addresses
                    username
                }
            }
        `,
        props.challenge
    );

    const positiveOutcomes = challenge.positiveOptions.map(
        (outcome: string | null) => ({
            title: outcome,
            positive: true
        })
    );

    const negativeOutcomes = challenge.negativeOptions.map(
        (outcome: string | null) => ({
            title: outcome,
            positive: false
        })
    );

    const outcomes = [...positiveOutcomes, ...negativeOutcomes];

    useEffect(() => {
        scrollRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    }, [props.infoVisible]);

    return (
        <>
            <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={4}
                overlayColor="transparent"
                reducedTransparencyFallbackColor="rgba(255,255,255,.2)"
            >
                <View
                    style={[styles.container, { paddingTop: top * 2 || '11%' }]}
                >
                    <View style={styles.background}>
                        <ScrollView
                            ref={scrollRef}
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
                                <View
                                    style={[styles.row, styles.infoContainer]}
                                >
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

                                <Title
                                    size={30}
                                    style={styles.outcomesTitle}
                                    shadow
                                >
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
                                            title={
                                                item.positive
                                                    ? 'Positive'
                                                    : 'Negative'
                                            }
                                            style={{
                                                alignSelf: item.positive
                                                    ? 'flex-start'
                                                    : 'flex-end'
                                            }}
                                        />
                                        <View style={styles.cardTextContainer}>
                                            <Text style={styles.cardText}>
                                                {item.title}
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
            <View
                style={[StyleSheet.absoluteFill, { zIndex: 9 }]}
                pointerEvents="box-none"
            >
                <BottomSheet
                    ref={sheetRef}
                    onClose={() => setDonationAmount('')}
                >
                    <DonationModal
                        donationAmount={donationAmount}
                        setDonationAmount={setDonationAmount}
                    />
                </BottomSheet>
            </View>
        </>
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
