import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader
} from '@entria/graphql-mongoose-loader';
import { ConnectionArguments, connectionFromArray } from 'graphql-relay';
import mongoose, { Types } from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;

import WagerModel, { IWager } from './WagerModel';

import { IUser } from '../user/UserModel';

import { GraphQLContext } from '../../TypeDefinition';

export default class Wager {
  id: string;

  _id: Types.ObjectId;

  title: string;

  content: string | null | undefined;

  creator: Types.ObjectId;

  comments: Array<Types.ObjectId>;

  constructor(data: IWager) {
    this.id = data._id;
    this._id = data._id;
    this.title = data.title;
    this.content = data.content;
    this.creator = data.creator;
    this.comments = data.comments
  }
}

export const getLoader = () =>
  new DataLoader((ids: ReadonlyArray<string>) =>
    mongooseLoader(WagerModel, ids)
  );

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  _id: string | Object | ObjectId
): Promise<Wager | null> => {
  if (!_id && typeof _id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.WagerLoader.load(_id as string);
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new Wager(data) : null;
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  _id: Types.ObjectId
) => dataloaders.WagerLoader.clear(_id.toString());

export const primeCache = (
  { dataloaders }: GraphQLContext,
  _id: Types.ObjectId,
  data: IWager
) => dataloaders.WagerLoader.prime(_id.toString(), data);

export const clearAndPrimeCache = (
  context: GraphQLContext,
  _id: Types.ObjectId,
  data: IWager
) => clearCache(context, _id) && primeCache(context, _id, data);

type WagerArgs = ConnectionArguments & {
  search?: string;
};
export const loadWagers = async (context: GraphQLContext, args: WagerArgs) => {
  const where = args.search
    ? { title: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};
  const wagers = WagerModel.find(where, {});
  return connectionFromMongoCursor({
    cursor: wagers,
    context,
    args,
    loader: load
  });
};

export const loadUserWagers = async (
  user: IUser,
  context: GraphQLContext,
  args: WagerArgs
) => {
  const where = args.search
    ? { title: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};

  const wagers = WagerModel.find({ creator: user._id }, where);
  return connectionFromMongoCursor({
    cursor: wagers,
    context,
    args,
    loader: load
  });
};
