import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useFragment, useQuery } from 'relay-hooks';
import { ProfileProps } from '../../Navigator';
import { UserChallengesList } from './UserChallengesList';
import { LiveDashboard } from '../Live/LiveDashboard';
import { Profile_me, Profile_me$key } from './__generated__/Profile_me.graphql';
import { Button, Gradient, ImageCard, RoundButton, Title } from '../UI';

type Props = ProfileProps;
export const Profile = (props: Props): React.ReactElement => {
    const me = useFragment<Profile_me$key>(
        graphql`
            fragment Profile_me on User {
                id
                addresses
                burner
            }
        `,
        props.route.params.me
    );

    return (
        // <SafeAreaView>
        //     <Text>{me.addresses[0]}</Text>
        //     <Button
        //         title="Start Streaming"
        //         onPress={() =>
        //             props.navigation.navigate('CreateChallengeScreen', {
        //                 me
        //             })
        //         }
        //     />
        //     <UserChallengesList query={props.route.params.userChallengeQuery} />
        // </SafeAreaView>
        <Gradient>
            <SafeAreaView
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Title>Hello there</Title>
                <Button title="Donate" />
                <RoundButton icon="send" />
                <ImageCard
                    success={false}
                    source={{
                        uri:
                            'https://images.unsplash.com/photo-1618102687318-c7e58b1effae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80'
                    }}
                />
            </SafeAreaView>
        </Gradient>
    );
};
