import { GraphQLObjectType } from 'graphql';

import { nodeField, nodesField } from '../../modules/node/typeRegister';
import ChallengeQueries from '../../modules/challenge/queries/challenges';
import CommentQueries from '../../modules/comment/queries/comments';
import DonationQueries from '../../modules/donation/queries/donations';
import PredictionQueries from '../../modules/prediction/queries/predictions';
import { UserQueries } from '../../modules/user/queries/users';
import { ChallengeCardQueries } from '../../modules/challengecard/queries/challengecards';

export const QueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'The root of all... queries',
	fields: () => ({
		node: nodeField,
		nodes: nodesField,
		...UserQueries,
		...ChallengeQueries,
		...PredictionQueries,
		...DonationQueries,
		...CommentQueries,
		...ChallengeCardQueries,
	}),
});
