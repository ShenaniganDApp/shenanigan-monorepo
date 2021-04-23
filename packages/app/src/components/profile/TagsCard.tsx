import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Card } from '../UI';
type Props = {};

export const TagsCard = (props: Props): ReactElement => {
    const tags = ['tag', 'another tag', 'tags'];
    return (
        <Card style={styles.container} noPadding>
            <View style={styles.inner}>
                {tags.map((tag) => (
                    <View key={tag} style={styles.tagContainer}>
                        <Text style={styles.tag}>{tag}</Text>
                    </View>
                ))}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16
    },
    inner: {
        paddingTop: 8,
        paddingLeft: 8,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    tagContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        marginBottom: 8,
        marginRight: 8
    },
    tag: {
        textTransform: 'uppercase',
        color: '#333'
    }
});
