const Wager = require('../../models/wager');
const { GraphQLString, GraphQLNonNull, GraphQLID } = require('graphql');

const { connectionArgs, connectionFromArray } = require('graphql-relay');

const { transformWager } = require('../merge');

module.exports = {
  wager: {
    type: require('./wagerType').WagerType,
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
    type: require('./wagerType').WagerConnection.connectionType,
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
};
