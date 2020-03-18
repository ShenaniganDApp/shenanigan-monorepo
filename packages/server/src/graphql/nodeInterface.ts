import DataLoader from 'dataloader';
import * as loaders from './loaders';
import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import { GraphQLObjectType } from 'graphql';
import { GraphQLContext } from './TypeDefinition';
import {transformWager, transformUser} from './merge'
import {WagerModel, UserModel} from '../models';

type RegisteredTypes = {
  [key: string]: GraphQLObjectType;
};

const registeredTypes: RegisteredTypes = {};

export function registerType(type: GraphQLObjectType) {
  registeredTypes[type.name] = type;
  return type;
}

type Loader = {
  load: (context: GraphQLContext, id: string) => Promise<any>;
  getLoader: () => DataLoader<string, any>;
};

export type Loaders = {
  [key: string]: Loader;
};
export const { nodeField, nodeInterface } = nodeDefinitions(
  async (globalId, context: GraphQLContext) => {
    const { type, id } = fromGlobalId(globalId);
    const loader: Loader = (loaders as Loaders)[`${type}Loader`];
    console.log(loader)
    return (loader && loader.load(context, id)) || null;
  },
  object => registeredTypes[object.constructor.name] || null
);
