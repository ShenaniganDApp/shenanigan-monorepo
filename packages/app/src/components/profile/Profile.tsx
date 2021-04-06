import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
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
import { CardCollection } from './CardCollection';
import { StreamButton } from './StreamButton';

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
        <LinearGradient
            colors={[colors.pink, colors.yellow, colors.altWhite]}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
                    <StreamButton
                        onPress={() =>
                            props.navigation.navigate('CreateChallengeScreen', {
                                me
                            })
                        }
                    />
                    <HeaderCard address={me.addresses[0]} />
                    <TagsCard />
                    <SocialCard />
                    <CardCollection />
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
    }
});
