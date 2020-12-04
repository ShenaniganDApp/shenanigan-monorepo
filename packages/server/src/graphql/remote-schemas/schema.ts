
import { makeExecutableSchema } from 'graphql-tools';

import { getBoxProfile } from './resolvers/getBoxProfile';
import { typeDefs } from './typeDefs';

const resolvers = {
  Query: {
    getBoxProfile,
  },
};

export const remoteSchema = makeExecutableSchema({ typeDefs, resolvers });