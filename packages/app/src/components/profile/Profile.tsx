import React, { useContext, useEffect, useState } from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useQuery } from 'relay-hooks';
import { Web3Context } from '../../contexts';
import { useBurner } from '../../hooks/Burner';
import { ProfileQuery } from './__generated__/ProfileQuery.graphql';
import { ProfileProps } from '../../Navigator';

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
const Profile = (props: Props): React.ReactElement => {
    const [user, setUser] = useState<User>(initialState.user);

    //@TODO implement retry, error, and cached
    const { props: queryProps } = useQuery<ProfileQuery>(
        graphql`
            query ProfileQuery {
                me {
                    ...Burner_me
                    addresses
                    username
                    burner
                }
            }
        `
    );

    const { me } = { ...queryProps };

    // const [isAuthenticated, burner] = useBurner(me);
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
                {console.log(user)}
                <Text> {user.address}</Text>
                <Button
                    title="Start Streaming"
                    onPress={() => props.navigation.navigate('LiveDashboard')}
                />
            </SafeAreaView>
    );
};

export default Profile;