import React, { useEffect, useState } from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useFragment, useQuery } from 'relay-hooks';
import { ProfileQuery } from './__generated__/ProfileQuery.graphql';
import { ProfileProps } from '../../Navigator';
import { UserChallengesList } from './UserChallengesList';
import { LiveDashboard } from '../Live/LiveDashboard';
import { Profile_me, Profile_me$key } from './__generated__/Profile_me.graphql';

type User = {
    address: string | null;
    username: string | null;
    isBurner: boolean | null;
};

const initialState = {
    user: {
        address: '',
        username: '',
        isBurner: true
    }
};

type Props = ProfileProps;
export const Profile = (props: Props): React.ReactElement => {
    const [user, setUser] = useState<User>(initialState.user);

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

    // const challengeForm = useFragment<Profile_me$key>(
    //     graphql`
    //         fragment Profile_me on Profile {
    //             ...ChallengeForm_me
    //         }
    //     `,
    //     props.route.params.me
    // );

    //@TODO implement retry, error, and cached
    // const { props: data } = useQuery<ProfileQuery>(
    //     graphql`
    //         query ProfileQuery {
    //             me {
    //                 ...ChallengeForm_me
    //             }
    //             ...UserChallengesList_query
    //         }
    //     `
    // );

    // const { connectWeb3 } = useContext(Web3Context);

    // useEffect(() => {
    //     if (me) {
    //         setUser({
    //             address: me.addresses[0],
    //             username: me.username,
    //             isBurner: me.burner
    //         });
    //     }
    // }, [me]);

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
            {/* {data ? (
                <UserChallengesList query={data} />
            ) : (
                <Text>Loading...</Text>
            )} */}
        </SafeAreaView>
    );
};
