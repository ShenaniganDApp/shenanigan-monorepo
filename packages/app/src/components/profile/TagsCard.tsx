import React, { ReactElement } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors, sizes } from '../UI';
type Props = {};

export const TagsCard = (props: Props): ReactElement => {
    const tags = ['tag', 'another tag', 'tags'];
    return (
        <View style={styles.inner}>
            {tags.map((tag) => (
                <View key={tag} style={styles.tagContainer}>
                    <Text style={styles.tag}>{tag}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: sizes.windowH * 0.03
    },
    inner: {
        paddingTop: 8,
        paddingLeft: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    tagContainer: {
        backgroundColor: colors.altWhite,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        marginBottom: 8,
        marginRight: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5
    },
    tag: {
        textTransform: 'uppercase',
        color: '#333'
    }
});
