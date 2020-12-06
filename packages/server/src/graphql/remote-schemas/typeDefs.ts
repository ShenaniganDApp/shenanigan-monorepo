import { gql } from 'graphql-request/dist';

export const typeDefs = gql`
	type Query {
		getBoxProfile(address: String): BoxProfile
	}
	type BoxProfile {
		ethereumAddress: String
		name: String
		description: String
		location: String
		job: String
		emoji: String
		imageUrl: String
		coverImageUrl: String
		website: String
	}
`;
