import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, graphql, useFragment } from 'relay-hooks';
import { ProfileProps } from '../../Navigator';
import { Profile_me$key } from './__generated__/Profile_me.graphql';

const fragmentSpecMe = graphql`
    fragment Profile_me on User {
        id
        username
    }
`;

type Props = ProfileProps;
const Profile = (props: Props) => {
    const me = useFragment<Profile_me$key>(
        fragmentSpecMe,
        props.route.params.me
    );
    return (
        <SafeAreaView>
            <Text> {me?.id} </Text>
            <Text> {me?.username} </Text>
            <Button
                title="Start Streaming"
                onPress={() => props.navigation.navigate('LiveDashboard')}
            ></Button>
        </SafeAreaView>
    );
};

export default Profile;
