import { GraphQLObjectType } from 'graphql';

import UserMutations from '../../modules/user/mutations';
import WagerMutations from '../../modules/wager/mutations';
import BetMutations from '../../modules/bet/mutations';
import CommentMutations from '../../modules/comment/mutations';
import DonationMutations from '../../modules/donation/mutations';
import CandidateMutations from '../../modules/candidate/mutations'

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...WagerMutations,
    ...BetMutations,
    ...CommentMutations,
    ...DonationMutations,
    ...CandidateMutations
  }),
});
