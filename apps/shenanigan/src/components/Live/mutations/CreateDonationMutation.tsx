import { graphql } from 'react-relay';

export const CreateDonation = graphql`
    mutation CreateDonationMutation($input: CreateDonationInput!) {
        CreateDonation(input: $input) {
            error
            donationEdge {
                node {
                    id
                    challenge {
                        id
                        totalDonations
                    }
                }
            }
        }
    }
`;
