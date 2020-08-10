import Dataloader from 'dataloader';

import { IUser } from './modules/user/UserModel';
import { IChallenge } from './modules/challenge/ChallengeModel';
import { IComment } from './modules/comment/CommentModel';
import { IPrediction } from './modules/prediction/PredictionModel'
import {IDonation} from './modules/donation/DonationModel';
import {ICandidate} from './modules/candidate/CandidateModel';

type Key = string;

export type Dataloaders = {
  UserLoader: Dataloader<Key, IUser>;
  ChallengeLoader: Dataloader<Key, IChallenge>;
  CommentLoader: Dataloader<Key, IComment>;
  PredictionLoader: Dataloader<Key, IPrediction>;
  DonationLoader: Dataloader<Key,IDonation>
  CandidateLoader: Dataloader<Key,ICandidate>
};

export type GraphQLContext = {
  user?: IUser;
  isAuth?: boolean;
  dataloaders: Dataloaders;
};
