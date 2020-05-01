import BetModel from '../BetModel';
import WagerModel from '../../wager/WagerModel';
import UserModel from '../../user/UserModel';
import CommentModel from '../../comment/CommentModel'

import { mutationWithClientMutationId, globalIdField } from 'graphql-relay';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
} from 'graphql';

export default mutationWithClientMutationId({
  name: 'CreateBetModel',
  inputFields: {
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    option: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    wagerId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async ({ amount, option, wagerId, content }, req) => {
    if (amount <= 0) {
      throw new Error('Not a valid bet amount');
    }
    const existingWager = await WagerModel.findOne({ _id: wagerId });
    if (!existingWager.live) {
      throw new Error('Wager is not open');
    }
    const creator = req.user._id;
    const existingBet = await BetModel.findOne({
      wager: wagerId,
    });
    if (existingBet) {
      existingBet.amount += amount;
      const updatedBet = await existingBet.save();
      return { amount: updatedBet.amount };
    }
    const comment = new CommentModel({
      id: globalIdField('Comment'),
      content,
      creator,
      wager: wagerId,
    });
    const createdComment = await comment.save();
    existingWager.comments.push(createdComment._id);
    const bet = new BetModel({
      id: globalIdField('Bet'),
      amount,
      option,
      creator,
      wager: wagerId,
      comment,
    });

    const createdBet = await bet.save();
    existingWager.bets.push(bet._id);
    await existingWager.save();
    const wagerCreator = await UserModel.findById(req.user._id);
    if (!wagerCreator) {
      throw new Error('User not found.');
    }
    wagerCreator.bets.push(bet._id);
    await creator.save();
    return {
      amount: createdBet.amount,
      option: createdBet.option,
    };
  },
  outputFields: {
    amount: {
      type: GraphQLFloat,
      resolve: ({ amount }) => amount,
    },
    option: {
      type: GraphQLInt,
      resolve: ({ option }) => option,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
