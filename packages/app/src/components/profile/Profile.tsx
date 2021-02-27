import React, { useEffect, useState } from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useQuery } from 'relay-hooks';
import { ProfileQuery } from './__generated__/ProfileQuery.graphql';
import { ProfileProps } from '../../Navigator';
import { UserChallengesList } from './UserChallengesList';
import { LiveDashboard } from '../Live/LiveDashboard';

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

    //@TODO implement retry, error, and cached
    const { props: data } = useQuery<ProfileQuery>(
        graphql`
            query ProfileQuery {
                me {
                    addresses
                    username
                    burner
                    ...ChallengeForm_me
                }
                ...UserChallengesList_query
            }
        `
    );

    const { me } = { ...data };

    // const { connectWeb3 } = useContext(Web3Context);
    useEffect(() => {
        if (me) {
            setUser({
                address: me.addresses[0],
                username: me.username,
                isBurner: me.burner
            });
        }
    }, [me]);
    return (
        <SafeAreaView>
            <Text> {user.address}</Text>
            <Button
                title="Start Streaming"
                onPress={() =>
                    props.navigation.navigate('ChallengeForm', {
                        me
                    })
                }
            />
            {data ? (
                <UserChallengesList query={data} />
            ) : (
                <Text>Loading...</Text>
            )}
        </SafeAreaView>
    );
};
