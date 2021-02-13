import React, { ReactElement, useRef, useState, useEffect } from 'react';
import { Button, StyleSheet, Animated, View } from 'react-native';
import { graphql, useQuery } from 'relay-hooks';

import { LineupQuery } from './__generated__/LineupQuery.graphql';
import { LineupList } from './LineupList';
import LinearGradient from 'react-native-linear-gradient';
import { FadeIn } from '../UI';
import { colors } from '../../globalStyles';
import { LineupProps as Props } from '../../Navigator';

const query = graphql`
    query LineupQuery {
        ...LineupList_query
    }
`;

export const Lineup = (props: Props): ReactElement => {
    // @TODO handle error
    const { props: data, retry } = useQuery<LineupQuery>(query);

    return data ? (
        <LineupList query={data} />
    ) : (
        <Button title="Retry" onPress={retry} />
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 15
    },
    title: {
        fontWeight: 'bold',
        fontSize: 32,
        textAlign: 'center',
        marginVertical: 12,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10
    }
});
