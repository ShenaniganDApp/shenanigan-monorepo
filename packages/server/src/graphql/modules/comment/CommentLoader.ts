import CommentModel from './CommentModel';
import { IWager, IComment } from '../../../models';

import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader,
} from '@entria/graphql-mongoose-loader';
import { ConnectionArguments, connectionFromArray } from 'graphql-relay';
import mongoose, { Types } from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;



import { GraphQLContext } from '../../TypeDefinition';


export default class Comment {
  id: string;

  _id: Types.ObjectId;

  content: string | null | undefined;

  creator: Types.ObjectId;
  
  wager: Types.ObjectId

  constructor(data: IComment) {
    this.id = data._id;
    this._id = data._id;
    this.wager = data.wager;
    this.content = data.content;
    this.creator = data.creator;
  }
}

export const getLoader = () =>
  new DataLoader((ids: ReadonlyArray<string>) =>
    mongooseLoader(CommentModel, ids)
  );

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  _id: string | Object | ObjectId
): Promise<Comment | null> => {
  if (!_id && typeof _id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.CommentLoader.load(_id as string);
  } catch (err) {
    return null;
  }

  return viewerCanSee() ? new Comment(data) : null;
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId
) => dataloaders.CommentLoader.clear(id.toString());

export const primeCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId,
  data: IComment
) => dataloaders.CommentLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (
  context: GraphQLContext,
  id: Types.ObjectId,
  data: IComment
) => clearCache(context, id) && primeCache(context, id, data);

type CommentArgs = ConnectionArguments & {
  search?: string;
};
export const loadComments = async (
  context: GraphQLContext,
  args: CommentArgs
) => {
  const where = args.search
    ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};
  const comments = CommentModel.find(where, {});
  // return connectionFromArray(comments, args)
  return connectionFromMongoCursor({
    cursor: comments,
    context,
    args,
    loader: load,
  });
};

export const loadWagerComments = async (
  wager: IWager,
  context: GraphQLContext,
  args: CommentArgs
) => {
  const where = args.search
    ? { content: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};

  const comments = CommentModel.find({ wager: wager._id },where/*  */);

  return connectionFromMongoCursor({
    cursor: comments,
    context,
    args,
    loader: load,
  });
};
