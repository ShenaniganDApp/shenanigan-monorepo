import UserModel from '../UserModel';
import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { GraphQLContext } from '../../../TypeDefinition';

export default mutationWithClientMutationId({
  name: 'Delete',
  inputFields: {
    _id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ _id }, { user }: GraphQLContext) => {
    if (!user) {
      throw new Error('Deleting requires authentication');
    }
    if (!user) {
      throw new Error('User does not exist');
    }
    UserModel.deleteOne({ _id: _id }, err => {
      if (err) {
        throw new Error(err.message);
      }
    });
    return {
      message: `User with username: "${user.username}" was deleted`
    };
  },
  outputFields: {
    // id: {
    //   type: GraphQLID,
    //   resolve: ({ userId }) => userId
    // },
    message: {
      type: GraphQLString,
      resolve: ({ message }) => message
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
