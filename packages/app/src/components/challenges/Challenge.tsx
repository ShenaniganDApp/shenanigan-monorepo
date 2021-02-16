import React, { ReactElement } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card, Button } from '../UI';

export const Challenge = (): ReactElement => {
    const testList = {
        positive: ['this is a positive outcome', 'this is a positive outcome'],
        negative: ['this is a negative outcome', 'this is a negative outcome']
    };

    return (
        <View style={styles.container}>
            <Card transparent style={styles.profile}>
                <View style={styles.user}>
                    <View style={styles.image} />
                    <Text style={styles.userName}>Username</Text>
                </View>

                <View style={styles.text}>
                    <Text style={styles.title}>Lorem ipsum dolor sit.</Text>
                    <Text style={styles.body}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Ratione ut fugit maiores! Lorem ipsum dolor sit
                        amet consectetur adipisicing elit.
                    </Text>
                </View>
            </Card>

            <View style={styles.challenge}>
                <View style={styles.header}>
                    <View style={styles.imageLg} />

                    <Text style={styles.donation}>10 XDAI</Text>
                </View>

                <ScrollView style={styles.list}>
                    <View>
                        {testList.positive.map((item) => (
                            <View
                                style={{
                                    ...styles.listItem,
                                    backgroundColor: '#A4D9B6'
                                }}
                            >
                                <Text style={styles.listText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                    <View>
                        {testList.negative.map((item) => (
                            <View
                                style={{
                                    ...styles.listItem,
                                    backgroundColor: '#F2D7E2'
                                }}
                            >
                                <Text style={styles.listText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <Button
                    title="yo"
                    onPress={() => console.log('donate')}
                    shadow
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1,
        backgroundColor: 'darkred',
        justifyContent: 'space-between'
    },
    profile: {
        marginTop: 50
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
