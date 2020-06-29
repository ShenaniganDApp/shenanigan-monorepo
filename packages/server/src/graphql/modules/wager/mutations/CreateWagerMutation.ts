import WagerModel from '../WagerModel';
import UserModel from '../../user/UserModel';
import { mutationWithClientMutationId, globalIdField } from 'graphql-relay';

// import { pubSub, EVENTS } from ../../pubSub');
import { GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { CandidateModel } from '../../../../models';
import { GraphQLContext } from '../../../TypeDefinition';

export default mutationWithClientMutationId({
  name: 'CreateWager',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    options: {
      type: new GraphQLNonNull(GraphQLList(GraphQLString)),
    },
  },
  mutateAndGetPayload: async (
    { title, content, options },
    { user }: GraphQLContext
  ) => {
    if (!user) {
      throw new Error('Unauthenticated');
    }
    if (options.length < 2) {
      throw new Error('Wager must have at least two options.');
    }
    const creatorId = user._id;
    const existingCandidate = await CandidateModel.findOne({
      creator: creatorId,
    });
    if (existingCandidate) {
      throw new Error('User already has open wager');
    }
    const wager = new WagerModel({
      title,
      content,
      options,
      creator: creatorId,
      live: false,
    });
    try {
      await wager.save();
      const creator = await UserModel.findById(creatorId);
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdWagers.push(wager._id);

      const allCandidates = await CandidateModel.find({});

      const candidate = new CandidateModel({
        id: globalIdField('Candidate'),
        rank: allCandidates.length,
        creator,
        wager,
      });
      await candidate.save();
      // await pubSub.publish(EVENTS.POLL.ADDED, { WagerAdded: { wager } });
      return wager;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  outputFields: {
    _id: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ _id }) => _id,
    },
    title: {
      type: GraphQLString,
      resolve: ({ title }) => title,
    },
    content: {
      type: GraphQLString,
      resolve: ({ content }) => content,
    },
    options: {
      type: GraphQLList(GraphQLString),
      resolve: ({ options }) => options,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
