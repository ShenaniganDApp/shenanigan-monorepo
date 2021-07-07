import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, graphql } from 'relay-hooks';
import { Gradient, Title, Button } from '../UI';
import { MarketList } from './MarketList';
import { SearchBar } from './SearchBar';
import { Filters } from './Filters';
import { MarketQuery } from './__generated__/MarketQuery.graphql';

const query = graphql`
    query MarketQuery {
        ...MarketList_query
    }
`;

export const Market = (): React.ReactElement => {
    const { props: data, retry } = useQuery<MarketQuery>(query);
    const { top } = useSafeAreaInsets();

    return (
        <Gradient>
            <View style={[styles.container, { paddingTop: top }]}>
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
            </View>
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
