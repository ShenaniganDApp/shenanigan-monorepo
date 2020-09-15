import * as React from 'react';
import { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    FlatList
} from 'react-native';

import {
    createPaginationContainer,
    requestSubscription,
    graphql,
    RelayPaginationProp
} from 'react-relay';

import { createQueryRenderer, Environment } from '../../relay';
import { ConnectionHandler } from 'relay-runtime';

import {
    CommentList_query,
    CommentList_query$key
} from './__generated__/CommentList_query.graphql';
import { CommentListPaginationQuery } from './__generated__/CommentListPaginationQuery.graphql';
import CommentAddedSubscription from './CommentAddedSubscription';

type RelayPagination = { relay: RelayPaginationProp };

type Props = {
    query: CommentList_query;
} & RelayPagination;

class CommentList extends Component<Props> {
    state = {
        isFetchingTop: false
    };

    componentDidMount() {
        CommentAddedSubscription();
    }

    onRefresh = () => {
        const { comments } = this.props.query;

        if (this.props.relay.isLoading()) {
            return;
        }

        this.setState({
            isFetchingTop: true
        });

        this.props.relay.refetchConnection(comments?.edges.length!, (err) => {
            this.setState({
                isFetchingTop: false
            });
        });
    };
    onEndReached = () => {
        if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
            return;
        }

        // fetch more 2
        this.props.relay.loadMore(2, (err) => {
            console.log('loadMore: ', err);
        });
    };

    // makeComment = (amount) => {
    //     // if (!this.context.token) {
    //     //   this.setState({ selectedEvent: null });
    //     //   return;
    //     // }
    //     const makeCommentRequest = {
    //         query: `
    //       mutation commentPoll($id: ID!, $amount: Float!) {
    //         commentPoll(pollId: $id, amount: $amount) {
    //           _id
    //          createdAt
    //          updatedAt
    //         }
    //       }
    //     `,
    //         variables: {
    //             id: this.state.selectedPoll._id,
    //             amount: amount
    //         }
    //     };

    //     fetch('http://localhost:8000/graphql', {
    //         method: 'POST',
    //         body: JSON.stringify(makeCommentRequest),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: 'Bearer ' + this.props.user.token
    //         }
    //     })
    //         .then((res) => {
    //             if (res.status !== 200 && res.status !== 201) {
    //                 throw new Error('Failed!');
    //             }
    //             return res.json();
    //         })
    //         .then((resData) => {
    //             console.log(resData);
    //             this.setState({ selectedEvent: null });
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    render() {
        const { comments } = this.props.query;
        return (
            <View style={styles.container}>
                <FlatList
                    data={comments?.edges}
                    renderItem={({ item }) => {
                        const { node } = item!;

                        return (
                            <TouchableHighlight
                                // onPress={() => this.goToUserDetail(node)}
                                underlayColor="whitesmoke"
                                style={styles.commentTypes}
                            >
                                <View>
                                    <Text>{node!.content}</Text>
                                </View>
                            </TouchableHighlight>
                        );
                    }}
                    keyExtractor={(item) => item!.node!._id}
                    onEndReached={this.onEndReached}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isFetchingTop}
                    ItemSeparatorComponent={() => <View style={null} />}
                    ListFooterComponent={null}
                />
            </View>
        );
    }
}

const CommentListPaginationContainer = createPaginationContainer(
    CommentList,
    {
        query: graphql`
            fragment CommentList_query on Query {
                comments(first: $count, after: $cursor)
                    @connection(key: "CommentList_comments") {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    edges {
                        node {
                            _id
                            content
                        }
                    }
                }
            }
        `
    },
    {
        direction: 'forward',
        getConnectionFromProps(props) {
            return props.query && props.query.comments;
        },
        getFragmentVariables(prevVars, totalCount) {
            return {
                ...prevVars,
                count: totalCount
            };
        },
        getVariables(props, { count, cursor }, fragmentVariables) {
            return {
                count,
                cursor
            };
        },
        query: graphql`
            query CommentListPaginationQuery($count: Int!, $cursor: String) {
                ...CommentList_query
            }
        `
    }
);

export default createQueryRenderer(
    CommentListPaginationContainer,
    CommentList,
    {
        query: graphql`
            query CommentListQuery($count: Int!, $cursor: String) {
                ...CommentList_query
            }
        `,
        variables: { cursor: null, count: 1 }
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        width: '100%',
        height: '100%'
    },
    commentTypes: {
        width: '80%',
        backgroundColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#5E3D70',
        borderRadius: 3,
        paddingVertical: '5%',
        marginRight: '10%',
        marginBottom: '10%',
        marginLeft: '10%',
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 5,
        shadowColor: '#5E3D70',
        shadowOpacity: 1.0
    },
    commentList: {
        width: '100%',
        height: '80%'
    }
});
