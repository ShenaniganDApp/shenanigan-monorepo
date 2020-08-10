import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader,
} from '@entria/graphql-mongoose-loader';
import { ConnectionArguments, connectionFromArray } from 'graphql-relay';
import mongoose, { Types } from 'mongoose';

import { IChallenge, IUser, IComment, IPrediction } from '../../../models';
import ChallengeModel from './ChallengeModel';

import { GraphQLContext } from '../../TypeDefinition';

declare type ObjectId = mongoose.Schema.Types.ObjectId;

export default class Challenge {
  id: string;

  _id: Types.ObjectId;

  title: string;

  live: Boolean;

  content: string | null | undefined;

  options: Array<string>;

  creator: IUser;

  comments: Array<IComment>;

  constructor(data: IChallenge) {
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
    mongooseLoader(ChallengeModel, ids)
  );

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  _id: string | Object | ObjectId
): Promise<Challenge | null> => {
  if (!_id && typeof _id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.ChallengeLoader.load(_id as string);
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new Challenge(data) : null;
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  _id: Types.ObjectId
) => dataloaders.ChallengeLoader.clear(_id.toString());

export const primeCache = (
  { dataloaders }: GraphQLContext,
  _id: Types.ObjectId,
  data: IChallenge
) => dataloaders.ChallengeLoader.prime(_id.toString(), data);

export const clearAndPrimeCache = (
  context: GraphQLContext,
  _id: Types.ObjectId,
  data: IChallenge
) => clearCache(context, _id) && primeCache(context, _id, data);

type ChallengeArgs = ConnectionArguments & {
  search?: string;
};
export const loadChallenges = (context: GraphQLContext, args: ChallengeArgs) => {
  const where = args.search
    ? { title: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};
  const challenges = ChallengeModel.find(where, {});
  console.log('challenges: ', challenges);

  // const transformedChallenges = challenges.map((challenge)=> transformChallenge(context, challenge))

  return connectionFromMongoCursor({
    cursor: challenges,
    context,
    args,
    loader: load,
  });
};

export const loadUserChallenges = (
  user: IUser,
  context: GraphQLContext,
  args: ChallengeArgs
) => {
  const where = args.search
    ? { title: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};

  const challenges = ChallengeModel.find({ creator: user._id }, where);

  // const transformedChallenges = challenges.map((challenge) => transformChallenge(context,challenge));

  return connectionFromMongoCursor({
    cursor: challenges,
    context,
    args,
    loader: load,
  });
};
