import Dataloader from 'dataloader';

import { IUser } from './modules/user/UserModel';
import { IWager } from './modules/wager/WagerModel';
import { IComment } from './modules/comment/CommentModel';
type Key = string;

export type Dataloaders = {
  UserLoader: Dataloader<Key, IUser>;
  WagerLoader: Dataloader<Key, IWager>;
  CommentLoader: Dataloader<Key, IComment>;
};

export type GraphQLContext = {
  user?: IUser;
  isAuth?: boolean;
  dataloaders: Dataloaders;
};
