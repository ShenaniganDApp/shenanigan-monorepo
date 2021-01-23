import { graphql } from 'react-relay';
import { ConnectionHandler, RecordSourceSelectorProxy, ROOT_ID, SelectorStoreUpdater } from 'relay-runtime';
import { connectionUpdater } from '../../../relay';
import { CreateChallengeInput } from './__generated__/CreateChallengeMutation.graphql';

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
                    active
                }
            }
        }
    }
`;

export const updater = (parentId: string): SelectorStoreUpdater => (
    store: RecordSourceSelectorProxy
) => {
    const root = store.getRootField('CreateChallenge');
    if (root) {
        const newEdge = root.getLinkedRecord('challengeEdge');
        newEdge
            ? connectionUpdater({
                  store,
                  parentId,
                  connectionName: 'LineupList_activeChallenges',
                  edge: newEdge,
                  before: true
              })
            : null;
        //@TODO handle error
    }
};

const tempID = 0;
export const optimisticUpdater = (
    input: CreateChallengeInput,
) => (store: RecordSourceSelectorProxy) => {
    const id = 'client:newChallenge:' + tempID + 1;

    const node = store.create(id, 'Comment');

    node.setValue(id, 'id');
    node.setValue(input.address, 'address');
    node.setValue(input.title, "title")
    node.setValue(input.content,"content")
    node.setValue(input.positiveOptions, "positiveOptions")
    node.setValue(input.negativeOptions, "negativeOptions")

    const newEdge = store.create('client:newEdge:' + tempID + 1, 'ChallengeEdge');
    newEdge.setLinkedRecord(node, 'node');

    const parentProxy = store.get(ROOT_ID);
    const conn = ConnectionHandler.getConnection(
        parentProxy,
        'LineupList_challenges'
    );
    ConnectionHandler.insertEdgeBefore(conn, newEdge);
};
