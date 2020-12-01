import { graphql } from 'react-relay';

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
