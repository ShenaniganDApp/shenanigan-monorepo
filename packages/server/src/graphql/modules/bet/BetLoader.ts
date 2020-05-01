import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader,
} from '@entria/graphql-mongoose-loader';
import { ConnectionArguments, connectionFromArray } from 'graphql-relay';
import mongoose, { Types } from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;

import BetModel, { IBet } from './BetModel';

import { GraphQLContext } from '../../TypeDefinition';
import { IWager, IComment, IUser } from '../../../models';

export default class Bet {
  id: string;

  _id: Types.ObjectId;

  amount: Number;

  option: Number;

  wager: Types.ObjectId;

  creator: Types.ObjectId;

  comment: Types.ObjectId;

  constructor(data: IBet) {
    this.id = data._id;
    this._id = data._id;
    this.amount = data.amount;
    this.option = data.option;
    this.wager = data.wager;
    this.creator = data.creator;
    this.comment = data.comment;
  }
}

export const getLoader = () =>
  new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(BetModel, ids));

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  _id: string | Object | ObjectId
): Promise<Bet | null> => {
  if (!_id && typeof _id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.BetLoader.load(_id as string);
  } catch (err) {
    return null;
  }

  return viewerCanSee() ? new Bet(data) : null;
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId
) => dataloaders.BetLoader.clear(id.toString());

export const primeCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId,
  data: IBet
) => dataloaders.BetLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (
  context: GraphQLContext,
  id: Types.ObjectId,
  data: IBet
) => clearCache(context, id) && primeCache(context, id, data);

type BetArgs = ConnectionArguments & {
  search?: string;
};
export const loadBets = async (context: GraphQLContext, args: BetArgs) => {
  const where = args.search
    ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};
  const bets = BetModel.find(where, {});
  return connectionFromMongoCursor({
    cursor: bets,
    context,
    args,
    loader: load,
  });
};

export const loadWagerBets = async (
  wager: IWager,
  context: GraphQLContext,
  args: BetArgs
) => {
  const where = args.search
    ? { content: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};

  const bets = BetModel.find({ wager: wager._id }, where);

  return connectionFromMongoCursor({
    cursor: bets,
    context,
    args,
    loader: load,
  });
};

export const loadUserBets = async (
  user: IUser,
  context: GraphQLContext,
  args: BetArgs
) => {
  const where = args.search
    ? { content: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};

  const bets = BetModel.find({ creator: user._id }, where);

  return connectionFromMongoCursor({
    cursor: bets,
    context,
    args,
    loader: load,
  });
};

