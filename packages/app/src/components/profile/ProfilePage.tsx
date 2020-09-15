import * as React from 'react';
import { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    ImageBackground,
    Dimensions,
    TouchableOpacity
} from 'react-native';
// import MainHeader from '../components/headers/mainHeader';

import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay';
import { createQueryRenderer } from '../../relay';

import { ProfilePage_query } from './__generated__/ProfilePage_query.graphql';

type Props = {query: ProfilePage_query};

class ProfilePage extends Component<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    render() {
        const { user } = this.props.query;

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#5E3D70',
                    width: '100%',
                    height: '100%',
                    zIndex: -1
                }}
            >

                {/* <MainHeader
          title={'Profile'}
          iconLeft="menu"
          iconRight="videocam"
          style={{zIndex: 1}}
        /> */}
                {/* <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            overflow: 'hidden',
            zIndex: 0,
          }}>
          <BetList />
          <View style={[styles.container]}>
            <ImageBackground
              style={{
                width: '40%',
                height: Dimensions.get('window').height * 0.8,
              }}
              imageStyle={{
                width: '100%',
                height: '100%',
                top: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View style={[styles.userInfoContainer]}>
                <View style={[styles.profileImageContainer]}>
                  <Image style={[styles.profileImage]} />
                </View>
                <View style={[styles.userInfo]}>
                  <Text style={[styles.userNameText]}>{user.username}</Text>
                  <Text style={[styles.userAddress]}>{user.email}</Text>
                </View>
              </View>
            </ImageBackground>
            <View style={[styles.userContent]}>
              <View>
                <Text style={[styles.userNameText]}>Biography</Text>
              </View>
              <View>
                <Text style={[styles.userNameText]}>Highlight</Text>
              </View>
              <View>
                <Text style={[styles.userNameText]}>Streams</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={this.props.logout}
            style={{padding: 50, backgroundColor: 'blue'}}
          />
        </ScrollView> */}
            </View>
        );
    }
}
const ProfilePageFragmentContainer = createFragmentContainer(ProfilePage, {
    query: graphql`
        fragment ProfilePage_query on Query {
            user(id: $id) {
                username
                email
            }
        }
    `
});

export default createQueryRenderer(ProfilePageFragmentContainer, ProfilePage, {
    query: graphql`
        query ProfilePageQuery($id: String!) {
            ...ProfilePage_query
        }
    `,
    queriesParams: () => ({ id: 'VXNlcjo1ZjVkNWM2N2M2MWUxYTNjYTdhMTllZDE=' })
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 2,
        flexDirection: 'row'
    },
    // leftContainer: {
    //   flex: 17
    // },
    // rightContainer: {
    //   flex: 11
    // },
    userInfoContainer: {
        width: '100%',
        flexDirection: 'row',
        marginLeft: '2.5%',
        marginTop: '2.5%'
    },
    userInfo: {
        flexDirection: 'column',
        width: '100%',
        marginLeft: '5%'
    },
    userContent: {
        flex: 1,
        alignItems: 'center'
    },
    profileImageContainer: {
        height: 50,
        width: 50,
        shadowOffset: { width: 1.5, height: 1.5 },
        shadowRadius: 5,
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOpacity: 1.0
    },
    profileImage: {
        height: '100%',
        width: '100%',
        opacity: 10
    },
    userNameText: {
        color: 'white',
        fontSize: 20,
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10
    },
    userAddress: {
        color: 'white',
        fontSize: 15,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 1.5
    }
});
