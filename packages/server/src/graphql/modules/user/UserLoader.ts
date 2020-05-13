import UserModel, { IUser } from './UserModel';
import { IWager, IComment, IBet } from '../../../models';

import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader,
} from '@entria/graphql-mongoose-loader';
import { ConnectionArguments, connectionFromArray } from 'graphql-relay';
import mongoose, { Types } from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;



import { GraphQLContext } from '../../TypeDefinition';

export default class User {
  id: string;

  _id: Types.ObjectId;

  username: string;

  email: string;

  createdWagers: IWager[];

  constructor(data: IUser, { user }: GraphQLContext) {
    this.id = data._id;
    this._id = data._id;
    this.username = data.username;
    this.createdWagers = data.createdWagers;
    // you can only see your own email, and your active status
    if (user && user._id.equals(data._id)) {
      this.email = data.email;
    }
  }
}

export const getLoader = () =>
  new DataLoader((ids: ReadonlyArray<string>) =>
    mongooseLoader(UserModel, ids)
  );

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  _id: string | Object | ObjectId
): Promise<User | null> => {
  if (!_id && typeof _id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.UserLoader.load(_id as string);
  } catch (err) {
    return null;
  }

  return viewerCanSee() ? new User(data, context) : null;
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId
) => dataloaders.UserLoader.clear(id.toString());

export const primeCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId,
  data: IUser
) => dataloaders.UserLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (
  context: GraphQLContext,
  id: Types.ObjectId,
  data: IUser
) => clearCache(context, id) && primeCache(context, id, data);

type UserArgs = ConnectionArguments & {
  search?: string;
};
export const loadUsers = async (context: GraphQLContext, args: UserArgs) => {
  const where = args.search
    ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};
  const users = UserModel.find(where, {});

  return connectionFromMongoCursor({
    cursor: users,
    context,
    args,
    loader: load,
  });
};
