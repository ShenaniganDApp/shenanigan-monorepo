import { commitMutation, graphql } from 'react-relay';
import { Environment } from '../../relay';
import {DeclarativeMutationConfig} from "relay-runtime"
import {
    CreateCommentInput,
    CreateCommentMutationResponse
} from './__generated__/CreateCommentMutation.graphql';

const mutation = graphql`
    mutation CreateCommentMutation($input: CreateCommentInput!) {
        CreateComment(input: $input) {
            content
        }
    }
`;

function commit(
    input: CreateCommentInput,
    onCompleted: (response: CreateCommentMutationResponse) => void,
    onError: (error: Error) => void
) {
    return commitMutation(Environment, {
        mutation,
        variables: {
            input
        },
        onCompleted,
        onError
    });
}

export default { commit };
