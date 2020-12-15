import * as React from 'react';
import { Text, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, graphql } from 'relay-hooks';
import { MarketList } from './MarketList';
import { MarketQuery } from './__generated__/MarketQuery.graphql';
import Layout from '../../Layout'

const styles = StyleSheet.create({
    background: { backgroundColor: '#e6ffff' }
});

const query = graphql`
    query MarketQuery {
        ...MarketList_query
    }
`;

export const Market = (): React.ReactElement => {
    const { props: data, retry } = useQuery<MarketQuery>(query);


    return data ? (
        <Layout>
            <SafeAreaView style={styles.background}>
                <Text>Market</Text>
                <MarketList query={data} />
            </SafeAreaView>
        </Layout>
    ) : (
        <Layout>
            <SafeAreaView>
                <Button title={"Retry"} onPress={retry}/>
            </SafeAreaView>
        </Layout>
    );
};
