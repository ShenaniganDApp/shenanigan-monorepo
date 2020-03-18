import Dataloader from 'dataloader';

import { IUser } from './modules/user/UserModel';
import { IWager } from './modules/wager/WagerModel'

type Key = string;

export type Dataloaders = {
  UserLoader: Dataloader<Key, IUser>;
  WagerLoader: Dataloader<Key, IWager>
};

export type GraphQLContext = {
  user?: IUser;
  isAuth?: boolean;
  dataloaders: Dataloaders;
};