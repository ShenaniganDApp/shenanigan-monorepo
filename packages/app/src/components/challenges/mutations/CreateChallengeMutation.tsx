import { graphql } from 'react-relay';

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
