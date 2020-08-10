import { GraphQLObjectType } from 'graphql';

import UserQueries from '../../modules/user/queries/users';
import ChallengeQueries from '../../modules/challenge/queries/challenges';
import PredictionQueries from '../../modules/prediction/queries/predictions';
import DonationQueries from '../../modules/donation/queries/donations';
import CandidateQueries from '../../modules/candidate/queries/candidates';
import CommentQueries from '../../modules/comment/queries/comments';

import { nodeField } from '../../nodeInterface';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    ...UserQueries,
    ...ChallengeQueries,
    ...PredictionQueries,
    ...DonationQueries,
    ...CandidateQueries,
    ...CommentQueries
  }),
});
