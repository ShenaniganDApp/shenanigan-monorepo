import { GraphQLObjectType } from 'graphql';

import UserQueries from '../../modules/user/queries/users';
import WagerQueries from '../../modules/wager/queries/wagers';
import BetQueries from '../../modules/bet/queries/bets';
import DonationQueries from '../../modules/donation/queries/donations'
import CandidateQueries from '../../modules/candidate/queries/candidates'
// import CommentQueries from '../../comment/queries/comments'


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
    ...CandidateQueries
    // comments: {
    //   type: require('../../comment/commentType').CommentConnection
    //     .connectionType,
    //   args: {
    //     ...connectionArgs,
    //     search: {
    //       type: GraphQLString
    //     }
    //   },

    //   resolve: async (obj, args, context) => {
    //     const where = args.search
    //       ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    //       : {};
    //     const comments = await Comment.find(where, {});
    //     comments.map(comment => {
    //       return transformComment(comment);
    //     });
    //     result = connectionFromArray(comments, args);
    //     result.totalCount = comments.length;
    //     result.count = result.edges.length;
    //     return result;
    //   }
    // }
  })
});
