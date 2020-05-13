import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader,
} from '@entria/graphql-mongoose-loader';
import { ConnectionArguments, connectionFromArray } from 'graphql-relay';
import mongoose, { Types } from 'mongoose';

import { IWager, IUser, IComment, IBet } from '../../../models';
import WagerModel from './WagerModel';

import { GraphQLContext } from '../../TypeDefinition';

declare type ObjectId = mongoose.Schema.Types.ObjectId;

export default class Wager {
  id: string;

  _id: Types.ObjectId;

  title: string;

  live: Boolean;

  content: string | null | undefined;

  options: Array<string>;

  creator: IUser;

  comments: Array<IComment>;

  constructor(data: IWager) {
    this.id = data._id;
    this._id = data._id;
    this.title = data.title;
    this.live = data.live;
    this.content = data.content;
    this.options = data.options;
    this.creator = data.creator;
    this.comments = data.comments;
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
export const loadWagers = (context: GraphQLContext, args: WagerArgs) => {
  const where = args.search
    ? { title: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};
  const wagers = WagerModel.find(where, {});
  console.log('wagers: ', wagers);

  // const transformedWagers = wagers.map((wager)=> transformWager(context, wager))

  return connectionFromMongoCursor({
    cursor: wagers,
    context,
    args,
    loader: load,
  });
};

export const loadUserWagers = (
  user: IUser,
  context: GraphQLContext,
  args: WagerArgs
) => {
  const where = args.search
    ? { title: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};

  const wagers = WagerModel.find({ creator: user._id }, where);

  // const transformedWagers = wagers.map((wager) => transformWager(context,wager));

  return connectionFromMongoCursor({
    cursor: wagers,
    context,
    args,
    loader: load,
  });
};
