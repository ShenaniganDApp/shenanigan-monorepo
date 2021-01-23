import { graphql } from 'react-relay';

export const ToggleActive = graphql`
    mutation ToggleActiveMutation($input: ToggleActiveInput!) {
        ToggleActive(input: $input) {
            error
            challenge {
                _id
                id
                active
            }
        }
    }
`;

export const toggleActiveOptimisticResponse = challenge => ({
    ToggleActive: {
        error: null,
        challenge: {
            id: challenge.id,
            _id: challenge._id,
            active: !challenge.active
        }
    }
});
