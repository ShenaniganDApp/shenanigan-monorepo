import { graphql } from 'react-relay';
import {
    ConnectionHandler,
    RecordSourceSelectorProxy,
    ROOT_ID
} from 'relay-runtime';

import { connectionUpdater } from '../../../relay';

export const CommentAdded = graphql`
    subscription CommentAddedSubscription($input: CommentAddedInput!) {
        CommentAdded(input: $input) {
            comment {
                id
                content
                creator {
                    id
                    username
                }
            }
        }
    }
`;

export const updater = (store: RecordSourceSelectorProxy) => {
    const commentNode = store
        .getRootField('CommentAdded')
        .getLinkedRecord('comment');

    const commentId = commentNode.getValue('id');
    console.log('commentId: ', commentId);

    const commentStore = store.get(commentId);

    // avoid mutation + subscription update
    if (!commentStore) {
        const commentConnection = ConnectionHandler.getConnection(
            store.getRoot(),
            'CommentList_comments'
        );

        // create user edge
        if (commentConnection) {
            const commentEdge = ConnectionHandler.createEdge(
                store,
                commentConnection,
                commentNode,
                'CommentEdge'
            );
            console.log('commentEdge: ', commentEdge);

            connectionUpdater({
                store,
                parentId: ROOT_ID,
                connectionName: 'CommentList_comments',
                edge: commentEdge,
                before: true
            });
        }
    }
};
