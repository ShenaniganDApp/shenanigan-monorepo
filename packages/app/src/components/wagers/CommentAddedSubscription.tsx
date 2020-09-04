import * as React from 'react';
import {
    createPaginationContainer,
    requestSubscription,
    graphql
} from 'react-relay';
import {
    ConnectionHandler,
    RecordSourceSelectorProxy,
    ROOT_ID,
    DataID,
    RecordProxy,
    GraphQLSubscriptionConfig,
    IEnvironment
} from 'relay-runtime';

import { Environment, connectionUpdater } from '../../relay';
import {
    CommentAddedSubscription,
    CommentAddedSubscriptionResponse
} from './__generated__/CommentAddedSubscription.graphql';

const CommentAdded = graphql`
    subscription CommentAddedSubscription($input: CommentAddedInput!) {
        CommentAdded(input: $input) {
            comment {
                _id
                content
            }
        }
    }
`;

const updater = (store: RecordSourceSelectorProxy) => {
    const commentNode = store
        ?.getRootField('CommentAdded')
        ?.getLinkedRecord('comment') as RecordProxy;

    const commentId = commentNode?.getValue('id') as DataID;

    const commentStore = store.get(commentId);

    // avoid mutation + subscription update
    if (!commentStore) {
        const commentConnection = ConnectionHandler.getConnection(
            store.getRoot(),
            'CommentList_comments'
        ) as RecordProxy;

        // create user edge
        const commentEdge = ConnectionHandler.createEdge(
            store,
            commentConnection as RecordProxy,
            commentNode,
            'CommentEdge'
        );

        connectionUpdater({
            store,
            parentId: ROOT_ID,
            connectionName: 'CommentList_comments',
            edge: commentEdge,
            before: true
        });
    }
};

export default () => {
    const commentAddedConfig = React.useMemo<
        GraphQLSubscriptionConfig<CommentAddedSubscription>
    >(
        () => ({
            subscription: CommentAdded,
            variables: {
                input: {}
            },
            onCompleted: (...args: any) => {
                // eslint-disable-next-line
                console.log('onCompletedCommentAdded: ', args);
            },
            onError: (...args: any) => {
                // eslint-disable-next-line
                console.log('onErrorCommentAdded: ', args);
            },
            onNext: ({ CommentAdded }: CommentAddedSubscriptionResponse) => {
                const { comment } = CommentAdded!;
                const { content } = comment;
                console.log('content: ', content);
            },
            updater
        }),
        []
    );
    requestSubscription(Environment as IEnvironment, commentAddedConfig);
    //   {
    //     CommentAdded,
    //     variables: {
    //       input: {},
    //     },
    //     // onCompleted: (...args) => {
    //     //   // eslint-disable-next-line
    //     //   console.log('onCompleted: ', args);
    //     // },
    //     // onError: (...args) => {
    //     //   // eslint-disable-next-line
    //     //   console.log('onError: ', args);
    //     // },
    //     // onNext: ({CommentAdded}) => {
    //     //   const {comment} = CommentAdded;
    //     //   const {content} = comment;
    //     //   console.log('content: ', content);
    //     // },
    //     updater,
    //   });
};
