import { graphql } from 'react-relay';
import {
    ConnectionHandler,
    RecordSourceSelectorProxy,
    ROOT_ID,
    SelectorStoreUpdater
} from 'relay-runtime';
import { connectionUpdater } from '../../../relay';
import { ChallengeForm_me } from '../__generated__/ChallengeForm_me.graphql';
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

export const updater = (meId: string): SelectorStoreUpdater => (
    store: RecordSourceSelectorProxy
) => {
    const root = store.getRootField('CreateChallenge');
    if (root) {
        const newEdge = root.getLinkedRecord('challengeEdge');
        if (newEdge) {
            connectionUpdater({
                store,
                parentId: ROOT_ID,
                connectionName: 'LineupList_activeChallenges',
                edge: newEdge,
                before: true
            });
            connectionUpdater({
                store,
                parentId: meId,
                connectionName: 'UserChallengesList_createdChallenges',
                edge: newEdge,
                before: true
            });
        }
        //@TODO handle error
    }
};

const tempID = 0;
export const optimisticUpdater = (
    input: CreateChallengeInput,
    me: ChallengeForm_me
) => (store: RecordSourceSelectorProxy) => {
    const id = 'client:newChallenge:' + tempID + 1;

    const node = store.create(id, 'Challenge');

    node.setValue(id, 'id');
    node.setValue(input.address, 'address');
    node.setValue(input.title, 'title');
    node.setValue(input.content, 'content');
    node.setValue(input.positiveOptions, 'positiveOptions');
    node.setValue(input.negativeOptions, 'negativeOptions');
    node.setValue(true, 'active');

    const newEdge = store.create(
        'client:newEdge:' + tempID + 1,
        'ChallengeEdge'
    );
    newEdge.setLinkedRecord(node, 'node');

    const rootProxy = store.get(ROOT_ID);
    const meProxy = store.get(me.id);
    // const lineupConn = ConnectionHandler.getConnection(
    //     rootProxy,
    //     'LineupList_challenges'
    // );
    // ConnectionHandler.insertEdgeBefore(lineupConn, newEdge);

    const userChallengesConn = ConnectionHandler.getConnection(
        meProxy,
        'UserChallengesList_createdChallenges'
    );
    console.log('userChallengesConn: ', userChallengesConn);
    ConnectionHandler.insertEdgeBefore(userChallengesConn, newEdge);
};
