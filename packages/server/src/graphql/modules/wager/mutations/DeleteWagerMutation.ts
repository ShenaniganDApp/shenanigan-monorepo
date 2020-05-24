import WagerModel from '../WagerModel';

import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';

export default mutationWithClientMutationId({
  name: 'DeleteWager',
  inputFields: {
    wagerId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ wagerId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    const wager = await WagerModel.findOne({ _id: wagerId });
    if(!wager){
      throw new Error("Wager does not exist")
    }
    const existingCreator = wager.creator.toString();
    const creator = req.user._id.toString();

    if (existingCreator != creator) {
      throw new Error('User is not creator');
    }
    await WagerModel.deleteOne({ _id: wagerId });
    return
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
