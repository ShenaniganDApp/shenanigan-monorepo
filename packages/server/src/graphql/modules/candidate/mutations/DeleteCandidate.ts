import CandidateModel from '../CandidateModel';

import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { GraphQLContext } from '../../../TypeDefinition';

export default mutationWithClientMutationId({
  name: 'DeleteCandidate',
  inputFields: {
    candidate: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({candidate}, { user }: GraphQLContext) => {
    if (!user) {
      throw new Error('Unauthenticated');
    }
    const existingCandidate = await CandidateModel.findOne({ _id: candidate });
    if (!existingCandidate) {
        throw new Error('Candidate does not exist');
      }

    const creator = user._id.toString();
    const candidateCreator = existingCandidate.creator.toString();
    if (candidateCreator !== creator) {
      throw new Error('User is not creator');
    }
    await CandidateModel.deleteOne({ _id: candidate });
  },

  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
