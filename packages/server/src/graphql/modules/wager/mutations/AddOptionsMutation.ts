import WagerModel from '../WagerModel';

import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';

export default mutationWithClientMutationId({
  name: 'AddOptions',
  inputFields: {
    options: {
      type: new GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString)))
    },
    wagerId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ options, wagerId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    const wager = await WagerModel.findById(wagerId);
    if (!wager) {
      throw new Error('Wager not found.');
    }

    const addedOptions = await wager.options.concat(options);
    if (addedOptions.length < 2) {
      throw new Error('Wager must have at least two options.');
    }
    wager.options = addedOptions;
    const result = await wager.save();
    return { options: result.options };
  },
  outputFields: {
    options: {
      type: GraphQLList(GraphQLString),
      resolve: ({ options }) => options
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
