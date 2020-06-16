import { GraphQLObjectType } from 'graphql';

import UserQueries from '../../modules/user/queries/users';
import WagerQueries from '../../modules/wager/queries/wagers';
import BetQueries from '../../modules/bet/queries/bets';
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
    ...WagerQueries,
    ...BetQueries,
    ...DonationQueries,
    ...CandidateQueries,
    ...CommentQueries
  }),
});
