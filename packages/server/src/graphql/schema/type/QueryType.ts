import { GraphQLObjectType } from 'graphql';

import UserQueries from '../../modules/user/queries/users';
import ChallengeQueries from '../../modules/challenge/queries/challenges';
import PredictionQueries from '../../modules/prediction/queries/predictions';
import DonationQueries from '../../modules/donation/queries/donations';
import CommentQueries from '../../modules/comment/queries/comments';

import { nodesField, nodeField } from '../../modules/node/typeRegister';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    ...UserQueries,
    ...ChallengeQueries,
    ...PredictionQueries,
    ...DonationQueries,
    ...CommentQueries
  }),
});
