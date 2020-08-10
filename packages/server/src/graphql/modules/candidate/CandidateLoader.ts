import CandidateModel, { ICandidate } from './CandidateModel';
import { IUser, IChallenge, IDonation } from '../../../models';

import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader,
} from '@entria/graphql-mongoose-loader';
import { ConnectionArguments, connectionFromArray } from 'graphql-relay';
import mongoose, { Types } from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;


import { GraphQLContext } from '../../TypeDefinition';

export default class Candidate {
    id: string;
  
    _id: Types.ObjectId;
  
    total: Number;
    rank: Number;
    creator: IUser;
    challenge: IChallenge;
    donations: IDonation[]

    constructor(data: ICandidate) {
      this.id = data._id;
      this._id = data._id;
      this.total = data.total;
      this.rank = data.rank;
      this.creator = data.creator;
      this.challenge = data.challenge;
      this.donations = data.donations;
    }
}

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  _id: string | Object | ObjectId
): Promise<Candidate | null> => {
  if (!_id && typeof _id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.CandidateLoader.load(_id as string);
  } catch (err) {
    return null;
  }

  return viewerCanSee() ? new Candidate(data) : null;
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId
) => dataloaders.CandidateLoader.clear(id.toString());

export const primeCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId,
  data: ICandidate
) => dataloaders.CandidateLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (
  context: GraphQLContext,
  id: Types.ObjectId,
  data: ICandidate
) => clearCache(context, id) && primeCache(context, id, data);

type CandidateArgs = ConnectionArguments & {
  search?: string;
};

export const loadCandidates = async (context: GraphQLContext, args: CandidateArgs) => {
    const where = args.search
      ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } }
      : {};
    const candidates = CandidateModel.find({},where);
  
    return connectionFromMongoCursor({
      cursor: candidates,
      context,
      args,
      loader: load,
    });
  };
  