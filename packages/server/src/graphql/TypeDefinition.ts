import mongoose from 'mongoose';

import { IUser } from './modules/user/UserModel';

declare type ObjectId = mongoose.Schema.Types.ObjectId;

export type LoaderFn = (ctx: GraphQLContext, id: string | ObjectId | object) => any;


export type GraphQLContext = {
  user?: IUser;
  isAuth?: boolean;
};
