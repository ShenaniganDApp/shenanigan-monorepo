import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useFragment } from 'relay-hooks';
import LinearGradient from 'react-native-linear-gradient';
import { ProfileProps } from '../../Navigator';
import { Profile_me$key } from './__generated__/Profile_me.graphql';
import { UserChallengesList } from './UserChallengesList';
import { colors } from '../UI';
import { HeaderCard } from './HeaderCard';
import { TagsCard } from './TagsCard';
import { SocialCard } from './SocialCard';
import { ButtonNav } from './ButtonNav';
import { FollowListButton } from './FollowListButton';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

    const handleStartChallenge = () => {
        props.navigation.navigate('CreateChallengeScreen', { me });
    };

    return (
        <LinearGradient
            colors={[colors.pink, colors.yellow, colors.altWhite]}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
                    <View style={styles.topButtons}>
                        <FollowListButton
                            onPress={() => console.log('open drawer')}
                        />
                        <TouchableOpacity onPress={handleStartChallenge}>
                            <Text style={styles.challengeButton}>
                                New Challenge
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <HeaderCard address={me.addresses[0]} />
                    <TagsCard />
                    <SocialCard />
                    <ButtonNav />
                    {/* <UserChallengesList
                        query={props.route.params.userChallengeQuery}
                    /> */}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    challengeButton: {
        color: 'white',
        fontWeight: 'bold'
    }
});
