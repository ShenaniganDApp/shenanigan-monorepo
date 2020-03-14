const User = require('../UserModel');
const { GraphQLString, GraphQLNonNull, GraphQLID } = require('graphql');

const { connectionArgs, connectionFromArray } = require('graphql-relay');

const { transformUser } = require('../../../merge');

module.exports = {
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
  }
};
