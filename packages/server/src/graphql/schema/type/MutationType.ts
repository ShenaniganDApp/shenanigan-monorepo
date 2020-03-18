import { GraphQLObjectType } from'graphql';

import UserMutations from '../../modules/user/mutations';
import WagerMutations from '../../modules/wager/mutations';
// import BetMutations from'../../bet/mutations');
// import CommentMutations from'../../comment/mutations');

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...WagerMutations,
    // ...BetMutations,
    // ...CommentMutations
  })
});
