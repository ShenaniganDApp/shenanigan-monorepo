import React, { useContext, useEffect, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, graphql } from 'relay-hooks';
import { Gradient, Title, Button } from '../UI';
import { MarketList } from './MarketList';
import { SearchBar } from './SearchBar';
import { Filters } from './Filters';
import { MarketQuery } from './__generated__/MarketQuery.graphql';
import { TabNavSwipeContext } from '../../contexts';
import { useNavigation } from '@react-navigation/native';

const query = graphql`
    query MarketQuery {
        ...MarketList_query
    }
`;

export const Market = (): ReactElement => {
    const { props: data, retry } = useQuery<MarketQuery>(query);
    const { setMainTabsSwipe } = useContext(TabNavSwipeContext);
    const navigation = useNavigation();

    useEffect(() => {
        const focus = navigation.addListener('focus', () => {
            setMainTabsSwipe(true);
        });
        return focus;
    }, [navigation]);

    return (
        <Gradient>
            <SafeAreaView style={styles.container}>
                {data ? (
                    <>
                        <Title style={styles.title} shadow>
                            Market
                        </Title>
                        <SearchBar />
                        <Filters />
                        <MarketList query={data} />
                    </>
                ) : (
                    <Button title={'Retry'} onPress={retry} />
                )}
            </SafeAreaView>
        </Gradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        textAlign: 'center',
        fontSize: 34
    }
});
