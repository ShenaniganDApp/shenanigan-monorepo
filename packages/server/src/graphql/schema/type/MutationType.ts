import { GraphQLObjectType } from 'graphql';

import UserMutations from '../../modules/user/mutations';
import ChallengeMutations from '../../modules/challenge/mutations';
import PredictionMutations from '../../modules/prediction/mutations';
import CommentMutations from '../../modules/comment/mutations';
import DonationMutations from '../../modules/donation/mutations';
import CandidateMutations from '../../modules/candidate/mutations'

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...ChallengeMutations,
    ...PredictionMutations,
    ...CommentMutations,
    ...DonationMutations,
    ...CandidateMutations
  }),
});
