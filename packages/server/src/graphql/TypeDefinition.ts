import Dataloader from 'dataloader';

import { IUser } from './modules/user/UserModel';
import { IWager } from './modules/wager/WagerModel';
import { IComment } from './modules/comment/CommentModel';
import { IBet } from './modules/bet/BetModel'
import {IDonation} from './modules/donation/DonationModel';
import {ICandidate} from './modules/candidate/CandidateModel';

type Key = string;

export type Dataloaders = {
  UserLoader: Dataloader<Key, IUser>;
  WagerLoader: Dataloader<Key, IWager>;
  CommentLoader: Dataloader<Key, IComment>;
  BetLoader: Dataloader<Key, IBet>;
  DonationLoader: Dataloader<Key,IDonation>
  CandidateLoader: Dataloader<Key,ICandidate>
};

export type GraphQLContext = {
  user?: IUser;
  isAuth?: boolean;
  dataloaders: Dataloaders;
};
