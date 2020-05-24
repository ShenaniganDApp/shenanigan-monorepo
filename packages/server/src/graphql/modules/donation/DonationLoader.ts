import DonationModel, { IDonation } from './DonationModel';
import { IUser, IComment } from '../../../models';

import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader,
} from '@entria/graphql-mongoose-loader';
import { ConnectionArguments, connectionFromArray } from 'graphql-relay';
import mongoose, { Types } from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;



import { GraphQLContext } from '../../TypeDefinition';
import { ICandidate } from '../candidate/CandidateModel';


export default class Donation {
  id: string;

  _id: Types.ObjectId;

  amount: Number;

  creator: IUser;

  comment: IComment;

  constructor(data: IDonation) {
    this.id = data._id;
    this._id = data._id;
    this.amount = data.amount;
    this.creator = data.creator;
    this.comment = data.comment;
  }
}

export const getLoader = () =>
  new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(DonationModel, ids));

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  _id: string | Object | ObjectId
): Promise<Donation | null> => {
  if (!_id && typeof _id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.DonationLoader.load(_id as string);
  } catch (err) {
    return null;
  }

  return viewerCanSee() ? new Donation(data) : null;
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId
) => dataloaders.DonationLoader.clear(id.toString());

export const primeCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId,
  data: IDonation
) => dataloaders.DonationLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (
  context: GraphQLContext,
  id: Types.ObjectId,
  data: IDonation
) => clearCache(context, id) && primeCache(context, id, data);

type DonationArgs = ConnectionArguments & {
  search?: string;
};
export const loadDonations = async (context: GraphQLContext, args: DonationArgs) => {
  const where = args.search
    ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};
  const donations = DonationModel.find(where, {});
  return connectionFromMongoCursor({
    cursor: donations,
    context,
    args,
    loader: load,
  });
};

export const loadUserDonations = async (
  user: IUser,
  context: GraphQLContext,
  args: DonationArgs
) => {
  const where = args.search
    ? { content: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};

  const donations = DonationModel.find({ creator: user._id }, where);

  return connectionFromMongoCursor({
    cursor: donations,
    context,
    args,
    loader: load,
  });
};

export const loadCandidateDonations = async (
  candidate: ICandidate,
  context: GraphQLContext,
  args: DonationArgs
) => {
  const where = args.search
    ? { content: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};

  const donations = DonationModel.find({ wager: candidate.wager }, where);

  return connectionFromMongoCursor({
    cursor: donations,
    context,
    args,
    loader: load,
  });
};

