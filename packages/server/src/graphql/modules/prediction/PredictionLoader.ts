import PredictionModel, { IPrediction } from './PredictionModel';
import { IChallenge, IComment, IUser } from '../../../models';

import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader,
} from '@entria/graphql-mongoose-loader';
import { ConnectionArguments, connectionFromArray } from 'graphql-relay';
import mongoose, { Types } from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;

import { GraphQLContext } from '../../TypeDefinition';

export default class Prediction {
  id: string;

  _id: Types.ObjectId;

  amount: Number;

  option: Number;

  challenge: IChallenge;

  creator: IUser;

  comment: IComment;

  constructor(data: IPrediction) {
    this.id = data._id;
    this._id = data._id;
    this.amount = data.amount;
    this.option = data.option;
    this.challenge = data.challenge;
    this.creator = data.creator;
    this.comment = data.comment;
  }
}

export const getLoader = () =>
  new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(PredictionModel, ids));

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  _id: string | Object | ObjectId
): Promise<Prediction | null> => {
  if (!_id && typeof _id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.PredictionLoader.load(_id as string);
  } catch (err) {
    return null;
  }

  return viewerCanSee() ? new Prediction(data) : null;
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId
) => dataloaders.PredictionLoader.clear(id.toString());

export const primeCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId,
  data: IPrediction
) => dataloaders.PredictionLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (
  context: GraphQLContext,
  id: Types.ObjectId,
  data: IPrediction
) => clearCache(context, id) && primeCache(context, id, data);

type PredictionArgs = ConnectionArguments & {
  search?: string;
};
export const loadPredictions = async (context: GraphQLContext, args: PredictionArgs) => {
  const where = args.search
    ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};
  const predictions = PredictionModel.find(where, {});
  return connectionFromMongoCursor({
    cursor: predictions,
    context,
    args,
    loader: load,
  });
};

export const loadChallengePredictions = async (
  challenge: IChallenge,
  context: GraphQLContext,
  args: PredictionArgs
) => {
  const where = args.search
    ? { content: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};

  const predictions = PredictionModel.find({ challenge: challenge._id }, where);

  return connectionFromMongoCursor({
    cursor: predictions,
    context,
    args,
    loader: load,
  });
};

export const loadUserPredictions = async (
  user: IUser,
  context: GraphQLContext,
  args: PredictionArgs
) => {
  const where = args.search
    ? { content: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};

  const predictions = PredictionModel.find({ creator: user._id }, where);

  return connectionFromMongoCursor({
    cursor: predictions,
    context,
    args,
    loader: load,
  });
};

