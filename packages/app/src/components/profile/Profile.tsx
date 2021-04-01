import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useFragment, useQuery } from 'relay-hooks';
import { ProfileProps } from '../../Navigator';
import { UserChallengesList } from './UserChallengesList';
import { LiveDashboard } from '../Live/LiveDashboard';
import { Profile_me, Profile_me$key } from './__generated__/Profile_me.graphql';

type Props = ProfileProps;
export const Profile = (props: Props): React.ReactElement => {
    const me = useFragment<Profile_me$key>(
        graphql`
            fragment Profile_me on User {
                id
                addresses
                burner
                ...ChallengeForm_me
            }
        `,
        props.route.params.me
    );

    return (
        <SafeAreaView>
            <Text>{me.addresses[0]}</Text>
            <Button
                title="Start Streaming"
                onPress={() =>
                    props.navigation.navigate('CreateChallengeScreen', {
                        me
                    })
                }
            />
            <UserChallengesList query={props.route.params.userChallengeQuery} />
        </SafeAreaView>
    );
};
