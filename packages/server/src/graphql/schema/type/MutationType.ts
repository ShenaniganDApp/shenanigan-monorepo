import { GraphQLObjectType } from 'graphql';

import * as ChallengeMutations from '../../modules/challenge/mutations';
import * as ChallengeCardMutations from '../../modules/challengecard/mutations';
import * as CommentMutations from '../../modules/comment/mutations';
import DonationMutations from '../../modules/donation/mutations';
import PredictionMutations from '../../modules/prediction/mutations';
import * as UserMutations from '../../modules/user/mutations';

export const MutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		...UserMutations,
		...ChallengeMutations,
		...PredictionMutations,
		...CommentMutations,
		...DonationMutations,
		...ChallengeCardMutations,
	}),
});
