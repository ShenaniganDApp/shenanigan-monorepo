const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean
} = require('graphql');
const User = require('../../../models/user');
const Wager = require('../../../models/wager');
// const Comment = require('../../../models/comment');
const { connectionArgs, connectionFromArray } = require('graphql-relay');

const {
  transformUser,
  transformWager
  // transformBet,
  // transformComment
} = require('../../merge');
const { nodeField } = require('../../nodeInterface');

module.exports = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    me: {
      type: require('../../user/userType').UserType,
      resolve: (root, args, context) =>
        context.user ? User.findOne({ _id: context.user._id }) : null
    },
    user: {
      type: require('../../user/userType').UserType,
      args: {
        _id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve: async (obj, args, context) => {
        if (!args._id) {
          throw new Error('User does not exist');
        }

        user = await User.findOne({ _id: args._id });
        return transformUser(user);
      }
    },
    users: {
      type: require('../../user/userType').UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString
        }
      },
      resolve: async (obj, args, context) => {
        const where = args.search
          ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } }
          : {};
        const users = await User.find(where, {});
        users.map(user => {
          return transformUser(user);
        });
        result = connectionFromArray(users, args);
        result.totalCount = users.length;
        result.count = result.edges.length;
        return result;
      }
    },
    wager: {
      type: require('../../wager/wagerType').WagerType,
      args: {
        _id: {
          type: GraphQLNonNull(GraphQLID)
        }
      },
      resolve: async (obj, args, context) => {
        if (!args._id) {
          throw new Error('User does not exist');
        }
        wager = await Wager.findOne({ _id: args._id });
        return transformWager(wager);
      }
    },
    wagers: {
      type: require('../../wager/wagerType').WagerConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString
        }
      },
      resolve: async (obj, args, context) => {
        const where = args.search
          ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } }
          : {};
        const wagers = await Wager.find(where, {});
        wagers.map(wager => {
          return transformWager(wager);
        });
        result = connectionFromArray(wagers, args);
        result.totalCount = wagers.length;
        result.count = result.edges.length;
        return result;
      }
    }
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
