import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, graphql } from 'relay-hooks';

const fragmentSpec = graphql`
    fragment Profile_query on Query {
        me {
            id
            username
        }
    }
`;

const query = graphql`
    query ProfileQuery {
        me {
            id
            username
        }
    }
`;

const Profile = (props) => {
    const { props: {me}, error, retry, cached } = useQuery(query);
    return (
        <SafeAreaView>
            <Text> {me.id} </Text>
            <Text> {me.meId} </Text>
            <Text> {me.username} </Text>
        </SafeAreaView>
    );
};

export default Profile;
