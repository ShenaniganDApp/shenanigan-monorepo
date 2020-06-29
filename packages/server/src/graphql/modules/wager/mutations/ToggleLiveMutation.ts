import WagerModel from '../WagerModel';

import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { GraphQLContext } from '../../../TypeDefinition';

export default mutationWithClientMutationId({
  name: 'ToggleLive',
  inputFields: {
    wagerId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ wagerId }, { user }: GraphQLContext) => {
    if (!user) {
      throw new Error('Unauthenticated');
    }
    const wager = await WagerModel.findOne({ _id: wagerId });
    console.log(wager);
    if (wager.live) {
      wager.live = false;
      const result = await wager.save();
      return { live: result.live };
    }
    if (wager.options.length < 2) {
      throw new Error('WagerModel must have at least two options.');
    }
    wager.live = true;
    const result = await wager.save();
    return { live: result.live };
  },

  outputFields: {
    live: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: ({ live }) => live
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
