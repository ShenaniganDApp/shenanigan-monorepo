// import * as React from 'react';
// import { Component } from 'react';
// // import {Header} from 'react-native-elements';
// import {
//     StyleSheet,
//     Text,
//     View,
//     TouchableHighlight,
//     FlatList
// } from 'react-native';

// import { createPaginationContainer, graphql } from 'react-relay';
// import { createQueryRenderer } from '../../relay';

// import { BetList_query } from './__generated__/BetList_query.graphql';

// type Props = {
//     query: BetList_query;
// };

// class BetList extends Component<Props> {
//     state = {
//         isFetchingTop: false
//     };

//     onRefresh = () => {
//         const { bets } = this.props.query;

//         if (this.props.relay.isLoading()) {
//             return;
//         }

//         this.setState({
//             isFetchingTop: true
//         });

//         this.props.relay.refetchConnection(bets.edges.length, (err) => {
//             this.setState({
//                 isFetchingTop: false
//             });
//         });
//     };
//     onEndReached = () => {
//         if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
//             return;
//         }

//         // fetch more 2
//         this.props.relay.loadMore(2, (err) => {
//             console.log('loadMore: ', err);
//         });
//     };

//     renderItem = ({ item }) => {
//         const { node } = item;

//         return (
//             <TouchableHighlight
//                 // onPress={() => this.goToUserDetail(node)}
//                 underlayColor="whitesmoke"
//                 style={styles.betTypes}
//             >
//                 <View>
//                     <Text>{node.comment.content}</Text>
//                 </View>
//             </TouchableHighlight>
//         );
//     };

//     makeBet = (amount) => {
//         // if (!this.context.token) {
//         //   this.setState({ selectedEvent: null });
//         //   return;
//         // }
//         const makeBetRequest = {
//             query: `
//           mutation betPoll($id: ID!, $amount: Float!) {
//             betPoll(pollId: $id, amount: $amount) {
//               _id
//              createdAt
//              updatedAt
//             }
//           }
//         `,
//             variables: {
//                 id: this.state.selectedPoll._id,
//                 amount: amount
//             }
//         };

//         fetch('http://localhost:8000/graphql', {
//             method: 'POST',
//             body: JSON.stringify(makeBetRequest),
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: 'Bearer ' + this.props.user.token
//             }
//         })
//             .then((res) => {
//                 if (res.status !== 200 && res.status !== 201) {
//                     throw new Error('Failed!');
//                 }
//                 return res.json();
//             })
//             .then((resData) => {
//                 console.log(resData);
//                 this.setState({ selectedEvent: null });
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     };

//     render() {
//         const { bets } = this.props.query;
//         return (
//             <View style={styles.container}>
//                 <FlatList
//                     style={styles.betList}
//                     data={bets.edges}
//                     renderItem={this.renderItem}
//                     keyExtractor={(item) => item.node._id}
//                     onEndReached={this.onEndReached}
//                     onRefresh={this.onRefresh}
//                     refreshing={this.state.isFetchingTop}
//                     ItemSeparatorComponent={() => (
//                         <View style={styles.separator} />
//                     )}
//                     ListFooterComponent={this.renderFooter}
//                 />
//             </View>
//         );
//     }
// }

// const BetListPaginationContainer = createPaginationContainer(
//     BetList,
//     {
//         query: graphql`
//             fragment BetList_query on Query {
//                 bets(first: $count, after: $cursor)
//                     @connection(key: "BetList_bets") {
//                     pageInfo {
//                         hasNextPage
//                         endCursor
//                     }
//                     edges {
//                         node {
//                             _id
//                             comment {
//                                 content
//                             }
//                         }
//                     }
//                 }
//             }
//         `
//     },
//     {
//         direction: 'forward',
//         getConnectionFromProps(props) {
//             return props.query && props.query.bets;
//         },
//         getFragmentVariables(prevVars, totalCount) {
//             return {
//                 ...prevVars,
//                 count: totalCount
//             };
//         },
//         getVariables(props, { count, cursor }, fragmentVariables) {
//             return {
//                 count,
//                 cursor
//             };
//         },
//         variables: { cursor: null },
//         query: graphql`
//             query BetListPaginationQuery($count: Int!, $cursor: String) {
//                 ...BetList_query
//             }
//         `
//     }
// );

// export default createQueryRenderer(BetListPaginationContainer, BetList, {
//     query: graphql`
//         query BetListQuery($count: Int!, $cursor: String) {
//             ...BetList_query
//         }
//     `,
//     variables: { cursor: null, count: 1 }
// });

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F5FCFF',
//         width: '100%',
//         height: '100%'
//     },
//     btn: {
//         position: 'relative',
//         width: '80%',
//         backgroundColor: '#5E3D70',
//         borderWidth: 1,
//         borderStyle: 'solid',
//         borderColor: '#5E3D70',
//         borderRadius: 3,
//         paddingVertical: '5%',
//         marginRight: '10%',
//         marginLeft: '10%',
//         bottom: '1%',
//         shadowOffset: { width: 1, height: 1 },
//         shadowRadius: 5,
//         shadowColor: '#000000',
//         shadowOpacity: 1.0
//     },
//     btnText: {
//         color: 'white',
//         textAlign: 'center',
//         paddingLeft: 10,
//         paddingRight: 10
//     },
//     totalBetContainer: {
//         flex: 1,
//         alignItems: 'center'
//     },
//     totalBetTitle: {
//         fontSize: 30,
//         color: 'black'
//     },
//     totalBet: {
//         fontSize: 20,
//         color: 'black'
//     },
//     betTypes: {
//         width: '80%',
//         backgroundColor: 'white',
//         borderWidth: 1,
//         borderStyle: 'solid',
//         borderColor: '#5E3D70',
//         borderRadius: 3,
//         paddingVertical: '5%',
//         marginRight: '10%',
//         marginBottom: '1%',
//         marginLeft: '10%',
//         shadowOffset: { width: 1, height: 1 },
//         shadowRadius: 5,
//         shadowColor: '#5E3D70',
//         shadowOpacity: 1.0
//     },
//     betList: {
//         width: '100%',
//         height: '80%'
//     }
// });
