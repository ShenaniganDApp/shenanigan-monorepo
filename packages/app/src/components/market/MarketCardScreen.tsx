import React, { ReactElement, useContext, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TabNavSwipeContext } from '../../contexts';

type Props = {};

export const MarketCardScreen = (props: Props): ReactElement => {
    const { setMainTabsSwipe } = useContext(TabNavSwipeContext);

    useEffect(() => setMainTabsSwipe(false), []);

    return (
        <View style={styles.container}>
            <Text>CardScreen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});
