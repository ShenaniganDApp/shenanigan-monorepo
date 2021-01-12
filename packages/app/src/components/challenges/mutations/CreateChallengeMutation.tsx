import { graphql } from 'react-relay';

import {
    SelectorStoreUpdater,
    RecordSourceSelectorProxy,
    ConnectionHandler
} from 'relay-runtime';

import { connectionUpdater } from '../../../relay';
import { ROOT_ID } from 'relay-runtime';

export const CreateChallenge = graphql`
    mutation CreateChallengeMutation($input: CreateChallengeInput!) {
        CreateChallenge(input: $input) {
            error
            challengeEdge {
                node {
                    _id
                    id
                    title
                    content
                    positiveOptions
                    negativeOptions
                    address
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

// export const optimisticUpdater = (
//     challengeStoreId: string,
//     input: CreateCommentInput,
//     me: CreateCommentComposer_me
// ) => (store: RecordSourceSelectorProxy) => {
//     const id = 'client:newComment:' + tempID + 1;

//     const node = store.create(id, 'Comment');

//     const meProxy = store.get(me.id);

//     node.setValue(id, 'id');
//     node.setValue(input.content, 'content');
//     node.setLinkedRecord(meProxy, 'user');

//     const newEdge = store.create('client:newEdge:' + tempID + 1, 'CommentEdge');
//     newEdge.setLinkedRecord(node, 'node');

//     const parentProxy = store.get(ROOT_ID);
//     const conn = ConnectionHandler.getConnection(
//         parentProxy,
//         'CommentList_comments'
//     );
//     console.log('conn: ', conn);
//     ConnectionHandler.insertEdgeBefore(conn, newEdge);
// };
