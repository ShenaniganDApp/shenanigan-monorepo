import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, graphql, useFragment } from 'relay-hooks';
import { ProfileTabsProps } from '../../Navigator';
import { Profile_me$key} from './__generated__/Profile_me.graphql';

const fragmentSpecMe = graphql`
  fragment Profile_me on User {
    id
    username
  }
`;

type Props = ProfileTabsProps;
const Profile = (props: Props) => {
    const me = useFragment<Profile_me$key>(fragmentSpecMe, props.route.params.me);
    return (
        <SafeAreaView>
            <Text> {me?.id} </Text>
            <Text> {me?.username} </Text>
        </SafeAreaView>
    );
};

export default Profile;
