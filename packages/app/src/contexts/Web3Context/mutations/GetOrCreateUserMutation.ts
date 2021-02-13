import { graphql } from 'react-relay';
import { RecordSourceSelectorProxy, SelectorStoreUpdater } from 'relay-runtime';
import { CreateCommentComposer_me } from 'src/components/comment/__generated__/CreateCommentComposer_me.graphql';

export const GetOrCreateUser = graphql`
    mutation GetOrCreateUserMutation($input: GetOrCreateUserInput!) {
        GetOrCreateUser(input: $input) {
            user {
                id
                addresses
                username
            }
            error
        }
    }
`;
;
// export const getOrCreateUserOptimisticResponse = (user) => ({
//     GetOrCreateUser: {
//         error: null,
//         user: {
//             id: user.id,
//             addresses: [user.address],
//             username: user.username
//         }
//     }
// });
