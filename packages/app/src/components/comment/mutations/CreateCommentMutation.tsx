import { graphql } from 'react-relay';

import {
    SelectorStoreUpdater,
    RecordSourceSelectorProxy,
    ConnectionHandler,
    ROOT_ID
} from 'relay-runtime';

import { connectionUpdater } from '../../../relay';
import { CreateCommentComposer_me } from '../__generated__/CreateCommentComposer_me.graphql';
import { CreateCommentInput } from './__generated__/CreateCommentMutation.graphql';

export const CreateComment = graphql`
    mutation CreateCommentMutation($input: CreateCommentInput!) {
        CreateComment(input: $input) {
            error
            commentEdge {
                node {
                    id
                    content
                    creator {
                        id
                        username
                    }
                }
            }
        }
    }
`;

export const updater = (): SelectorStoreUpdater => (
    store: RecordSourceSelectorProxy
) => {
    const root = store.getRootField('CreateComment');
    if (root) {
        const newEdge = root.getLinkedRecord('commentEdge');
        if (newEdge) {
            connectionUpdater({
                store,
                parentId: ROOT_ID,
                connectionName: 'CommentList_comments',
                edge: newEdge,
                before: true
            });
            connectionUpdater({
                store,
                parentId: ROOT_ID,
                connectionName: 'LiveChatList_comments',
                edge: newEdge,
                before: true
            });
        } else {
            return null;
        }
        //@TODO handle error
    }
};

let tempID = 0;

export const optimisticUpdater = (
    input: CreateCommentInput,
    me: CreateCommentComposer_me
) => (store: RecordSourceSelectorProxy) => {
    const id = 'client:newComment:' + tempID + 1;

    const node = store.create(id, 'Comment');

    const meProxy = store.get(me.id);

    node.setValue(id, 'id');
    node.setValue(input.content, 'content');
    node.setLinkedRecord(meProxy, 'creator');

    const newEdge = store.create('client:newEdge:' + tempID + 1, 'CommentEdge');
    newEdge.setLinkedRecord(node, 'node');

    const parentProxy = store.get(ROOT_ID);
    const commentListConn = ConnectionHandler.getConnection(
        parentProxy,
        'CommentList_comments'
    );

    const liveChatConn = ConnectionHandler.getConnection(
        parentProxy,
        'LiveChatList_comments'
    );

    ConnectionHandler.insertEdgeBefore(commentListConn, newEdge);
    ConnectionHandler.insertEdgeBefore(liveChatConn, newEdge);
};
