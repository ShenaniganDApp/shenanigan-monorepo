import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { graphql, useFragment } from 'react-relay';
import { ProfileProps } from '../../Navigator';
import { Profile_me$key } from './__generated__/Profile_me.graphql';
import { UserChallengesList } from './UserChallengesList';
import { Card, sizes, Gradient } from '../UI';
import { HeaderCard } from './HeaderCard';
import { TagsCard } from './TagsCard';
import { ButtonNav } from './ButtonNav';
import { FollowListButton } from './FollowListButton';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { BannerAvatar } from './BannerAvatar';
import { FollowDrawer } from './FollowDrawer';

type Props = ProfileProps;
export const Profile = (props: Props): React.ReactElement => {
    const me = useFragment<Profile_me$key>(
        graphql`
            fragment Profile_me on User {
                id
                burner
                addresses
                ...HeaderCard_me
            }
        `,
        props.route.params.me
    );

    const handleStartChallenge = () => {
        props.navigation.navigate('CreateChallengeScreen', { me });
    };

    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <Gradient>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    nestedScrollEnabled={true}
                >
                    <View style={styles.topButtons}>
                        <FollowListButton onPress={() => setDrawerOpen(true)} />
                        <TouchableOpacity onPress={handleStartChallenge}>
                            <Text style={styles.challengeButton}>
                                New Challenge
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <BannerAvatar
                            avatarSrc={{
                                uri:
                                    'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                            }}
                            bannerSrc={{
                                uri:
                                    'https://images.unsplash.com/photo-1519861531473-9200262188bf?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80'
                            }}
                        />
                        <Card glass style={{ marginTop: -12 }}>
                            <HeaderCard me={me} />
                            <TagsCard />
                            <ButtonNav />
                        </Card>

                        {/* <UserChallengesList
                        query={props.route.params.userChallengeQuery}
                    /> */}
                    </View>
                </ScrollView>
            </SafeAreaView>
            <FollowDrawer
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
            />
        </Gradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: sizes.containerPadding,
        paddingTop: sizes.containerPadding,
        paddingBottom: sizes.windowH * 0.03
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
