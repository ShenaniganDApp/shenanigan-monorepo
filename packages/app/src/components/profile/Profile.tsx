import React, { useState, useEffect } from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useFragment, useQuery } from 'relay-hooks';

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
    const [profile, setProfile] = useState('')
    const me = useFragment<Profile_me$key>(
        fragmentSpecMe,
        props.route.params.me
    );
    const api3Box = 'https://ipfs.3box.io/profile?address='

    useEffect(()=>{
        console.log('props', props);
        
        const address = props.route.params.address ? props.route.params.address : ''
        fetchProfile(address)
    },[profile])

    const fetchProfile = (address)=>{
        fetch( api3Box + address)
        .then(response => response.json())
        .then(data => setProfile(data));
    }

    return (
        <SafeAreaView>
            <Text> {me?.id} </Text>
            <Text> {me?.username} </Text>
            <Text> {props.route.params.address} </Text>
            <Button
                title="Start Streaming"
                onPress={() => props.navigation.navigate('LiveDashboard')}
            />
        </SafeAreaView>
    );
};

export default Profile;
