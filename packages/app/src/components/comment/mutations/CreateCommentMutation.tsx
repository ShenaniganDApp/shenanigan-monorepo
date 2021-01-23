import { graphql } from 'react-relay';

import {
    SelectorStoreUpdater,
    RecordSourceSelectorProxy,
    ConnectionHandler
} from 'relay-runtime';

import { connectionUpdater } from '../../../relay';
import { CreateCommentComposer_me } from '../__generated__/CreateCommentComposer_me.graphql';
import { CreateCommentInput } from './__generated__/CreateCommentMutation.graphql';
import { ROOT_ID } from 'relay-runtime';

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

export const updater = (parentId: string): SelectorStoreUpdater => (
    store: RecordSourceSelectorProxy
) => {
    const root = store.getRootField('CreateComment');
    if (root) {
        const newEdge = root.getLinkedRecord('commentEdge');
        newEdge
            ? connectionUpdater({
                  store,
                  parentId,
                  connectionName: 'CommentList_comments',
                  edge: newEdge,
                  before: true
              })
            : null;
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
    node.setLinkedRecord(meProxy, 'user');

    const newEdge = store.create('client:newEdge:' + tempID + 1, 'CommentEdge');
    newEdge.setLinkedRecord(node, 'node');

    const parentProxy = store.get(ROOT_ID);
    const conn = ConnectionHandler.getConnection(
        parentProxy,
        'CommentList_comments'
    );
    ConnectionHandler.insertEdgeBefore(conn, newEdge);
};
