import React, { ReactElement, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card, Button, colors } from '../UI';
import LinearGradient from 'react-native-linear-gradient';
import { TabNavSwipeContext } from '../../contexts';
import { graphql, useFragment } from 'react-relay';
import { Challenge_challenge$key } from './__generated__/Challenge_challenge.graphql';

export const Challenge = (props: any): ReactElement => {
    const { setLiveTabsSwipe } = useContext(TabNavSwipeContext);
    const { color, node } = props.route.params;

    const challenge = useFragment<Challenge_challenge$key>(
        graphql`
            fragment Challenge_challenge on Challenge {
                _id
                creator {
                    addresses
                }
                title
                content
                positiveOptions
                negativeOptions
                totalDonations
            }
        `,
        node
    );

    useEffect(() => {
        setLiveTabsSwipe(false);
    }, []);

    const handlePress = () => {
        setLiveTabsSwipe(true);
        props.navigation.goBack();
    };

    const ListItem = ({
        text,
        positive
    }: {
        text: string;
        positive?: boolean;
    }) => (
        <View
            style={[
                styles.listItem,
                { backgroundColor: positive ? '#A4D9B6' : '#F2D7E2' }
            ]}
        >
            <Text style={styles.listText}>{text}</Text>
        </View>
    );

    return (
        <View style={{ backgroundColor: color, flex: 1 }}>
            <LinearGradient
                colors={['#FFFFFF00', colors.altWhite]}
                style={{ flex: 1 }}
            >
                <View style={styles.container}>
                    <View>
                        <Button
                            title="Back"
                            onPress={handlePress}
                            small
                            color="black"
                        />

                        <Card transparent style={styles.profile}>
                            <View style={styles.user}>
                                <View style={styles.image} />
                                <Text style={styles.userName}>
                                    {challenge.creator.username}
                                </Text>
                            </View>

                            <View style={styles.text}>
                                <Text style={styles.title}>
                                    {challenge.title}
                                </Text>
                                <Text style={styles.body}>
                                    {challenge.content}
                                </Text>
                            </View>
                        </Card>
                    </View>

                    <View style={styles.challenge}>
                        <View style={styles.header}>
                            <View style={styles.imageLg} />

                            <Text style={styles.donation}>
                                {challenge.totalDonations}
                            </Text>
                        </View>

                        <ScrollView style={styles.list}>
                            {challenge.positiveOptions.map((item) => (
                                <ListItem
                                    text={item}
                                    key={challenge._id}
                                    positive
                                />
                            ))}

                            {challenge.negativeOptions.map((item) => (
                                <ListItem text={item} key={challenge._id} />
                            ))}
                        </ScrollView>

                        <Button
                            title="donate"
                            onPress={() => console.log('donate')}
                            shadow
                        />
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1,
        justifyContent: 'space-between'
    },
    profile: {
        marginTop: 20
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    image: {
        height: 40,
        width: 40,
        backgroundColor: '#ddd'
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 12
    },
    text: {},
    title: {
        fontWeight: 'bold',
        marginBottom: 8
    },
    body: {},
    challenge: {
        backgroundColor: '#E6FFFF',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 15,
        maxHeight: '70%'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#999',
        borderBottomWidth: 1,
        paddingBottom: 15,
        marginBottom: 15
    },
    imageLg: {
        height: 90,
        width: 60,
        backgroundColor: '#222',
        borderRadius: 12
    },
    donation: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    list: {},
    listItem: {
        fontWeight: 'bold',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 15,
        borderRadius: 6
    },
    listText: {
        fontWeight: 'bold'
    }
});
