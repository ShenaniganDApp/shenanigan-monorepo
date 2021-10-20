import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { sizes, Tag } from '../UI';
type Props = {};

export const TagsCard = (props: Props): ReactElement => {
    const tags = ['tag', 'another tag', 'tags'];
    return (
        <View style={styles.inner}>
            {tags.map((tag) => (
                <Tag text={tag} style={styles.tagContainer} key={tag} />
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
        marginBottom: 8,
        marginRight: 8
    }
});
