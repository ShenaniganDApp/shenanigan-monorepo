import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { colors, Card } from '../UI';

export const Vote = (): ReactElement => {
    return (
        <View style={styles.container}>
            <View style={styles.shadow}>
                <ResultsCard
                    title={'Live Challenge Title'}
                    skipPercent={20}
                    stayPercent={50}
                    viewerPercent={25}
                    totalViewers={120}
                    skipOnPress={() => console.log('skip')}
                    stayOnPress={() => console.log('stay')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3
    },
    resultsCard: {
        marginTop: 20,
        padding: 6,
        borderRadius: 16
    },
    resultsCardInner: {},
    challengeTitle: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 20
    },
    resultsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    result: {
        flex: 1
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    resultPercent: {
        fontSize: 32,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginVertical: 6
    },
    resultDivider: {
        height: 4,
        marginBottom: 30
    },
    resultButton: {
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 40
    },
    resultButtonText: {
        textAlign: 'center',
        color: 'white',
        textTransform: 'capitalize',
        fontSize: 16
    },
    viewers: {
        flex: 1,
        paddingHorizontal: 8
    },
    viewersTop: {
        marginBottom: 30
    },
    viewersText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8
    },
    viewersPercent: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        color: '#555'
    }
});

type ResultsCardProps = {
    title: string;
    skipPercent: number;
    stayPercent: number;
    totalViewers: number;
    viewerPercent: number;
    skipOnPress: () => void;
    stayOnPress: () => void;
};

const ResultsCard = ({
    title,
    skipPercent,
    stayPercent,
    totalViewers,
    viewerPercent,
    skipOnPress,
    stayOnPress
}: ResultsCardProps): ReactElement => (
    <LinearGradient
        colors={[
            colors.pink,
            colors.green,
            colors.yellow,
            colors.pink,
            colors.yellow
        ]}
        style={styles.resultsCard}
        useAngle={true}
        angle={10}
    >
        <Card style={styles.resultsCardInner}>
            <Text style={styles.challengeTitle}>{title}</Text>
            <View style={styles.resultsContainer}>
                <VoteResult
                    type={'skip'}
                    percent={skipPercent}
                    color={colors.pink}
                    onPress={skipOnPress}
                />
                <Viewers
                    viewerCount={totalViewers}
                    viewerPercent={viewerPercent}
                />
                <VoteResult
                    type={'stay'}
                    percent={stayPercent}
                    color={colors.green}
                    onPress={stayOnPress}
                />
            </View>
        </Card>
    </LinearGradient>
);

type VoteResultProps = {
    type: string;
    color: string;
    onPress: () => void;
    percent: number;
};

const VoteResult = ({
    type,
    percent,
    color,
    onPress
}: VoteResultProps): ReactElement => (
    <View style={styles.result}>
        <Text style={[styles.resultTitle, { color: color }]}>{type}</Text>
        <Text style={[styles.resultPercent, { color: color }]}>
            {percent}
            <Text style={{ fontSize: 20 }}>%</Text>
        </Text>
        <View style={[styles.resultDivider, { backgroundColor: color }]} />
        <TouchableOpacity
            onPress={onPress}
            style={[styles.resultButton, { backgroundColor: color }]}
        >
            <Text style={styles.resultButtonText}>{type}</Text>
        </TouchableOpacity>
    </View>
);

type ViewersProps = {
    viewerCount: number;
    viewerPercent: number;
};

const Viewers = ({
    viewerCount,
    viewerPercent
}: ViewersProps): ReactElement => (
    <View style={styles.viewers}>
        <View style={styles.viewersTop}>
            <Text style={styles.viewersText}>Total Viewers</Text>
            <Text style={styles.viewersText}>{viewerCount}</Text>
        </View>
        <Text style={styles.viewersPercent}>
            {viewerPercent}
            <Text style={{ fontSize: 16 }}>%</Text>
        </Text>
    </View>
);
